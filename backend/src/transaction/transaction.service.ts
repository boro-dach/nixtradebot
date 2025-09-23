import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateTransactionDto,
  GetTransactionByIdDto,
  GetTransactionsByUserDto,
} from './dto/transaction.dto';
import { BalanceService } from 'src/balance/balance.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly balanceService: BalanceService,
  ) {}

  async create(dto: CreateTransactionDto) {
    const transaction = await this.prisma.transaction.create({
      data: {
        amount: dto.amount,
        user_id: dto.user_id,
        currency: dto.currency,
        type: dto.type,
      },
    });

    return transaction;
  }

  async getAll() {
    const transactions = await this.prisma.transaction.findMany();

    return transactions;
  }

  async getById(dto: GetTransactionByIdDto) {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id: dto.id,
      },
    });

    return transaction;
  }

  async getByUser(dto: GetTransactionsByUserDto) {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        user_id: dto.user_id,
      },
    });

    return transactions;
  }

  async accept(id: string) {
    const transaction = await this.prisma.transaction.update({
      data: {
        status: 'CONFIRMED',
      },
      where: {
        id: id,
      },
    });

    await this.balanceService.addToBalance({
      amount: transaction.amount,
      tgid: transaction.user_id,
    });

    return transaction;
  }

  async reject(id: string) {
    const transaction = await this.prisma.transaction.update({
      data: {
        status: 'REJECTED',
      },
      where: {
        id,
      },
    });

    return transaction;
  }
}
