import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  async getVatPercentage(): Promise<number> {
    const config = await this.prisma.config.findUnique({
      where: { key: 'VAT_PERCENTAGE' },
    });

    return config ? parseFloat(config.value) : 0;
  }

  async setVatPercentage(percentage: number): Promise<void> {
    await this.prisma.config.upsert({
      where: { key: 'VAT_PERCENTAGE' },
      update: {
        value: percentage.toString(),
        updatedAt: new Date(),
      },
      create: {
        key: 'VAT_PERCENTAGE',
        value: percentage.toString(),
      },
    });
  }

  async getMinDeposit(): Promise<number> {
    const config = await this.prisma.config.findUnique({
      where: { key: 'MIN_DEPOSIT' },
    });

    return config ? parseFloat(config.value) : 0;
  }

  async setMinDeposit(amount: number): Promise<void> {
    await this.prisma.config.upsert({
      where: { key: 'MIN_DEPOSIT' },
      update: {
        value: amount.toString(),
        updatedAt: new Date(),
      },
      create: {
        key: 'MIN_DEPOSIT',
        value: amount.toString(),
      },
    });
  }

  /**
   * Применить НДС к сумме
   */
  async applyVat(amount: number | Prisma.Decimal): Promise<{
    originalAmount: number;
    vatAmount: number;
    finalAmount: number;
    vatPercentage: number;
  }> {
    const vatPercentage = await this.getVatPercentage();
    const originalAmount =
      typeof amount === 'number' ? amount : amount.toNumber();
    const vatAmount = (originalAmount * vatPercentage) / 100;
    const finalAmount = originalAmount - vatAmount;

    return {
      originalAmount,
      vatAmount,
      finalAmount,
      vatPercentage,
    };
  }

  async calculateVat(amount: number | Prisma.Decimal): Promise<number> {
    const vatPercentage = await this.getVatPercentage();
    const numAmount = typeof amount === 'number' ? amount : amount.toNumber();
    return (numAmount * vatPercentage) / 100;
  }

  async getAllConfig(): Promise<Record<string, string>> {
    const configs = await this.prisma.config.findMany();
    return configs.reduce(
      (acc, config) => {
        acc[config.key] = config.value;
        return acc;
      },
      {} as Record<string, string>,
    );
  }

  async setConfigValue(key: string, value: string): Promise<void> {
    await this.prisma.config.upsert({
      where: { key },
      update: {
        value,
        updatedAt: new Date(),
      },
      create: { key, value },
    });
  }

  async getConfigValue(
    key: string,
    defaultValue: string = '',
  ): Promise<string> {
    const config = await this.prisma.config.findUnique({
      where: { key },
    });

    return config ? config.value : defaultValue;
  }
}
