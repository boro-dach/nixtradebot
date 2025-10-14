import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  ApplyReferralCodeDto,
  ChangeLanguageDto,
  CreateDto,
  GetLanguageDto,
} from './dto/user.dto';

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

  async applyReferralCode(dto: ApplyReferralCodeDto) {
    const { userId, referralCode } = dto;

    const [referee, referrer] = await Promise.all([
      this.prisma.user.findUnique({ where: { tgid: userId } }),
      this.prisma.user.findUnique({ where: { referralCode } }),
    ]);

    if (!referee)
      throw new NotFoundException(`Пользователь с ID ${userId} не найден.`);
    if (referee.referredById)
      throw new BadRequestException(
        'У этого пользователя уже есть пригласитель.',
      );
    if (!referrer)
      throw new NotFoundException('Введен неверный реферальный код.');
    if (referrer.tgid === referee.tgid)
      throw new BadRequestException(
        'Нельзя применить свой собственный реферальный код.',
      );

    return this.prisma.user.update({
      where: { tgid: userId },
      data: {
        referredById: referrer.tgid,
      },
    });
  }

  async setLucky(tgid: number, isLucky: boolean) {
    const user = await this.prisma.user.findUnique({
      where: { tgid: tgid.toString() },
    });

    if (!user) {
      throw new NotFoundException(`User with tgid ${tgid} not found`);
    }

    return this.prisma.user.update({
      where: { tgid: tgid.toString() },
      data: { isLucky },
    });
  }

  async setWithdrawBlock(tgid: number, isBannedWithdraw: boolean) {
    const user = await this.prisma.user.findUnique({
      where: { tgid: tgid.toString() },
    });

    if (!user) {
      throw new NotFoundException(`User with tgid ${tgid} not found`);
    }

    return this.prisma.user.update({
      where: { tgid: tgid.toString() },
      data: { isBannedWithdraw },
    });
  }
}
