import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TradeService } from './trade.service';
import {
  ClosePositionDto,
  ExecuteSwapDto,
  OpenPositionDto,
} from './dto/trade.dto';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post('swap/execute')
  executeSwap(@Body() dto: ExecuteSwapDto) {
    return this.tradeService.executeSwap(dto);
  }

  @Post('position/open')
  openPosition(@Body() dto: OpenPositionDto) {
    return this.tradeService.openPosition(dto);
  }

  @Post('position/close')
  closePosition(@Body() dto: ClosePositionDto) {
    return this.tradeService.closePosition(dto);
  }

  @Get('positions/open/:userId')
  getOpenPositions(@Param('userId') userId: string) {
    return this.tradeService.getOpenPositions(userId);
  }

  @Get('positions/closed/:userId')
  getClosedPositions(@Param('userId') userId: string) {
    return this.tradeService.getClosedPositions(userId);
  }

  @Get('positions/:userId')
  getAllPositions(@Param('userId') userId: string) {
    return this.tradeService.getAllPositions(userId);
  }
}
