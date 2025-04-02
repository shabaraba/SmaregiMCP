#!/usr/bin/env python3
"""
Script to remove './' prefixes from $ref paths in OpenAPI YAML files.
This script updates all $ref paths to remove the './' prefix while keeping them as relative paths.
"""

import os
import re
import glob

def remove_dot_slash_in_file(file_path):
    """Remove './' prefixes from $ref paths in a single file."""
    
    print(f"Processing {file_path}...")
    
    # Create a backup of the original file
    backup_path = f"{file_path}.bak"
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
    except Exception as e:
        print(f"  Error reading file: {e}")
        return False
    
    # Save backup
    with open(backup_path, 'w', encoding='utf-8') as backup:
        backup.write(content)
    
    # Pattern to match $ref values with './' prefixes before the relative path
    # This replaces $ref: './../../path/to/file.yaml' patterns with $ref: '../../path/to/file.yaml'
    pattern = r"(\$ref:\s*['\"])\./(\.\.\/.*?\.yaml)(['\"])"
    replacement = r"\1\2\3"
    
    # Replace './../../' with '../../'
    modified_content = re.sub(pattern, replacement, content)
    
    # Only update if changes were made
    if modified_content != content:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(modified_content)
        print(f"  Updated references in {file_path}")
        return True
    else:
        print(f"  No references to update in {file_path}")
        # Remove backup if no changes
        os.remove(backup_path)
        return False

def process_yaml_files(directory):
    """Process all YAML files in the specified directory."""
    updated_files = 0
    
    # Find all YAML files
    yaml_files = glob.glob(os.path.join(directory, "**/*.yaml"), recursive=True)
    print(f"Found {len(yaml_files)} YAML files in {directory}")
    
    # Process each file
    for file_path in yaml_files:
        if remove_dot_slash_in_file(file_path):
            updated_files += 1
    
    return updated_files

def main():
    # Check paths directory
    paths_dir = "/Users/t002451/my_work/private/SmaregiMCP/paths"
    print(f"Processing files in {paths_dir}...")
    paths_updated = process_yaml_files(paths_dir)
    
    # Check schemas directory
    schemas_dir = "/Users/t002451/my_work/private/SmaregiMCP/schemas"
    print(f"Processing files in {schemas_dir}...")
    schemas_updated = process_yaml_files(schemas_dir)
    
    # Check root openapi.yaml
    root_file = "/Users/t002451/my_work/private/SmaregiMCP/openapi.yaml"
    root_updated = 1 if remove_dot_slash_in_file(root_file) else 0
    
    # Print summary
    total_updated = paths_updated + schemas_updated + root_updated
    print(f"\nSummary: Updated {total_updated} files")
    print(f"  - Paths: {paths_updated} files")
    print(f"  - Schemas: {schemas_updated} files")
    print(f"  - Root: {root_updated} files")

if __name__ == "__main__":
    main()
