import { TransactionType } from '@prisma/client';
import { IsString, IsInt, IsDecimal, IsEnum } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  user_id: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsInt()
  cryptocurrencyId: number;

  @IsDecimal()
  amount: string;
}

export class GetTransactionByIdDto {
  @IsString()
  id: string;
}

export class GetTransactionsByUserDto {
  @IsString()
  user_id: string;
}
