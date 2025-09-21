import { IsEnum, IsString } from 'class-validator';
import { Language } from 'generated/prisma';

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
