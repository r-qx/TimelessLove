import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateMomentDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsOptional()
  media?: Array<{
    type: 'image' | 'video';
    url: string;
  }>;

  @IsString()
  @IsOptional()
  mood?: string;

  @IsObject()
  @IsOptional()
  location?: {
    name: string;
    latitude: number;
    longitude: number;
  };

  @IsString()
  @IsOptional()
  task_id?: string;
}
