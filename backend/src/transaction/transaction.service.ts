import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateTransactionDto,
  GetTransactionByIdDto,
  GetTransactionsByUserDto,
} from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

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
}
