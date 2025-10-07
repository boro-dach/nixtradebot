import { Language } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

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
