import { Module } from '@nestjs/common';
import { McpService } from './mcp.service.js';
import { ToolHandlerService } from './tools/tool-handler.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { ApiModule } from '../api/api.module.js';

@Module({
  imports: [AuthModule, ApiModule],
  providers: [McpService, ToolHandlerService],
  exports: [McpService],
})
export class McpModule {}
