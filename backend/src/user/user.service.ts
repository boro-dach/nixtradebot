import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDto) {
    const user = await this.prisma.user.create({
      data: {
        tgid: dto.tgid,
      },
    });

    return user;
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        tgid: id,
      },
    });

    return user;
  }
}
