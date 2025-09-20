import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangeLanguageDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @Get('get-all')
  async getAll() {
    const users = await this.userService.getAll();

    return users;
  }

  @HttpCode(200)
  @Post('language')
  async changeLanguage(@Body() dto: ChangeLanguageDto) {
    const user = await this.userService.changeLanguage(dto);

    return user;
  }

  @HttpCode(200)
  @Get('language')
  async getLanguage(@Query('tgid') tgid: string) {
    const user = await this.userService.findById(tgid);
    if (!user) {
      return { language: 'RU' };
    }
    return { language: user.language.toUpperCase() };
  }
}
