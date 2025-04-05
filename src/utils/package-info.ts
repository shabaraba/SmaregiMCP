import * as fs from 'fs';
import * as path from 'path';

/**
 * Package info from package.json
 */
export const packageInfo = (() => {
  try {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      return {
        name: packageJson.name || 'smaregi-mcp',
        version: packageJson.version || '1.0.0',
        description: packageJson.description || 'Smaregi MCP Server',
      };
    }
    
    return {
      name: 'smaregi-mcp',
      version: '1.0.0',
      description: 'Smaregi MCP Server',
    };
  } catch (error) {
    console.error(`[ERROR] Failed to read package.json: ${error}`);
    return {
      name: 'smaregi-mcp',
      version: '1.0.0',
      description: 'Smaregi MCP Server',
    };
  }
})();
