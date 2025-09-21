import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ChangeLanguageDto, CreateDto, GetLanguageDto } from './dto/user.dto';
import { Language } from 'generated/prisma';

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
        tgid: dto.tgid,
      },
      data: {
        language: dto.language,
      },
    });

    return user;
  }

  async getLanguage(dto: GetLanguageDto) {
    const user = await this.findById(dto.tgid);

    if (!user) {
      throw new BadRequestException('user doesnt exist');
    }

    return user.language;
  }
}
