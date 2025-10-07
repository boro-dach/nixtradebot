import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import {
  CreateAssetBalanceDto,
  UpdateAssetBalanceDto,
} from './dto/balance.dto';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get(':userId')
  getUserBalance(@Param('userId') userId: string) {
    return this.balanceService.getUserBalance(userId);
  }

  @Post('asset')
  createAssetBalance(@Body() createAssetBalanceDto: CreateAssetBalanceDto) {
    return this.balanceService.createAssetBalance(createAssetBalanceDto);
  }

  @Patch('asset/:id')
  updateAssetBalance(
    @Param('id') id: string,
    @Body() updateAssetBalanceDto: UpdateAssetBalanceDto,
  ) {
    return this.balanceService.updateAssetBalance(id, updateAssetBalanceDto);
  }

  @Delete('asset/:id')
  removeAssetBalance(@Param('id') id: string) {
    return this.balanceService.removeAssetBalance(id);
  }
}
