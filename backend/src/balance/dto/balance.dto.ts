import { IsNumber, IsString } from 'class-validator';

export class AddToBalanceDto {
  @IsNumber()
  amount: number;

  @IsString()
  tgid: string;
}

export class setBalanceDto {
  @IsNumber()
  balance: number;

  @IsString()
  tgid: string;
}
