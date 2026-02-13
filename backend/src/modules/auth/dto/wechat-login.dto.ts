import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class WechatLoginDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsNumber()
  @IsOptional()
  gender?: number;
}
