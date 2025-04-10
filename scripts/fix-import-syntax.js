/**
 * Script to fix 'import import' syntax errors in TypeScript files
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

// Regex pattern to match redundant import statements
const IMPORT_IMPORT_PATTERN = /import\s+import\s+/g;

/**
 * Process a directory recursively
 */
function processDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      processDirectory(filePath);
    } else if (stats.isFile() && (file.endsWith('.ts') || file.endsWith('.js'))) {
      fixImportSyntax(filePath);
    }
  }
}

/**
 * Fix import syntax in a file
 */
function fixImportSyntax(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (IMPORT_IMPORT_PATTERN.test(content)) {
      // Reset the pattern's lastIndex property
      IMPORT_IMPORT_PATTERN.lastIndex = 0;
      
      // Replace redundant 'import import' with 'import'
      const fixedContent = content.replace(IMPORT_IMPORT_PATTERN, 'import ');
      
      // Write the fixed content back to the file
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      
      console.log(`Fixed import syntax in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Main execution
console.log('Fixing import syntax errors...');
processDirectory(srcDir);
console.log('Import syntax fix complete!');
