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
  SetStopLimitAmountDto,
  SetStopLimitStatusDto,
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
        assetBalances: {
          include: {
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

  /**
   * Получить статистику рефералов пользователя
   */
  async getReferralStats(tgid: string) {
    const user = await this.prisma.user.findUnique({
      where: { tgid },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${tgid} не найден.`);
    }

    // Получаем всех рефералов пользователя
    const referrals = await this.prisma.user.findMany({
      where: {
        referredById: tgid,
      },
      include: {
        transactions: {
          where: {
            type: 'DEPOSIT',
            status: 'CONFIRMED', // Только подтвержденные депозиты
          },
        },
      },
    });

    // Подсчитываем общее количество рефералов
    const totalReferrals = referrals.length;

    // Подсчитываем общую сумму заработка (10% от депозитов рефералов)
    const totalEarned = referrals.reduce((total, referral) => {
      const referralDeposits = referral.transactions.reduce(
        (sum, transaction) => sum + Number(transaction.amount),
        0,
      );
      return total + referralDeposits * 0.1; // 10% комиссия
    }, 0);

    // Получаем детальную информацию о рефералах
    const referralDetails = referrals.map((referral) => {
      const totalDeposits = referral.transactions.reduce(
        (sum, transaction) => sum + Number(transaction.amount),
        0,
      );
      const earned = totalDeposits * 0.1;

      return {
        tgid: referral.tgid,
        joinedAt: referral.createdAt,
        totalDeposits,
        earnedFromUser: earned,
        depositsCount: referral.transactions.length,
      };
    });

    return {
      totalReferrals,
      totalEarned: Number(totalEarned.toFixed(2)),
      referralCode: user.referralCode,
      referrals: referralDetails,
    };
  }

  /**
   * Получить список рефералов с пагинацией
   */
  async getReferralsList(tgid: string, page: number = 1, limit: number = 10) {
    const user = await this.prisma.user.findUnique({
      where: { tgid },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${tgid} не найден.`);
    }

    const skip = (page - 1) * limit;

    const [referrals, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          referredById: tgid,
        },
        include: {
          transactions: {
            where: {
              type: 'DEPOSIT',
              status: 'CONFIRMED',
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({
        where: {
          referredById: tgid,
        },
      }),
    ]);

    const referralDetails = referrals.map((referral) => {
      const totalDeposits = referral.transactions.reduce(
        (sum, transaction) => sum + Number(transaction.amount),
        0,
      );
      const earned = totalDeposits * 0.1;

      return {
        tgid: referral.tgid,
        joinedAt: referral.createdAt,
        totalDeposits: Number(totalDeposits.toFixed(2)),
        earnedFromUser: Number(earned.toFixed(2)),
        depositsCount: referral.transactions.length,
      };
    });

    return {
      referrals: referralDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Получить краткую статистику для дашборда
   */
  async getReferralSummary(tgid: string) {
    const user = await this.prisma.user.findUnique({
      where: { tgid },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${tgid} не найден.`);
    }

    const referrals = await this.prisma.user.findMany({
      where: {
        referredById: tgid,
      },
      include: {
        transactions: {
          where: {
            type: 'DEPOSIT',
            status: 'CONFIRMED',
          },
        },
      },
    });

    const totalReferrals = referrals.length;
    const totalEarned = referrals.reduce((total, referral) => {
      const referralDeposits = referral.transactions.reduce(
        (sum, transaction) => sum + Number(transaction.amount),
        0,
      );
      return total + referralDeposits * 0.1;
    }, 0);

    // Активные рефералы (те, кто делал депозиты)
    const activeReferrals = referrals.filter(
      (r) => r.transactions.length > 0,
    ).length;

    return {
      totalReferrals,
      activeReferrals,
      totalEarned: Number(totalEarned.toFixed(2)),
      referralCode: user.referralCode,
    };
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

  async setStopLimitStatus(dto: SetStopLimitStatusDto) {
    const { tgid, hasStopLimit } = dto;
    const user = await this.prisma.user.findUnique({ where: { tgid } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${tgid} не найден.`);
    }
    return this.prisma.user.update({
      where: { tgid },
      data: { hasStopLimit },
    });
  }

  async setStopLimitAmount(dto: SetStopLimitAmountDto) {
    const { tgid, amount } = dto;
    const user = await this.prisma.user.findUnique({ where: { tgid } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${tgid} не найден.`);
    }
    return this.prisma.user.update({
      where: { tgid },
      data: { stopLimit: amount },
    });
  }
}
