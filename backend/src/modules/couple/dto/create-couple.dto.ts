import { IsOptional, IsNumber } from 'class-validator';

export class CreateCoupleDto {
  @IsNumber()
  @IsOptional()
  anniversary?: number;
}
