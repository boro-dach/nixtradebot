import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TradeService } from './trade.service';
import { ExecuteTradeDto } from './dto/trade.dto';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get('market-data/:assetSymbol')
  getMarketData(@Param('assetSymbol') assetSymbol: string) {
    return this.tradeService.getMarketData(assetSymbol);
  }

  @Post('execute')
  executeTrade(@Body() executeTradeDto: ExecuteTradeDto) {
    return this.tradeService.executeTrade(executeTradeDto);
  }
}
