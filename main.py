import json

from dotenv import load_dotenv

from src.services.chroma_service import ChromaService
from src.services.file_service import FileService
from src.services.parser_service import ParserService
from src.usecase.chat.chat_usecase import ChatUseCase
from src.usecase.index_codebase_usecase import IndexCodebaseUseCase
from src.usecase.orchestration.orchestration_usecase import OrchestrationUseCase
from src.usecase.search_codebase_usecase import SearchCodebaseUseCase

if __name__ == "__main__":
    load_dotenv()

    initial_prompt = ""
    with open("sample_requirements/#1/prompt.md", "r") as f:
        initial_prompt = f.read()

    results = {
        "testCase1": [],
        "testCase2": [],
        "testCase3": [],
    }
    iterations = 5

    orchestration_usecase = OrchestrationUseCase()
    # for i in range(iterations):
    #     result = orchestration_usecase.execute(initial_prompt=initial_prompt)
    #     results["testCase1"].append(result)

    # initial_prompt = ""
    # with open("sample_requirements/#2/prompt.md", "r") as f:
    #     initial_prompt = f.read()

    # for i in range(iterations):
    #     result = orchestration_usecase.execute(initial_prompt=initial_prompt)
    #     results["testCase2"].append(result)

    initial_prompt = ""
    with open("sample_requirements/#3/prompt.md", "r") as f:
        initial_prompt = f.read()

    for i in range(iterations):
        result = orchestration_usecase.execute(initial_prompt=initial_prompt)
        results["testCase3"].append(result)

    print(json.dumps(results, indent=2))

    # # ── Wire up services ───────────────────────────────────────────────────────
    # parser_service = ParserService()
    # chroma_service = ChromaService()
    # file_service = FileService()

    # # ── Wire up use cases ──────────────────────────────────────────────────────
    # index_usecase = IndexCodebaseUseCase(parser_service, chroma_service, file_service)
    # search_usecase = SearchCodebaseUseCase(chroma_service, file_service)
    # chat_usecase = ChatUseCase(search_usecase)

    # # ── Run ────────────────────────────────────────────────────────────────────
    # # Index the full sample repo — TypeScript, Python, and Go files are all picked up
    # index_usecase.execute("sample_repo", chunks_output_path="chunks.json")

    # question = "What kind of database are we storing information in?"

    # print("\n── Search: 'What kind of database are we storing information in?' ──")
    # hits = search_usecase.execute(
    #     query=question,
    #     n_results=3,
    #     output_path="search_results.json",
    # )
    # for hit in hits:
    #     print(json.dumps(hit, indent=2))

    # print("\n── Chat test with tool calling ──")
    # response = chat_usecase.execute(
    #     question,
    # )
    # print(response)
