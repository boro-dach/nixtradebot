import { IsString, IsInt, IsDecimal } from 'class-validator';

export class CreateAssetBalanceDto {
  @IsString()
  userId: string;

  @IsInt()
  cryptocurrencyId: number;

  @IsDecimal()
  amount: string;
}

export class UpdateAssetBalanceDto {
  @IsDecimal()
  amount: string;
}
