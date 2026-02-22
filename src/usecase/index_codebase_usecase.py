from src.services.chroma_service import ChromaService
from src.services.file_service import FileService
from src.services.parser_service import ParserService
from src.types.chunk import Chunk


class IndexCodebaseUseCase:
    """
    Orchestrates the full indexing pipeline:
      1. Walk a source directory for supported source files (TS, Python, Go).
      2. Parse each file into code chunks.
      3. Store all chunks in the vector store.
      4. Persist a copy of the chunks to disk as JSON.
    """

    def __init__(
        self,
        parser_service: ParserService,
        chroma_service: ChromaService,
        file_service: FileService,
    ) -> None:
        self._parser = parser_service
        self._chroma = chroma_service
        self._file = file_service

    def execute(
        self, src_dir: str, chunks_output_path: str = "chunks.json"
    ) -> list[Chunk]:
        all_chunks: list[Chunk] = []

        for file_path in self._file.walk_source_files(src_dir):
            print(f"Indexing: {file_path}")
            chunks = self._parser.extract_chunks(file_path)
            all_chunks.extend(chunks)
            print(f"  → {len(chunks)} chunks found")

        if not all_chunks:
            print("No chunks found.")
            return []

        self._chroma.add_chunks(all_chunks)
        print(f"\nIndexed {len(all_chunks)} total chunks into ChromaDB.")

        self._file.save_json(all_chunks, chunks_output_path)
        print(f"Saved chunks to {chunks_output_path}")

        return all_chunks
