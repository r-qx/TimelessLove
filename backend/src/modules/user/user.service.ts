import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async findByOpenid(openid: string) {
    return this.userModel.findOne({ openid }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async updateCoupleId(userId: string, coupleId: string) {
    return this.userModel.findByIdAndUpdate(userId, { couple_id: coupleId }, { new: true }).exec();
  }
}
