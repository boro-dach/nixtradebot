import { IsString, IsNumber, IsEnum } from 'class-validator';

export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export class ExecuteTradeDto {
  @IsString()
  userId: string;

  @IsEnum(TradeType)
  tradeType: TradeType;

  @IsString()
  assetToTradeSymbol: string;

  @IsString()
  baseAssetSymbol: string;

  @IsNumber()
  amountInBaseAsset: number;
}
