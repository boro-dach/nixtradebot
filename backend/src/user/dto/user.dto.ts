import { Language } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateDto {
  @IsString()
  tgid: string;
}

export class ChangeLanguageDto {
  @IsEnum(Language)
  language: Language;

  @IsString()
  tgid: string;
}

export class GetLanguageDto {
  @IsString()
  tgid: string;
}

export class ApplyReferralCodeDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  referralCode: string;
}

export class SetStopLimitStatusDto {
  @IsString()
  @IsNotEmpty()
  tgid: string;

  @IsBoolean()
  hasStopLimit: boolean;
}

export class SetStopLimitAmountDto {
  @IsString()
  @IsNotEmpty()
  tgid: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
