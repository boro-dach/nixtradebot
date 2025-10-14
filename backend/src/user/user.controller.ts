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
} from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  @Get('get-all')
  async getAll() {
    const users = await this.userService.getAll();

    return users;
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
  async setUserLuck(
    @Body('tgid') tgid: number,
    @Body('isLucky') isLucky: boolean,
  ) {
    return this.userService.setLucky(tgid, isLucky);
  }

  @Post('withdraw-block')
  async setWithdrawBlock(
    @Body('tgid') tgid: number,
    @Body('isBannedWithdraw') isBannedWithdraw: boolean,
  ) {
    return this.userService.setWithdrawBlock(tgid, isBannedWithdraw);
  }
}
