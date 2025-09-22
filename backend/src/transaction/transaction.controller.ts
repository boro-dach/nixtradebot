import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto, GetTransactionByIdDto, GetTransactionsByUserDto } from './dto/transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @HttpCode(200)
  @Post('create')
  async create(@Body() dto: CreateTransactionDto) {
    const transaction = await this.transactionService.create(dto)

    return transaction;
  }

  @HttpCode(200)
  @Get('all')
  async getAll() {
    const transactions = await this.transactionService.getAll()

    return transactions
  }

  @HttpCode(200)
  @Post('get-id')
  async getById(@Body() dto: GetTransactionByIdDto) {
    const transaction = await this.transactionService.getById(dto)

    return transaction
  }

  @HttpCode(200)
  @Post('get-user')
  async getByUser(@Body() dto: GetTransactionsByUserDto) {
    const transactions = await this.transactionService.getByUser(dto)

    return transactions
  }
}
