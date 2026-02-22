from typing import Any
from openai import OpenAI


class ChatUseCase:
    def __init__(self) -> None:
        self.client = OpenAI()
        self.model = "gpt-5.2"

    def chat(
        self,
        user_message: str,
        system_prompt: str | None = None,
        conversation_history: list[dict[str, Any]] | None = None,
        temperature: float = 0,
    ) -> str:
        messages: list[dict[str, Any]] = []

        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})

        messages.extend(conversation_history or [])
        messages.append({"role": "user", "content": user_message})

        # ── DEBUG LOGGING ──────────────────────────────────────────────────────
        print("\n" + "=" * 60)
        print("[DEBUG] OUTGOING MESSAGES")
        print("=" * 60)
        for msg in messages:
            print(f"\n[{msg['role'].upper()}]\n{msg['content']}")
        print("=" * 60 + "\n")

        completion = self.client.chat.completions.create(
            model=self.model,
            messages=messages,  # type: ignore[arg-type]
            temperature=1.0,
            reasoning_effort="medium",
        )

        response = completion.choices[0].message.content or ""

        # ── DEBUG LOGGING ──────────────────────────────────────────────────────
        print("\n" + "=" * 60)
        print("[DEBUG] AI RESPONSE")
        print("=" * 60)
        print(response)
        print("=" * 60 + "\n")

        return response