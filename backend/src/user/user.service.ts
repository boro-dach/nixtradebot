import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ChangeLanguageDto, CreateDto, GetLanguageDto } from './dto/user.dto';

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

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        tgid: id,
      },
      include: {
        // Включаем связанные балансы активов
        assetBalances: {
          include: {
            // Внутри каждого баланса включаем информацию о криптовалюте
            cryptocurrency: true,
          },
        },
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
      throw new BadRequestException('Пользователь не существует');
    }

    return user.language;
  }

  async getAll() {
    const users = await this.prisma.user.findMany({
      // Заменяем 'select' на 'include' для загрузки связанных данных
      include: {
        assetBalances: {
          include: {
            cryptocurrency: true,
          },
        },
      },
    });

    return users;
  }

  async verify(tgid: string) {
    const user = await this.prisma.user.update({
      where: { tgid },
      data: { verified: true },
    });

    return user;
  }

  async banUser(tgid: string, isBanned: boolean) {
    const user = await this.prisma.user.findUnique({ where: { tgid } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${tgid} не найден.`);
    }

    return this.prisma.user.update({
      where: { tgid },
      data: { isBannedInBot: isBanned },
    });
  }
}
