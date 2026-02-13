import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsNumber()
  @IsOptional()
  gender?: number;

  @IsNumber()
  @IsOptional()
  birthday?: number;
}
