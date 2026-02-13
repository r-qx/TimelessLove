import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Moment } from './schemas/moment.schema';
import { CreateMomentDto } from './dto/create-moment.dto';
import { CoupleService } from '../couple/couple.service';

@Injectable()
export class MomentService {
  constructor(
    @InjectModel(Moment.name) private momentModel: Model<Moment>,
    private readonly coupleService: CoupleService,
  ) {}

  async create(userId: string, createMomentDto: CreateMomentDto) {
    const couple = await this.coupleService.findByUserId(userId);

    const moment = new this.momentModel({
      ...createMomentDto,
      couple_id: couple._id,
      user_id: userId,
      likes: 0,
    });

    return moment.save();
  }

  async findAll(userId: string, limit = 20, offset = 0) {
    const couple = await this.coupleService.findByUserId(userId);

    const moments = await this.momentModel
      .find({ couple_id: couple._id })
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(offset)
      .populate('user_id', 'nickname avatar')
      .exec();

    const total = await this.momentModel.countDocuments({ couple_id: couple._id });

    return {
      list: moments,
      total,
    };
  }

  async findById(id: string) {
    const moment = await this.momentModel
      .findById(id)
      .populate('user_id', 'nickname avatar')
      .exec();

    if (!moment) {
      throw new NotFoundException('瞬间不存在');
    }

    return moment;
  }
}
