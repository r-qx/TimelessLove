import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { WechatLoginDto } from './dto/wechat-login.dto';
import { Public } from '@/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('wechat-login')
  async wechatLogin(@Body() wechatLoginDto: WechatLoginDto) {
    return this.authService.wechatLogin(wechatLoginDto);
  }
}
