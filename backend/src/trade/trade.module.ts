import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { PrismaService } from 'src/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { MarketService } from 'src/market/market.service';

@Module({
  imports: [HttpModule],
  controllers: [TradeController],
  providers: [TradeService, MarketService, PrismaService],
})
export class TradeModule {}
