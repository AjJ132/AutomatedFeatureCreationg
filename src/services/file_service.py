import json
import os
from typing import Any, Generator

from src.services.parser_service import EXTENSION_TO_LANGUAGE

_SUPPORTED_EXTENSIONS = frozenset(EXTENSION_TO_LANGUAGE.keys())


class FileService:
    """Handles file system traversal and JSON persistence."""

    def walk_source_files(self, src_dir: str) -> Generator[str, None, None]:
        """Yield the path of every supported source file (.ts, .tsx, .py, .go)
        found recursively under src_dir.
        """
        for root, _, files in os.walk(src_dir):
            for file in files:
                if os.path.splitext(file)[1].lower() in _SUPPORTED_EXTENSIONS:
                    yield os.path.join(root, file)

    def save_json(self, data: Any, output_path: str) -> None:
        """Serialise data to a JSON file at output_path."""
        with open(output_path, "w") as f:
            json.dump(data, f, indent=2)
