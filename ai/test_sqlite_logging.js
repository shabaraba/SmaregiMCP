// Simple test to see what output SQLite generates
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Get the project root path
const projectRoot = path.resolve(__dirname, '..');
const dbPath = path.resolve(projectRoot, 'smaregi-mcp.sqlite');

console.error('Testing SQLite logging behavior...');
console.error(`Database path: ${dbPath}`);

// Open the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(`Error opening database: ${err.message}`);
    return;
  }
  console.error('Connected to the SQLite database.');
  
  // Run a simple query to see what output is generated
  db.all('SELECT name FROM sqlite_master WHERE type="table"', [], (err, rows) => {
    if (err) {
      console.error(`Query error: ${err.message}`);
      return;
    }
    
    console.error('Tables in database:');
    rows.forEach(row => {
      console.error(`- ${row.name}`);
    });
    
    // Close the database
    db.close((err) => {
      if (err) {
        console.error(`Error closing database: ${err.message}`);
        return;
      }
      console.error('Database connection closed.');
    });
  });
});
