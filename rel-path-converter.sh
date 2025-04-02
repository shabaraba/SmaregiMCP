#!/bin/bash
# Convert absolute $ref paths to relative paths in OpenAPI YAML files

# Navigate to the repository root
cd /Users/t002451/my_work/private/SmaregiMCP

echo "Converting absolute \$ref paths to relative paths in OpenAPI YAML files..."

# Process all YAML files in the paths directory
find paths -name "*.yaml" -type f | while read -r file; do
  echo "Processing $file..."
  
  # Create a backup of the original file
  cp "$file" "${file}.bak"
  
  # Replace absolute paths with relative paths
  # This turns references like $ref: '../../schemas/common/Error.yaml'
  # into $ref: './../../schemas/common/Error.yaml'
  sed -i '' -E "s/\\\$ref: '([^#][^']*\.yaml)'/\\\$ref: '.\/\1'/g" "$file"
  sed -i '' -E 's/\$ref: "([^#][^"]*\.yaml)"/\$ref: ".\/\1"/g' "$file"
  
  # Check if changes were made
  if diff -q "$file" "${file}.bak" > /dev/null; then
    echo "  No absolute references found in $file"
    # Remove backup if no changes
    rm "${file}.bak"
  else
    echo "  Updated references in $file"
    # Keep backup for safety
  fi
done

# Process any YAML files in the schemas directory as well
find schemas -name "*.yaml" -type f | while read -r file; do
  echo "Processing $file..."
  
  # Create a backup of the original file
  cp "$file" "${file}.bak"
  
  # Replace absolute paths with relative paths
  sed -i '' -E "s/\\\$ref: '([^#][^']*\.yaml)'/\\\$ref: '.\/\1'/g" "$file"
  sed -i '' -E 's/\$ref: "([^#][^"]*\.yaml)"/\$ref: ".\/\1"/g' "$file"
  
  # Check if changes were made
  if diff -q "$file" "${file}.bak" > /dev/null; then
    echo "  No absolute references found in $file"
    rm "${file}.bak"
  else
    echo "  Updated references in $file"
  fi
done

echo "Conversion complete!"
