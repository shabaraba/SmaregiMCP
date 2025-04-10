/**
 * Script to copy static assets from src to dist
 * Used during the build process to ensure all static files are available in the build output
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

// Array of file extensions to copy
const STATIC_EXTENSIONS = [
  '.html',
  '.css',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.json',
  // Add other static file extensions as needed
];

// Additional directories that need to be explicitly copied
const COPY_DIRECTORIES = [
  'tools/generated'
];

/**
 * Check if a file should be copied based on its extension
 */
function isStaticFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return STATIC_EXTENSIONS.includes(ext);
}

/**
 * Create a directory if it doesn't exist
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Copy a file from src to dist
 */
function copyFile(srcPath, distPath) {
  try {
    const targetDir = path.dirname(distPath);
    ensureDirectoryExists(targetDir);
    fs.copyFileSync(srcPath, distPath);
    console.log(`Copied: ${srcPath} -> ${distPath}`);
  } catch (error) {
    console.error(`Error copying file ${srcPath}:`, error);
  }
}

/**
 * Recursively copy static files from source to destination
 */
function copyStaticFiles(srcPath, distPath) {
  const stats = fs.statSync(srcPath);
  
  if (stats.isDirectory()) {
    const files = fs.readdirSync(srcPath);
    
    for (const file of files) {
      const nestedSrcPath = path.join(srcPath, file);
      const nestedDistPath = path.join(distPath, file);
      
      if (fs.statSync(nestedSrcPath).isDirectory()) {
        copyStaticFiles(nestedSrcPath, nestedDistPath);
      } else if (isStaticFile(nestedSrcPath)) {
        copyFile(nestedSrcPath, nestedDistPath);
      }
    }
  } else if (isStaticFile(srcPath)) {
    copyFile(srcPath, distPath);
  }
}

/**
 * Copy specific directories completely (including all files regardless of extension)
 */
function copyDirectory(src, dest) {
  ensureDirectoryExists(dest);
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

// Main execution
console.log('Copying static assets...');

// Copy static files based on extension
copyStaticFiles(srcDir, distDir);

// Copy specific directories completely
for (const dir of COPY_DIRECTORIES) {
  const srcDirPath = path.join(srcDir, dir);
  const distDirPath = path.join(distDir, dir);
  
  if (fs.existsSync(srcDirPath)) {
    console.log(`Copying directory: ${dir}`);
    copyDirectory(srcDirPath, distDirPath);
  } else {
    console.warn(`Warning: Directory not found: ${srcDirPath}`);
  }
}

console.log('Static assets copy complete!');
