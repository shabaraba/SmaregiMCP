import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../utils/node-config.js';

/**
 * Initialize the database with all required tables
 */
export async function initializeDatabase(): Promise<void> {
  const dbPath = config.databasePath;
  
  // Ensure directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  // Open database
  const db = new sqlite3.Database(dbPath);
  const runAsync = promisify(db.run.bind(db));
  
  try {
    console.error('[INFO] Initializing database schema...');
    
    // Read and execute schema.sql
    const schemaPath = path.join(path.dirname(import.meta.url.replace('file://', '')), 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      await runAsync(statement);
    }
    
    console.error('[INFO] Database schema initialized successfully');
  } catch (error) {
    console.error(`[ERROR] Failed to initialize database: ${error}`);
    throw error;
  } finally {
    // Close database
    await new Promise<void>((resolve, reject) => {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

// If run directly, initialize the database
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialized successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to initialize database:', error);
      process.exit(1);
    });
}