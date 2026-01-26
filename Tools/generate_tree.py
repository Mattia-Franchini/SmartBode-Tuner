import os
from pathlib import Path

# ==========================================
# CONFIGURATION
# ==========================================

# Standard garbage files to ignore
IGNORE_LIST = {
    '.git', 
    '.gitignore', 
    '.ds_store', 
    '__pycache__', 
    '.pio', 
    '.vscode',
    '.idea',
    'node_modules',
    'repository_tree.md'
}

# Output location
OUTPUT_REL_PATH = Path("Docs/Project_Structure/repository_tree.md")

# ==========================================
# LOGIC
# ==========================================

def generate_tree_structure(current_path: Path, prefix: str = ""):
    """
    Recursive function to generate the tree string.
    Adds a slash to directories and spacers after directory blocks.
    """
    output_string = ""
    
    try:
        # Sort items: Directories and files mixed, alphabetical order (case insensitive)
        items = sorted(os.listdir(current_path), key=lambda s: s.lower())
    except PermissionError:
        return ""

    # Filter out ignored items
    items = [item for item in items if item not in IGNORE_LIST]
    
    count = len(items)
    for i, item in enumerate(items):
        is_last = (i == count - 1)
        path = current_path / item
        is_dir = path.is_dir()
        
        # 1. Add Trailing Slash if it is a directory
        display_name = f"{item}/" if is_dir else item

        # Determine the connector symbol
        connector = "└── " if is_last else "├── "
        
        # Append the item line
        output_string += f"{prefix}{connector}{display_name}\n"
        
        if is_dir:
            # Prepare prefix for children
            extension = "    " if is_last else "│   "
            
            # Recursive call
            output_string += generate_tree_structure(path, prefix + extension)
            
            # 2. Add Smart Spacer (The "New Line" logic)
            # We only add a spacer line if this folder is NOT the last item in the list.
            # This separates this folder block from the next sibling.
            if not is_last:
                output_string += f"{prefix}│\n"

    return output_string

def main():
    # 1. Determine Project Root
    script_location = Path(__file__).resolve()
    project_root = script_location.parent.parent
    
    print(f"Project Root detected at: {project_root}")

    # 2. Generate the Tree String
    tree_body = generate_tree_structure(project_root)
    
    # 3. Construct Final Content
    final_content = (
        "```\n"
        f"{project_root.name}/\n"
        f"{tree_body}"
        "```\n"
    )

    # 4. Write File
    output_file = project_root / OUTPUT_REL_PATH
    output_file.parent.mkdir(parents=True, exist_ok=True)

    try:
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(final_content)
        print(f"Tree generated successfully at: {output_file}")
    except Exception as e:
        print(f"Error writing file: {e}")

if __name__ == "__main__":
    main()