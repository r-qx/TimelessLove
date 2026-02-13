import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  getFileUrl(filename: string): string {
    const ngrokUrl = process.env.NGROK_URL || '';
    if (ngrokUrl) {
      return `${ngrokUrl}/uploads/${filename}`;
    }
    
    const baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:3000');
    return `${baseUrl}/uploads/${filename}`;
  }
}
