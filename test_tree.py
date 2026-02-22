from tree_sitter_language_pack import get_language, get_parser

parser = get_parser("typescript")

code = b"""
export async function getSubcategories(req: Request, res: Response): Promise<void> {
  return;
}

export class InventoryService {
  async findAll(): Promise<Inventory[]> {
    return this.inventory;
  }
}
"""

tree = parser.parse(code)

def print_tree(node, indent=0):
    print("  " * indent + node.type)
    for child in node.children:
        print_tree(child, indent + 1)

print_tree(tree.root_node)
