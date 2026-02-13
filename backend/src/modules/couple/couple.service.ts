import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Couple } from './schemas/couple.schema';
import { CreateCoupleDto } from './dto/create-couple.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class CoupleService {
  constructor(
    @InjectModel(Couple.name) private coupleModel: Model<Couple>,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, createCoupleDto: CreateCoupleDto) {
    const user = await this.userService.findById(userId);
    
    if (user.couple_id) {
      throw new BadRequestException('您已经有情侣关系了');
    }

    console.log('📝 创建情侣关系，接收的数据:', createCoupleDto);

    const anniversaryTimestamp = createCoupleDto.anniversary || Date.now();

    console.log('📅 纪念日时间戳:', anniversaryTimestamp);

    const inviteCode = this.generateRandomCode();
    console.log('🔑 生成邀请码:', inviteCode);

    const couple = new this.coupleModel({
      user1_id: userId,
      anniversary: anniversaryTimestamp,
      level: 1,
      love_points: 0,
      love_coins: 0,
      intimacy: {
        communication: 0,
        cooperation: 0,
        romance: 0,
        understanding: 0,
        growth: 0,
      },
      status: 'pending',
      invite_code: inviteCode,
    });

    const savedCouple = await couple.save();

    await this.userService.updateCoupleId(userId, savedCouple._id.toString());

    const result: any = savedCouple.toJSON ? savedCouple.toJSON() : savedCouple;
    result.inviteCode = inviteCode;

    console.log('✅ 情侣关系创建成功:', { 
      coupleId: savedCouple._id,
      inviteCode 
    });

    return result;
  }

  private generateRandomCode(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(4).toString('hex').toUpperCase();
  }

  async joinByInviteCode(userId: string, inviteCode: string) {
    console.log('🔍 查找邀请码:', inviteCode);
    
    const couple = await this.coupleModel.findOne({ invite_code: inviteCode }).exec();
    
    console.log('📋 查询结果:', couple ? '找到' : '未找到');
    
    if (!couple) {
      throw new BadRequestException('邀请码无效或已过期');
    }

    if (couple.user2_id) {
      throw new BadRequestException('该邀请码已被使用');
    }

    console.log('✅ 开始加入情侣关系:', { userId, coupleId: couple._id });

    couple.user2_id = userId as any;
    couple.status = 'active';
    couple.invite_code = undefined;

    await couple.save();
    await this.userService.updateCoupleId(userId, couple._id.toString());

    console.log('✅ 情侣关系激活成功');

    return couple;
  }

  async findById(id: string) {
    const couple = await this.coupleModel
      .findById(id)
      .populate('user1_id', 'nickname avatar gender')
      .populate('user2_id', 'nickname avatar gender')
      .exec();
      
    if (!couple) {
      throw new NotFoundException('情侣关系不存在');
    }
    
    return this.formatCoupleResponse(couple);
  }

  async findByUserId(userId: string) {
    const couple = await this.coupleModel
      .findOne({
        $or: [{ user1_id: userId }, { user2_id: userId }],
      })
      .populate('user1_id', 'nickname avatar gender')
      .populate('user2_id', 'nickname avatar gender')
      .exec();

    if (!couple) {
      throw new NotFoundException('您还没有建立情侣关系');
    }

    return this.formatCoupleResponse(couple);
  }

  private formatCoupleResponse(couple: any) {
    const result = couple.toJSON ? couple.toJSON() : couple;
    
    result.user1 = result.user1_id;
    result.user2 = result.user2_id;
    
    delete result.user1_id;
    delete result.user2_id;
    
    return result;
  }

  async generateInviteCode(userId: string): Promise<{ inviteCode: string }> {
    const couple = await this.findByUserId(userId);

    if (couple.status === 'active') {
      throw new BadRequestException('情侣关系已激活，无需邀请码');
    }

    if (couple.invite_code) {
      return { inviteCode: couple.invite_code };
    }

    const inviteCode = this.generateRandomCode();
    couple.invite_code = inviteCode;
    await couple.save();

    return { inviteCode };
  }

  async updateLovePoints(coupleId: string, points: number) {
    const couple = await this.findById(coupleId);
    couple.love_points += points;

    const newLevel = this.calculateLevel(couple.love_points);
    if (newLevel > couple.level) {
      couple.level = newLevel;
    }

    return couple.save();
  }

  async updateLoveCoins(coupleId: string, coins: number) {
    const couple = await this.findById(coupleId);
    couple.love_coins += coins;
    return couple.save();
  }

  private calculateLevel(lovePoints: number): number {
    const levels = [
      0, 100, 200, 350, 550, 800, 1100, 1450, 1850, 2300,
      2800, 3350, 3950, 4600, 5300, 6050, 6850, 7700, 8600, 9550,
      11000, 12500, 14050, 15650, 17300, 20000, 25000, 32000, 40000, 50000,
    ];

    for (let i = levels.length - 1; i >= 0; i--) {
      if (lovePoints >= levels[i]) {
        return i + 1;
      }
    }
    return 1;
  }
}
