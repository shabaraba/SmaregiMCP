// Test to examine TypeORM's SQLite logging
const { createConnection } = require('typeorm');
const path = require('path');

// Get the project root path
const projectRoot = path.resolve(__dirname, '..');
const dbPath = path.resolve(projectRoot, 'smaregi-mcp.sqlite');

async function testTypeOrmLogging() {
  console.error('Testing TypeORM SQLite logging behavior...');
  console.error(`Database path: ${dbPath}`);

  try {
    // Create a connection with logging enabled
    const connection = await createConnection({
      type: 'sqlite',
      database: dbPath,
      logging: true,
      logger: 'advanced-console',
      entities: [],
      synchronize: false,
    });

    console.error('Connected to the SQLite database via TypeORM.');
    
    // Run a simple query
    const tables = await connection.query('SELECT name FROM sqlite_master WHERE type="table"');
    
    console.error('Tables in database:');
    tables.forEach(table => {
      console.error(`- ${table.name}`);
    });
    
    // Close the connection
    await connection.close();
    console.error('Database connection closed.');
  } catch (error) {
    console.error(`Error in TypeORM test: ${error.message}`);
  }
}

testTypeOrmLogging().catch(err => console.error(err));
