import { HttpCode, Injectable, Post } from '@nestjs/common';
import { CreateDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(dto: CreateDto) {
    const oldUser = await this.userService.findById(dto.tgid);

    if (!oldUser) {
      const user = this.userService.create(dto);

      return user;
    }

    const user = oldUser;

    return user;
  }
}
