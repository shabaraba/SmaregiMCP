import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiService } from './api.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    HttpModule,
    AuthModule,
  ],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
