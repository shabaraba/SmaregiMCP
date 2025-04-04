import { Module } from '@nestjs/common';
import { McpService } from './mcp.service.js';
import { ToolHandlerService } from '../tool-handler/tool-handler.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { ApiModule } from '../api/api.module.js';
import { ApiToolsGenerator } from '../tools/api-tools-generator.js';

@Module({
  imports: [AuthModule, ApiModule],
  providers: [McpService, ToolHandlerService, ApiToolsGenerator],
  exports: [McpService],
})
export class McpModule {}
