import os
import json
import chromadb
from tree_sitter_language_pack import get_language, get_parser

# ── Setup ──────────────────────────────────────────────────────────────────────

chroma_client = chromadb.Client()
collection = chroma_client.create_collection(name="codebase")

TS_LANGUAGE = get_language("typescript")
parser = get_parser("typescript")

# ── Chunk extraction ───────────────────────────────────────────────────────────

def get_node_name(node, source_bytes):
    """Try to extract the name of a function/class/method node."""
    for child in node.children:
        if child.type == "identifier":
            return source_bytes[child.start_byte:child.end_byte].decode("utf-8")
    return None

def extract_chunks(file_path: str) -> list[dict]:
    """Parse a TypeScript file and extract function/class/method chunks."""
    with open(file_path, "rb") as f:
        source_bytes = f.read()

    tree = parser.parse(source_bytes)
    chunks = []

    # Node types we care about
    TARGET_TYPES = {
        "function_declaration": "function",
        "method_definition": "method",
        "class_declaration": "class",
        "arrow_function": "arrow_function",
        "lexical_declaration": "variable",    # const foo = () => ...
        "interface_declaration": "interface",
        "type_alias_declaration": "type",
    }

    def walk(node):
        if node.type in TARGET_TYPES:
            content = source_bytes[node.start_byte:node.end_byte].decode("utf-8")
            name = get_node_name(node, source_bytes)

            # Skip tiny chunks — likely not meaningful
            if len(content.strip()) < 20:
                return

            chunks.append({
                "content": content,
                "file_path": file_path,
                "function_name": name or "anonymous",
                "start_line": node.start_point[0] + 1,  # tree-sitter is 0-indexed
                "end_line": node.end_point[0] + 1,
                "language": "typescript",
                "chunk_type": TARGET_TYPES[node.type],
            })

            # Don't recurse into this node's children to avoid duplicate chunks
            # (e.g. a method inside a class would otherwise appear twice)
            # return

        for child in node.children:
            walk(child)

    walk(tree.root_node)
    return chunks

# ── Indexing ───────────────────────────────────────────────────────────────────

def index_directory(src_dir: str):
    """Walk a directory, parse .ts files, and index all chunks."""
    all_chunks = []

    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(".ts"):
                file_path = os.path.join(root, file)
                print(f"Indexing: {file_path}")
                chunks = extract_chunks(file_path)
                all_chunks.extend(chunks)
                print(f"  → {len(chunks)} chunks found")

    if not all_chunks:
        print("No chunks found.")
        return

    # ChromaDB needs: ids, documents (the text to embed), and metadatas
    ids = [f"chunk_{i}" for i in range(len(all_chunks))]
    documents = [c["content"] for c in all_chunks]
    metadatas = [
        {k: v for k, v in c.items() if k != "content"}  # everything except content
        for c in all_chunks
    ]

    collection.add(ids=ids, documents=documents, metadatas=metadatas)
    print(f"\nIndexed {len(all_chunks)} total chunks into ChromaDB.")

    # Save chunks to JSON file
    output_file = "chunks.json"
    with open(output_file, "w") as f:
        json.dump(all_chunks, f, indent=2)
    print(f"Saved chunks to {output_file}")

# ── Query ──────────────────────────────────────────────────────────────────────

def search(query: str, n_results: int = 3):
    """Search the index and return structured results."""
    results = collection.query(query_texts=[query], n_results=n_results)

    hits = []
    for i in range(len(results["ids"][0])):
        hit = {
            "content": results["documents"][0][i],
            **results["metadatas"][0][i],
            "score": results["distances"][0][i],  # lower = more similar (L2 distance)
        }
        hits.append(hit)

    return hits

# ── Main ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    index_directory("sample_repo/src")

    print("\n── Search: 'find a user by id' ──")
    hits = search("Where are the wild mamals?")
    with open("search_results.json", "w") as f:
        json.dump(hits, f, indent=2)
    for hit in hits:
        print(json.dumps(hit, indent=2))