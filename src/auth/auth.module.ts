import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { SessionEntity } from '../database/entities/session.entity.js';
import { TokenEntity } from '../database/entities/token.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity, TokenEntity]),
    HttpModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
