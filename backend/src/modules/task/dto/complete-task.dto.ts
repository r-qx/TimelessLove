import { IsString, IsOptional, IsArray } from 'class-validator';

export class CompleteTaskDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsOptional()
  media?: string[];
}
