import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SessionEntity } from '../database/entities/session.entity';
import { TokenEntity } from '../database/entities/token.entity';

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
