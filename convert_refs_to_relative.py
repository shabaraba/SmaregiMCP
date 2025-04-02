#!/usr/bin/env python3
"""
このスクリプトは、OpenAPI YAMLファイル内のインライン参照（#/components/schemas/...）を
相対パス参照（'../../schemas/...'）に変換します。
"""

import os
import re
import glob

# スキーマ名と実際のファイル相対パスのマッピングを保持する辞書
schema_file_map = {}

def load_schema_map():
    """
    schemas/_index.yaml から、スキーマ名とファイルパスのマッピングを読み込みます。
    テキストベースの処理で、YAMLパーサーを使用せずに解析します。
    """
    index_file = "/Users/t002451/my_work/private/SmaregiMCP/schemas/_index.yaml"
    
    try:
        with open(index_file, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            
            for line in lines:
                # コメント行または空行をスキップ
                if line.strip().startswith('#') or not line.strip():
                    continue
                
                # 行を解析して、スキーマ名と参照パスを抽出
                parts = line.strip().split(':', 1)
                if len(parts) == 2:
                    schema_name = parts[0].strip()
                    ref_line = parts[1].strip()
                    
                    # $ref: './path/to/schema.yaml' 形式を解析
                    ref_match = re.match(r"\$ref:\s*['\"](\./.+)['\"]", ref_line)
                    if ref_match:
                        # ./categories/Category.yaml のような形式を ../../schemas/categories/Category.yaml に変換
                        ref_path = ref_match.group(1)
                        ref_path = '../../schemas' + ref_path[1:]
                        schema_file_map[schema_name] = ref_path
    except Exception as e:
        print(f"Error loading schema map: {e}")
        return False
    
    print(f"Loaded {len(schema_file_map)} schema mappings")
    return True

def convert_file(file_path):
    """
    ファイル内のインライン参照を相対パス参照に変換します。
    """
    print(f"Processing {file_path}...")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
    except Exception as e:
        print(f"  Error reading file: {e}")
        return False
    
    # バックアップを作成
    backup_path = f"{file_path}.bak"
    with open(backup_path, 'w', encoding='utf-8') as backup:
        backup.write(content)
    
    # #/components/schemas/XYZ の形式を検出して置換
    pattern = r'(\$ref:\s*[\'"])(#/components/schemas/)([\w-]+)([\'"])'
    
    def replace_ref(match):
        prefix = match.group(1)
        schema_name = match.group(3)
        suffix = match.group(4)
        
        if schema_name in schema_file_map:
            return f"{prefix}{schema_file_map[schema_name]}{suffix}"
        else:
            print(f"  Warning: Schema '{schema_name}' not found in schema map")
            return match.group(0)
    
    modified_content = re.sub(pattern, replace_ref, content)
    
    # 変更があった場合のみファイルを更新
    if modified_content != content:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(modified_content)
        print(f"  Updated references in {file_path}")
        return True
    else:
        print(f"  No references to update in {file_path}")
        os.remove(backup_path)  # バックアップ削除
        return False

def process_directory(directory):
    """
    指定されたディレクトリ内のYAMLファイルを処理します。
    """
    yaml_files = glob.glob(os.path.join(directory, "**/*.yaml"), recursive=True)
    print(f"Found {len(yaml_files)} YAML files in {directory}")
    
    updated_files = 0
    for file_path in yaml_files:
        if convert_file(file_path):
            updated_files += 1
    
    return updated_files

def main():
    # スキーママッピングをロード
    if not load_schema_map():
        print("Failed to load schema mappings. Exiting.")
        return
    
    # pathsディレクトリを処理
    paths_dir = "/Users/t002451/my_work/private/SmaregiMCP/paths"
    updated_files = process_directory(paths_dir)
    
    print(f"\nSummary: Updated {updated_files} files")

if __name__ == "__main__":
    main()
