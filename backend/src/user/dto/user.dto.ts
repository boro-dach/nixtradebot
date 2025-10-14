import { Language } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

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
