import os

from tree_sitter_language_pack import get_parser

from src.types.chunk import Chunk


# Maps file extension → tree-sitter language name
EXTENSION_TO_LANGUAGE: dict[str, str] = {
    ".ts": "typescript",
    ".tsx": "typescript",
    ".py": "python",
    ".go": "go",
}

# Maps language → tree-sitter node type → human-readable chunk type label
_LANGUAGE_TARGET_TYPES: dict[str, dict[str, str]] = {
    "typescript": {
        "function_declaration": "function",
        "method_definition": "method",
        "class_declaration": "class",
        "arrow_function": "arrow_function",
        "lexical_declaration": "variable",   # const foo = () => ...
        "interface_declaration": "interface",
        "type_alias_declaration": "type",
    },
    "python": {
        "function_definition": "function",
        "class_definition": "class",
        "decorated_definition": "decorated",  # @decorator def/class ...
    },
    "go": {
        "function_declaration": "function",
        "method_declaration": "method",
        "type_declaration": "type",
    },
}

# Node types that hold a name inside them (checked in order)
_NAME_NODE_TYPES = {"identifier", "field_identifier", "type_identifier"}


class ParserService:
    """Handles parsing source files into discrete, indexable chunks.

    Supports TypeScript (.ts/.tsx), Python (.py), and Go (.go).
    Language parsers are loaded lazily on first use.
    """

    def __init__(self) -> None:
        self._parsers: dict[str, object] = {}  # language → parser (lazy)

    def _get_parser(self, language: str):
        if language not in self._parsers:
            self._parsers[language] = get_parser(language)
        return self._parsers[language]

    def _get_node_name(self, node, source_bytes: bytes) -> str | None:
        """Extract the name identifier from a node, if present."""
        for child in node.children:
            if child.type in _NAME_NODE_TYPES:
                return source_bytes[child.start_byte:child.end_byte].decode("utf-8")
        # For decorated definitions, delegate to the inner def/class node
        if node.type == "decorated_definition":
            for child in node.children:
                if child.type in ("function_definition", "class_definition"):
                    return self._get_node_name(child, source_bytes)
        return None

    def detect_language(self, file_path: str) -> str | None:
        """Return the language name for a file path, or None if unsupported."""
        ext = os.path.splitext(file_path)[1].lower()
        return EXTENSION_TO_LANGUAGE.get(ext)

    def extract_chunks(self, file_path: str) -> list[Chunk]:
        """Parse a source file and return all meaningful code chunks.

        Language is detected automatically from the file extension.
        Returns an empty list for unsupported file types.
        """
        language = self.detect_language(file_path)
        if language is None:
            return []

        target_types = _LANGUAGE_TARGET_TYPES[language]
        parser = self._get_parser(language)

        with open(file_path, "rb") as f:
            source_bytes = f.read()

        tree = parser.parse(source_bytes)  # type: ignore[union-attr]
        chunks: list[Chunk] = []

        def walk(node) -> None:
            if node.type in target_types:
                content = source_bytes[node.start_byte:node.end_byte].decode("utf-8")
                name = self._get_node_name(node, source_bytes)

                # Skip tiny chunks — likely not meaningful
                if len(content.strip()) >= 20:
                    chunks.append(Chunk(
                        content=content,
                        file_path=file_path,
                        function_name=name or "anonymous",
                        start_line=node.start_point[0] + 1,  # tree-sitter is 0-indexed
                        end_line=node.end_point[0] + 1,
                        language=language,
                        chunk_type=target_types[node.type],
                    ))

            for child in node.children:
                walk(child)

        walk(tree.root_node)
        return chunks
