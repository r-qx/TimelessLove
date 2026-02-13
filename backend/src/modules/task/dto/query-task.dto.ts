import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryTaskDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  offset?: number;
}
