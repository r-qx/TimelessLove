import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UserService } from '../user/user.service';
import { WechatLoginDto } from './dto/wechat-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async wechatLogin(wechatLoginDto: WechatLoginDto) {
    const { code, nickname, avatar, gender } = wechatLoginDto;

    const openid = await this.getOpenidByCode(code);

    let user = await this.userService.findByOpenid(openid);

    if (!user) {
      user = await this.userService.create({
        openid,
        nickname,
        avatar,
        gender,
      });
    }

    const token = this.generateToken(user._id.toString());

    return {
      token,
      user: {
        id: user._id,
        nickname: user.nickname,
        avatar: user.avatar,
        coupleId: user.couple_id,
      },
    };
  }

  private async getOpenidByCode(code: string): Promise<string> {
    const appid = this.configService.get<string>('WECHAT_APPID');
    const secret = this.configService.get<string>('WECHAT_SECRET');

    console.log('微信登录配置:', { 
      appid, 
      hasSecret: !!secret,
      code 
    });

    if (!appid || appid === '你的小程序APPID') {
      console.error('❌ WECHAT_APPID 未配置或使用默认值');
      throw new UnauthorizedException('微信小程序 AppID 未配置');
    }

    if (!secret || secret === '你的小程序SECRET') {
      console.error('❌ WECHAT_SECRET 未配置或使用默认值');
      throw new UnauthorizedException('微信小程序 Secret 未配置');
    }

    try {
      console.log('🔐 调用微信登录接口...');
      const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
        params: {
          appid,
          secret,
          js_code: code,
          grant_type: 'authorization_code',
        },
      });

      console.log('微信接口响应:', response.data);

      if (response.data.errcode) {
        console.error('❌ 微信接口返回错误:', response.data);
        throw new UnauthorizedException('微信登录失败: ' + response.data.errmsg);
      }

      console.log('✅ 获取 openid 成功:', response.data.openid);
      return response.data.openid;
    } catch (error) {
      console.error('❌ 微信登录异常:', error.message);
      if (error.response) {
        console.error('微信接口响应:', error.response.data);
      }
      throw new UnauthorizedException('微信登录失败: ' + error.message);
    }
  }

  private generateToken(userId: string): string {
    return this.jwtService.sign({ userId });
  }

  async validateUser(userId: string) {
    return this.userService.findById(userId);
  }
}
