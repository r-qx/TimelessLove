import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  openid: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

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
