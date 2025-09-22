import { IsEnum, IsInt, IsString } from 'class-validator';
import { TransactionCurrency } from 'generated/prisma';

export class CreateTransactionDto {
  @IsEnum(TransactionCurrency)
  currency: TransactionCurrency;

  @IsString()
  user_id: string;
}

export class GetTransactionByIdDto {
  @IsString()
  id: string;
}

export class GetTransactionsByUserDto {
  @IsString()
  user_id: string;
}
