import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from 'src/prisma.service';
import { BalanceService } from 'src/balance/balance.service';
import { UserService } from 'src/user/user.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService, BalanceService, UserService],
})
export class TransactionModule {}
