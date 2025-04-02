#!/usr/bin/env node
import dotenv from 'dotenv';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';
import * as os from 'node:os';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { fileURLToPath } from 'url';
import { loadTools } from './tools/index.js';
import { setupHandlers } from './server/handlers.js';
import { log, createDialog, isDirectory } from './utils/index.js';

// Configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(execCallback);
const version = process.env.npm_package_version || '0.1.0';
const debug = process.env.DEBUG === 'true';

// Find node path for server command
async function findNodePath() {
  try {
    return process.execPath;
  } catch (error) {
    try {
      const cmd = process.platform === 'win32' ? 'where' : 'which';
      const { stdout } = await execAsync(`${cmd} node`);
      return stdout.toString().trim().split('\n')[0];
    } catch (err) {
      return 'node'; // Fallback
    }
  }
}

// Initialize the Smaregi MCP server
export async function init() {
  console.log(
    createDialog([
      `👋 Welcome to Smaregi MCP Server v${version}!`,
      `💁‍♀️ This initialization process will install the Smaregi MCP Server into Claude Desktop`,
      `   enabling Claude to interact with the Smaregi API.`,
      `🧡 Let's get started.`,
    ])
  );

  console.log(`Step 1: Checking for Claude Desktop...`);

  const claudeConfigPath = path.join(
    os.homedir(),
    'Library',
    'Application Support',
    'Claude',
    'claude_desktop_config.json'
  );

  const nodePath = await findNodePath();
  
  // 実行ファイルの絶対パスを取得
  const projectRoot = path.resolve(process.cwd());
  const scriptPath = path.join(projectRoot, 'src', 'index.ts');
  
  // bunへのフルパスを探す
  let bunPath;
  try {
    const { stdout } = await execAsync('which bun');
    bunPath = stdout.toString().trim();
    console.log(`Found bun at: ${bunPath}`);
  } catch (err) {
    bunPath = 'bun';
    console.log('Could not find bun path, using "bun" as fallback');
  }
  
  const config = {
    command: bunPath,
    args: [scriptPath, 'run'],
  };

  console.log(
    `Looking for existing config in: ${path.dirname(claudeConfigPath)}`
  );
  const configDirExists = isDirectory(path.dirname(claudeConfigPath));

  if (configDirExists) {
    const existingConfig = fs.existsSync(claudeConfigPath)
      ? JSON.parse(fs.readFileSync(claudeConfigPath, 'utf8'))
      : { mcpServers: {} };

    if ('smaregi' in (existingConfig?.mcpServers || {})) {
      console.log(
        `Note: Replacing existing Smaregi MCP config:\n${JSON.stringify(
          existingConfig.mcpServers.smaregi
        )}`
      );
    }

    const newConfig = {
      ...existingConfig,
      mcpServers: {
        ...existingConfig.mcpServers,
        smaregi: config,
      },
    };

    fs.writeFileSync(claudeConfigPath, JSON.stringify(newConfig, null, 2));

    console.log(`Smaregi MCP Server configured & added to Claude Desktop!`);
    console.log(`Wrote config to ${claudeConfigPath}`);
    console.log(
      `Try asking Claude about the Smaregi API to get started!`
    );
  } else {
    const fullConfig = { mcpServers: { smaregi: config } };
    console.log(
      `Couldn't detect Claude Desktop config at ${claudeConfigPath}.\nTo add the Smaregi MCP server manually, add the following config to your MCP config file:\n\n${JSON.stringify(
        fullConfig,
        null,
        2
      )}`
    );
  }
}

// Start the MCP server
async function main() {
  log('Starting Smaregi MCP server...');

  try {
    const server = new Server(
      { name: 'smaregi', version: '1.0.0' },
      { capabilities: { tools: {} } }
    );

    // Set up request handlers
    server.setRequestHandler(ListToolsRequestSchema, async () => {
      log('Received list tools request');
      return { tools: loadTools() };
    });

    // Handle tool calls
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      console.log('Received request:', JSON.stringify(request, null, 2));
      const toolName = request.params.name;
      log('Received tool call:', toolName);
      console.log('Tool name:', toolName);
      
      try {
        console.log('Setting up handlers...');
        const handlers = setupHandlers();
        console.log('Handlers setup complete. Available handlers:', Object.keys(handlers));
        
        const handler = handlers[toolName];
        if (!handler) {
          console.error(`Unknown tool: ${toolName}`);
          throw new Error(`Unknown tool: ${toolName}`);
        }
        
        console.log(`Executing handler for tool: ${toolName}`);
        const result = await handler(request);
        console.log(`Handler execution complete. Result:`, JSON.stringify(result, null, 2));
        return result;
      } catch (error) {
        console.error('Error handling tool call:', error);
        log('Error handling tool call:', error);
        return {
          toolResult: {
            content: [
              {
                type: 'text',
                text: `Error: ${
                  error instanceof Error ? error.message : String(error)
                }`,
              },
            ],
            isError: true,
          },
        };
      }
    });

    // Connect to transport
    const transport = new StdioServerTransport();
    log('Created transport');
    await server.connect(transport);
    log('Server connected and running');
  } catch (error) {
    log('Fatal error:', error);
    process.exit(1);
  }
}

// Handle process events
process.on('uncaughtException', (error) => {
  log('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  log('Unhandled rejection:', error);
});

// Command line handling
const [cmd, ...args] = process.argv.slice(2);
if (cmd === 'init') {
  init()
    .then(() => {
      console.log('Initialization complete!');
    })
    .catch((error) => {
      console.error('Error during initialization:', error);
      process.exit(1);
    });
} else if (cmd === 'run') {
  main().catch((error) => {
    console.error('Error starting server:', error);
    process.exit(1);
  });
} else {
  console.error(`Unknown command: ${cmd}. Expected 'init' or 'run'.`);
  process.exit(1);
}
