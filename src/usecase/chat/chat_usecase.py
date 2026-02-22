import json
import os
from typing import Any

from openai import OpenAI

from src.usecase.search_codebase_usecase import SearchCodebaseUseCase


class ChatUseCase:
    """Runs an OpenAI chat loop with tool calling for codebase search."""

    def __init__(
        self,
        search_codebase_usecase: SearchCodebaseUseCase,
        model: str | None = None,
        max_tool_rounds: int = 3,
        client: OpenAI | None = None,
    ) -> None:
        self._search_usecase = search_codebase_usecase
        self._model = model or os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
        self._max_tool_rounds = max_tool_rounds
        self._client = client or OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    @property
    def _system_prompt(self) -> str:
        return (
            "You are a codebase assistant. "
            "Use the `codebase_search` tool whenever you need repository facts. "
            "Only make claims grounded in tool results or user input. "
            "Be concise and practical."
        )

    @property
    def _tools(self) -> list[dict[str, Any]]:
        return [
            {
                "type": "function",
                "function": {
                    "name": "codebase_search",
                    "description": (
                        "Semantic search across indexed source code (TypeScript, Python, Go)."
                    ),
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "Natural language search query.",
                            },
                            "n_results": {
                                "type": "integer",
                                "description": "Maximum number of results.",
                                "minimum": 1,
                                "maximum": 20,
                                "default": 5,
                            },
                        },
                        "required": ["query"],
                    },
                },
            }
        ]

    def _run_tool(self, tool_name: str, arguments: str) -> str:
        if tool_name != "codebase_search":
            return json.dumps({"error": f"Unknown tool: {tool_name}"})

        try:
            parsed_args = json.loads(arguments) if arguments else {}
        except json.JSONDecodeError:
            return json.dumps({"error": "Invalid JSON arguments for codebase_search"})

        query = str(parsed_args.get("query", "")).strip()
        if not query:
            return json.dumps({"error": "Missing required argument: query"})

        n_results = parsed_args.get("n_results", 5)
        if not isinstance(n_results, int):
            try:
                n_results = int(n_results)
            except (TypeError, ValueError):
                n_results = 5

        n_results = max(1, min(20, n_results))
        hits = self._search_usecase.execute(query=query, n_results=n_results)

        return json.dumps(
            {
                "query": query,
                "count": len(hits),
                "results": hits,
            },
            ensure_ascii=False,
        )

    def execute(
        self,
        user_message: str,
        conversation_history: list[dict[str, Any]] | None = None,
    ) -> str:
        messages: list[dict[str, Any]] = [
            {"role": "system", "content": self._system_prompt},
            *(conversation_history or []),
            {"role": "user", "content": user_message},
        ]

        for _ in range(self._max_tool_rounds + 1):
            completion = self._client.chat.completions.create(
                model=self._model,
                messages=messages,  # type: ignore[arg-type]
                tools=self._tools,  # type: ignore[arg-type]
                tool_choice="auto",
                temperature=0,
            )

            message = completion.choices[0].message
            tool_calls: list[Any] = list(message.tool_calls or [])

            if not tool_calls:
                return message.content or ""

            messages.append(
                {
                    "role": "assistant",
                    "content": message.content or "",
                    "tool_calls": [
                        {
                            "id": call.id,
                            "type": call.type,
                            "function": {
                                "name": getattr(getattr(call, "function", None), "name", ""),
                                "arguments": getattr(getattr(call, "function", None), "arguments", "{}"),
                            },
                        }
                        for call in tool_calls
                        if getattr(call, "type", "") == "function"
                    ],
                }
            )

            for call in tool_calls:
                if getattr(call, "type", "") != "function":
                    continue

                function_payload = getattr(call, "function", None)
                if function_payload is None:
                    continue

                tool_output = self._run_tool(
                    getattr(function_payload, "name", ""),
                    getattr(function_payload, "arguments", "{}"),
                )
                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": call.id,
                        "content": tool_output,
                    }
                )

        return "I reached the tool-calling limit. Please try a narrower question."