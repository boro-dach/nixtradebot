import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateAssetBalanceDto,
  UpdateAssetBalanceDto,
} from './dto/balance.dto';

@Injectable()
export class BalanceService {
  constructor(private prisma: PrismaService) {}

  async getUserBalance(userId: string) {
    const assetBalances = await this.prisma.assetBalance.findMany({
      where: { userId },
      include: {
        cryptocurrency: true,
      },
    });

    if (!assetBalances) {
      throw new NotFoundException(
        `Баланс для пользователя с ID "${userId}" не найден.`,
      );
    }
    return assetBalances;
  }

  async createAssetBalance(createAssetBalanceDto: CreateAssetBalanceDto) {
    return this.prisma.assetBalance.create({
      data: {
        ...createAssetBalanceDto,
        amount: parseFloat(createAssetBalanceDto.amount),
      },
    });
  }

  async updateAssetBalance(
    id: string,
    updateAssetBalanceDto: UpdateAssetBalanceDto,
  ) {
    return this.prisma.assetBalance.update({
      where: { id },
      data: {
        amount: parseFloat(updateAssetBalanceDto.amount),
      },
    });
  }

  async removeAssetBalance(id: string) {
    return this.prisma.assetBalance.delete({
      where: { id },
    });
  }
}
