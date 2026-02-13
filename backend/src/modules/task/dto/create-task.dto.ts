import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, IsArray, IsEnum, Min, Max } from 'class-validator';

export class CreateTaskDto {
  @IsEnum(['personal', 'cooperation', 'periodic', 'challenge'])
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  difficulty?: number;

  @IsNumber()
  @IsOptional()
  reward_points?: number;

  @IsNumber()
  @IsOptional()
  reward_coins?: number;

  @IsDateString()
  @IsOptional()
  deadline?: Date;

  @IsArray()
  @IsOptional()
  proof_type?: string[];

  @IsOptional()
  punishment?: {
    type: string;
    description: string;
  };

  @IsArray()
  @IsOptional()
  tags?: string[];
}
