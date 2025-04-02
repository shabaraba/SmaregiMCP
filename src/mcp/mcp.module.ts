import { Module } from '@nestjs/common';
import { McpService } from './mcp.service';
import { ToolsService } from './tools/tools.service';
import { ToolHandlerService } from './tools/tool-handler.service';
import { AuthModule } from '../auth/auth.module';
import { ApiModule } from '../api/api.module';

@Module({
  imports: [AuthModule, ApiModule],
  providers: [McpService, ToolsService, ToolHandlerService],
  exports: [McpService],
})
export class McpModule {}
