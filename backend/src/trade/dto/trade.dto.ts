// Файл: src/trade/dto/trade.dto.ts

import { PositionType } from '@prisma/client'; // <-- ИСПРАВЛЕННЫЙ ИМПОРТ
import {
  IsString,
  IsNumber,
  IsEnum,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';

// Этот enum остается здесь. Он локальный для этого файла.
export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL',
}

// DTO для открытия торговой позиции (LONG/SHORT)
export class OpenPositionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  assetCoingeckoId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(PositionType) // Использует PositionType из Prisma
  type: PositionType;
}

// DTO для закрытия торговой позиции
export class ClosePositionDto {
  @IsString()
  @IsNotEmpty()
  positionId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

// DTO для прямого обмена (свапа)
export class ExecuteSwapDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  fromAssetCoingeckoId: string;

  @IsString()
  @IsNotEmpty()
  toAssetCoingeckoId: string;

  @IsNumber()
  @IsPositive()
  fromAmount: number;
}

// Ваш существующий DTO
export class ExecuteTradeDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(TradeType) // Использует локальный enum TradeType
  tradeType: TradeType;

  @IsString()
  @IsNotEmpty()
  assetToTradeSymbol: string;

  @IsString()
  @IsNotEmpty()
  baseAssetSymbol: string;

  @IsNumber()
  @IsPositive()
  amountInBaseAsset: number;
}
