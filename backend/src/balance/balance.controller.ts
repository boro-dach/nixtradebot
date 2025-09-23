import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { AddToBalanceDto, setBalanceDto } from './dto/balance.dto';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @HttpCode(200)
  @Post('get')
  async getBalance(@Body() body: { tgid: string }) {
    const balance = await this.balanceService.getBalance(body.tgid);

    return { balance };
  }

  @HttpCode(200)
  @Post('add')
  async addToBalance(@Body() dto: AddToBalanceDto) {
    const balance = await this.balanceService.addToBalance(dto);

    return balance;
  }

  @HttpCode(200)
  @Post('subtract')
  async subtractFromBalance(@Body() dto: AddToBalanceDto) {
    const balance = await this.balanceService.subtractFromBalance(dto);

    return balance;
  }

  @HttpCode(200)
  @Post('set')
  async setBalance(@Body() dto: setBalanceDto) {
    const balance = await this.balanceService.setBalance(dto);

    return balance;
  }
}
