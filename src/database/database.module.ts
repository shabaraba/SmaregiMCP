import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { TokenEntity } from './entities/token.entity';

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
