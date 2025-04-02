#!/bin/bash

# contract_idパラメータを削除するスクリプト
find /Users/t002451/my_work/private/SmaregiMCP/openapi/pos/paths -name "*.yaml" | xargs grep -l "contract_id" | while read file; do
  echo "Processing $file"
  # Perlを使ってより確実に削除する
  perl -0777 -i -pe 's/    - name: contract_id\n      in: path\n      required: true\n      schema:\n        type: string\n      description: 契約ID\n//g' "$file"
done

echo "Completed removing contract_id parameters."
