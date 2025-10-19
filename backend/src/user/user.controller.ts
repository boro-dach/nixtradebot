import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApplyReferralCodeDto,
  ChangeLanguageDto,
  GetLanguageDto,
  SetStopLimitAmountDto,
  SetStopLimitStatusDto,
} from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-all')
  @HttpCode(200)
  async getAll() {
    const users = await this.userService.getAll();
    return users;
  }

  @HttpCode(200)
  @Post('set-language')
  async changeLanguage(@Body() dto: ChangeLanguageDto) {
    const user = await this.userService.changeLanguage(dto);
    return user;
  }

  @HttpCode(200)
  @Post('get-language')
  async getLanguage(@Body() dto: GetLanguageDto) {
    const language = await this.userService.getLanguage(dto);
    return { language };
  }

  @HttpCode(200)
  @Post('verify')
  async verify(@Body() body: { tgid: string }) {
    const user = await this.userService.verify(body.tgid);
    return user;
  }

  @Post('ban')
  @HttpCode(200)
  async banUser(@Body() body: { tgid: string; ban: boolean }) {
    return this.userService.banUser(body.tgid, body.ban);
  }

  @Post('referral/apply')
  @HttpCode(200)
  async applyReferralCode(@Body() dto: ApplyReferralCodeDto) {
    return this.userService.applyReferralCode(dto);
  }

  @Post('luck')
  @HttpCode(200)
  async setUserLuck(
    @Body('tgid') tgid: number,
    @Body('isLucky') isLucky: boolean,
  ) {
    return this.userService.setLucky(tgid, isLucky);
  }

  @Post('withdraw-block')
  @HttpCode(200)
  async setWithdrawBlock(
    @Body('tgid') tgid: number,
    @Body('isBannedWithdraw') isBannedWithdraw: boolean,
  ) {
    return this.userService.setWithdrawBlock(tgid, isBannedWithdraw);
  }

  @Get(':tgid/referral/summary')
  @HttpCode(200)
  async getReferralSummary(@Param('tgid') tgid: string) {
    return this.userService.getReferralSummary(tgid);
  }

  @Get(':tgid/referral/stats')
  @HttpCode(200)
  async getReferralStats(@Param('tgid') tgid: string) {
    return this.userService.getReferralStats(tgid);
  }

  @Get(':tgid/referral/list')
  @HttpCode(200)
  async getReferralsList(
    @Param('tgid') tgid: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.userService.getReferralsList(
      tgid,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get(':tgid')
  async getUserById(@Param('tgid') tgid: string) {
    console.log(`--- Received request for user with tgid: ${tgid} ---`);
    const user = await this.userService.findById(tgid);
    console.log(`--- Found user: ${JSON.stringify(user)} ---`);
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${tgid} не найден.`);
    }
    return user;
  }

  @Post('stop-limit/status')
  @HttpCode(200)
  async setStopLimitStatus(@Body() dto: SetStopLimitStatusDto) {
    return this.userService.setStopLimitStatus(dto);
  }

  @Post('stop-limit/amount')
  @HttpCode(200)
  async setStopLimitAmount(@Body() dto: SetStopLimitAmountDto) {
    return this.userService.setStopLimitAmount(dto);
  }
}
