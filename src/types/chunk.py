from typing import TypedDict


class Chunk(TypedDict):
    content: str
    file_path: str
    function_name: str
    start_line: int
    end_line: int
    language: str
    chunk_type: str
