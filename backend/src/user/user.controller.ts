import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangeLanguageDto, GetLanguageDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
