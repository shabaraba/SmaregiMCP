#!/bin/bash

# 空のparametersセクションを修正するスクリプト
find /Users/t002451/my_work/private/SmaregiMCP/openapi/pos/paths -name "*.yaml" | while read file; do
  echo "Processing $file"
  # emptyパラメータセクションを削除
  perl -0777 -i -pe 's/  parameters:\n  (?=\w)/  /g' "$file"
done

echo "Completed fixing empty parameters sections."
