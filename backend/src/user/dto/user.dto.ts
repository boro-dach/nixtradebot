import { IsNumber } from 'class-validator';

export class CreateDto {
  @IsNumber()
  tgid: number;
}
