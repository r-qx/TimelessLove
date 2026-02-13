import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class SendMessageDto {
  @IsEnum(['text', 'image', 'voice', 'video', 'task', 'system'])
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  media_url?: string;

  @IsString()
  @IsOptional()
  emotion?: string;

  @IsString()
  @IsOptional()
  related_task_id?: string;
}
