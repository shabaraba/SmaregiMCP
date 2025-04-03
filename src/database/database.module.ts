import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity.js';
import { TokenEntity } from './entities/token.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SessionEntity,
      TokenEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
