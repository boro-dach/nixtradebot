import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ConfigController],
  providers: [ConfigService, PrismaService],
  exports: [ConfigService],
})
export class ConfigModule {}
