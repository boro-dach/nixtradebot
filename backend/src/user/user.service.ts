import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ChangeLanguageDto, CreateDto } from './dto/user.dto';
import { Language } from 'generated/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDto) {
    const user = await this.prisma.user.create({
      data: {
        tgid: String(dto.tgid),
      },
    });

    return user;
  }

  async getAll() {
    const users = await this.prisma.user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        tgid: id,
      },
    });

    return user;
  }

  async changeLanguage(dto: ChangeLanguageDto) {
    const user = await this.prisma.user.update({
      where: {
        tgid: String(dto.tgid),
      },
      data: {
        language: dto.language,
      },
    });

    return user;
  }

  async getLanguage(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        tgid: id,
      },
    });

    return user?.language;
  }
}
