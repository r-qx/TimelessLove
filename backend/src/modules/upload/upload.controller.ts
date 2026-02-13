import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConfigService } from '@nestjs/config';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        console.log('📎 收到文件上传:', {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        });

        const allowedMimes = [
          'image/jpeg',
          'image/jpg', 
          'image/png',
          'image/gif',
          'image/webp',
        ];
        
        const ext = extname(file.originalname).toLowerCase();
        const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        
        if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
          cb(null, true);
        } else {
          console.error('❌ 不支持的文件类型:', file.mimetype, ext);
          cb(new Error('只支持图片格式'), false);
        }
      },
    }),
  )
  async uploadImage(@UploadedFile() file: any) {
    console.log('📤 处理文件上传请求');
    
    if (!file) {
      console.error('❌ 未收到文件');
      throw new BadRequestException('请选择要上传的文件');
    }

    const url = this.uploadService.getFileUrl(file.filename);

    console.log('✅ 图片上传成功:', {
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      url,
    });

    return {
      url,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
