import chromadb

from src.types.chunk import Chunk


class ChromaService:
    """Manages all interactions with the ChromaDB vector store."""

    def __init__(self, collection_name: str = "codebase") -> None:
        self._client = chromadb.Client()
        self._collection = self._client.create_collection(name=collection_name)

    def add_chunks(self, chunks: list[Chunk], id_offset: int = 0) -> None:
        """Embed and store a list of code chunks."""
        if not chunks:
            return

        ids = [f"chunk_{i + id_offset}" for i in range(len(chunks))]
        documents = [c["content"] for c in chunks]
        # ChromaDB metadata values must be str | int | float | bool
        metadatas = [
            {
                k: str(v) if not isinstance(v, (int, float, bool)) else v
                for k, v in chunk.items()
                if k != "content"
            }
            for chunk in chunks
        ]

        self._collection.add(ids=ids, documents=documents, metadatas=metadatas)  # type: ignore

    def query(self, query_text: str, n_results: int = 3) -> list[dict]:
        """Query the vector store and return ranked hits with metadata."""
        results = self._collection.query(query_texts=[query_text], n_results=n_results)

        ids_list = (results.get("ids") or [[]])[0]
        hits: list[dict] = []
        for i in range(len(ids_list)):
            hit: dict = {
                "content": results["documents"][0][i],  # type: ignore
                **results["metadatas"][0][i],  # type: ignore
                "score": results["distances"][0][i],  # type: ignore  # lower = more similar (L2)
            }
            hits.append(hit)

        return hits
