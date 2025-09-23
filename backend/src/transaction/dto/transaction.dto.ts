import { IsEnum, IsInt, IsString } from 'class-validator';
import { TransactionCurrency, TransationType } from 'generated/prisma';

export class CreateTransactionDto {
  @IsEnum(TransactionCurrency)
  currency: TransactionCurrency;

  @IsInt()
  amount: number;

  @IsString()
  user_id: string;

  @IsEnum(TransationType)
  type: TransationType;
}

export class GetTransactionByIdDto {
  @IsString()
  id: string;
}

export class GetTransactionsByUserDto {
  @IsString()
  user_id: string;
}
