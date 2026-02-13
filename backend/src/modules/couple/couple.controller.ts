import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CoupleService } from './couple.service';
import { CreateCoupleDto } from './dto/create-couple.dto';
import { JoinCoupleDto } from './dto/join-couple.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('couples')
@UseGuards(JwtAuthGuard)
export class CoupleController {
  constructor(private readonly coupleService: CoupleService) {}

  @Post()
  async create(@CurrentUser('_id') userId: string, @Body() createCoupleDto: CreateCoupleDto) {
    console.log('📝 收到创建情侣关系请求:', {
      userId,
      dto: createCoupleDto,
      anniversaryType: typeof createCoupleDto.anniversary,
    });
    return this.coupleService.create(userId, createCoupleDto);
  }

  @Post('join')
  async join(@CurrentUser('_id') userId: string, @Body() joinCoupleDto: JoinCoupleDto) {
    return this.coupleService.joinByInviteCode(userId, joinCoupleDto.inviteCode);
  }

  @Get('my')
  async getMy(@CurrentUser('_id') userId: string) {
    const couple = await this.coupleService.findByUserId(userId);
    
    if (couple.status === 'pending') {
      couple.inviteCode = couple.invite_code;
    }
    
    return couple;
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.coupleService.findById(id);
  }

  @Post('invite-code')
  async generateInviteCode(@CurrentUser('_id') userId: string) {
    return this.coupleService.generateInviteCode(userId);
  }
}
