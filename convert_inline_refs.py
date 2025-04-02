#!/usr/bin/env python3
import os
import re
import glob

def process_file(file_path):
    print(f"Processing {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return False
    
    # 1. Replace inline references to specific schema files
    modified_content = content
    
    # Get the relative path from the file to the schemas directory
    file_dir = os.path.dirname(file_path)
    rel_path_to_schemas = os.path.relpath('/Users/t002451/my_work/private/SmaregiMCP/schemas', file_dir)
    rel_path_to_schemas = rel_path_to_schemas.replace('\\', '/')  # Ensure forward slashes
    
    # Common schemas
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/Error(["\'])', 
        f'\\1{rel_path_to_schemas}/common/Error.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/Pagination(["\'])', 
        f'\\1{rel_path_to_schemas}/common/Pagination.yaml\\2', 
        modified_content
    )
    
    # Transaction schemas
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/Transaction(["\'])', 
        f'\\1{rel_path_to_schemas}/transactions/Transaction.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/TransactionCreate(["\'])', 
        f'\\1{rel_path_to_schemas}/transactions/TransactionCreate.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/TransactionDetail(["\'])', 
        f'\\1{rel_path_to_schemas}/transactions/TransactionDetail.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/Layaway(["\'])', 
        f'\\1{rel_path_to_schemas}/transactions/Layaway.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/LayawayCreate(["\'])', 
        f'\\1{rel_path_to_schemas}/transactions/LayawayCreate.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/PreSale(["\'])', 
        f'\\1{rel_path_to_schemas}/transactions/PreSale.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/PreSaleCreate(["\'])', 
        f'\\1{rel_path_to_schemas}/transactions/PreSaleCreate.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/PreSaleUpdate(["\'])', 
        f'\\1{rel_path_to_schemas}/transactions/PreSaleUpdate.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/TicketTransaction(["\'])', 
        f'\\1{rel_path_to_schemas}/transactions/TicketTransaction.yaml\\2', 
        modified_content
    )
    
    # Product schemas
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/Product(["\'])', 
        f'\\1{rel_path_to_schemas}/products/Product.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/ProductPrice(["\'])', 
        f'\\1{rel_path_to_schemas}/products/ProductPrice.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/ProductPriceChange(["\'])', 
        f'\\1{rel_path_to_schemas}/products/ProductPriceChange.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/ProductReserveItem(["\'])', 
        f'\\1{rel_path_to_schemas}/products/ProductReserveItem.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/ProductAttribute(["\'])', 
        f'\\1{rel_path_to_schemas}/products/ProductAttribute.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/ProductAttributeItem(["\'])', 
        f'\\1{rel_path_to_schemas}/products/ProductAttributeItem.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/ProductStore(["\'])', 
        f'\\1{rel_path_to_schemas}/products/ProductStore.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/ProductInventoryReservation(["\'])', 
        f'\\1{rel_path_to_schemas}/products/ProductInventoryReservation.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/ProductReserveItemLabel(["\'])', 
        f'\\1{rel_path_to_schemas}/products/ProductReserveItemLabel.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/ProductImage(["\'])', 
        f'\\1{rel_path_to_schemas}/products/ProductImage.yaml\\2', 
        modified_content
    )
    
    modified_content = re.sub(
        r'(\$ref: *["\'])#/components/schemas/ProductImageUpload(["\'])', 
        f'\\1{rel_path_to_schemas}/products/ProductImageUpload.yaml\\2', 
        modified_content
    )
    
    # 2. Remove ./ from existing relative paths
    modified_content = re.sub(r'\$ref: *(["\'])\./', '$ref: \\1', modified_content)
    
    # Write changes back if content was modified
    if modified_content != content:
        try:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(modified_content)
            print(f"Updated references in {file_path}")
            return True
        except Exception as e:
            print(f"Error writing file: {e}")
            return False
    else:
        print(f"No changes needed for {file_path}")
        return False

def main():
    paths_dir = "/Users/t002451/my_work/private/SmaregiMCP/paths"
    
    # Find all transaction YAML files first
    transaction_yaml_files = glob.glob(f"{paths_dir}/transactions/*.yaml")
    for file_path in transaction_yaml_files:
        process_file(file_path)
    
    # Then find all product YAML files
    product_yaml_files = glob.glob(f"{paths_dir}/products/*.yaml")
    for file_path in product_yaml_files:
        process_file(file_path)
    
    # Finally, process any remaining files with store product prices
    store_product_yaml_files = glob.glob(f"{paths_dir}/stores/stores_product_prices.yaml")
    for file_path in store_product_yaml_files:
        process_file(file_path)

if __name__ == "__main__":
    main()
