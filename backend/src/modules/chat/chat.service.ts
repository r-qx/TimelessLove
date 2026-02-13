import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { SendMessageDto } from './dto/send-message.dto';
import { CoupleService } from '../couple/couple.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly coupleService: CoupleService,
  ) {}

  async sendMessage(userId: string, sendMessageDto: SendMessageDto) {
    const couple = await this.coupleService.findByUserId(userId);

    const message = new this.messageModel({
      ...sendMessageDto,
      couple_id: couple._id,
      sender_id: userId,
      is_read: false,
    });

    return message.save();
  }

  async getMessages(userId: string, limit = 50, offset = 0) {
    const couple = await this.coupleService.findByUserId(userId);

    const messages = await this.messageModel
      .find({ couple_id: couple._id })
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(offset)
      .populate('sender_id', 'nickname avatar')
      .exec();

    return {
      list: messages.reverse(),
      total: await this.messageModel.countDocuments({ couple_id: couple._id }),
    };
  }
}
