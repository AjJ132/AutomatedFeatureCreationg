from src.services.chroma_service import ChromaService
from src.services.file_service import FileService


class SearchCodebaseUseCase:
    """
    Orchestrates a semantic search against the indexed codebase:
      1. Query the vector store with natural language.
      2. Optionally persist the results to disk as JSON.
      3. Return the ranked list of hits.
    """

    def __init__(
        self,
        chroma_service: ChromaService,
        file_service: FileService,
    ) -> None:
        self._chroma = chroma_service
        self._file = file_service

    def execute(
        self,
        query: str,
        n_results: int = 3,
        output_path: str | None = None,
    ) -> list[dict]:
        hits = self._chroma.query(query, n_results)

        if output_path:
            self._file.save_json(hits, output_path)

        return hits
