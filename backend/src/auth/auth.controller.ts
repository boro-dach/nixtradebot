import { Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(dto: CreateDto) {
    const user = await this.login(dto);

    return user;
  }
}
