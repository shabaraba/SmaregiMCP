#!/usr/bin/env python3
"""
Script to convert absolute $ref paths to relative paths in OpenAPI YAML files.
This script finds all YAML files in the specified directory and converts
any $ref paths that don't start with './' or '../' to start with './' for relative paths.
"""

import os
import re
import sys
import glob

def convert_refs_in_file(file_path):
    """Convert absolute $ref paths to relative paths in a single file."""
    
    print(f"Processing {file_path}...")
    
    # Create a backup of the original file
    backup_path = file_path + '.bak'
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
    except Exception as e:
        print(f"  Error reading file: {e}")
        return False
    
    with open(backup_path, 'w', encoding='utf-8') as backup:
        backup.write(content)
    
    # Pattern to match $ref values that aren't already relative
    # This looks for $ref: '...' or $ref: "..." patterns where the path doesn't start with ./ or ../ or #/
    pattern = r'(\$ref:\s*[\'"])(?!\.\/|\.\.\/|#\/)(.*?[\'"])'
    replacement = r'\1./\2'
    
    # Replace absolute paths with relative paths
    modified_content = re.sub(pattern, replacement, content)
    
    # Only update if changes were made
    if modified_content != content:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(modified_content)
        print(f"  Updated references in {file_path}")
        return True
    else:
        print(f"  No absolute references found in {file_path}")
        # Remove backup if no changes
        os.remove(backup_path)
        return False

def find_yaml_files(directory):
    """Find all YAML files in the specified directory and its subdirectories."""
    yaml_files = []
    for extension in ['*.yaml', '*.yml']:
        yaml_files.extend(glob.glob(os.path.join(directory, '**', extension), recursive=True))
    return yaml_files

def find_openapi_files(yaml_files):
    """Filter YAML files to find OpenAPI specification files."""
    openapi_files = []
    openapi_indicators = ['openapi:', 'swagger:', 'paths:', 'components:']
    
    for file_path in yaml_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read(1000)  # Read just the first 1000 characters
                if any(indicator in content for indicator in openapi_indicators):
                    openapi_files.append(file_path)
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
    
    return openapi_files

def main():
    # Set the base directory to search
    if len(sys.argv) > 1:
        base_dir = sys.argv[1]
    else:
        base_dir = os.getcwd()
    
    print(f"Searching for OpenAPI YAML files in {base_dir}...")
    
    # Find all YAML files
    yaml_files = find_yaml_files(base_dir)
    print(f"Found {len(yaml_files)} YAML files.")
    
    # Filter to find OpenAPI files
    openapi_files = find_openapi_files(yaml_files)
    print(f"Found {len(openapi_files)} OpenAPI specification files.")
    
    # Process each OpenAPI file
    updated_files = 0
    for file_path in openapi_files:
        if convert_refs_in_file(file_path):
            updated_files += 1
    
    print(f"\nSummary: Updated {updated_files} files out of {len(openapi_files)} OpenAPI files.")

if __name__ == "__main__":
    main()
