import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { CoupleService } from '../couple/couple.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private readonly coupleService: CoupleService,
  ) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
    const couple = await this.coupleService.findByUserId(userId);

    if (couple.status !== 'active') {
      throw new BadRequestException('请先完成情侣配对');
    }

    const initialStatus = createTaskDto.type === 'personal' ? 'approved' : 'pending';

    const task = new this.taskModel({
      ...createTaskDto,
      couple_id: couple._id,
      creator_id: userId,
      status: initialStatus,
      participants: [userId],
    });

    const savedTask = await task.save();

    console.log('✅ 任务创建成功:', { 
      taskId: savedTask._id,
      type: createTaskDto.type,
      status: initialStatus,
    });

    return savedTask;
  }

  async findAll(userId: string, query: QueryTaskDto) {
    const couple = await this.coupleService.findByUserId(userId);

    const filter: any = { couple_id: couple._id };

    if (query.status) {
      filter.status = query.status;
    }

    if (query.type) {
      filter.type = query.type;
    }

    const tasks = await this.taskModel
      .find(filter)
      .sort({ created_at: -1 })
      .limit(query.limit || 20)
      .skip(query.offset || 0)
      .populate('creator_id', 'nickname avatar')
      .exec();

    const total = await this.taskModel.countDocuments(filter);

    return {
      list: tasks,
      total,
      page: Math.floor((query.offset || 0) / (query.limit || 20)) + 1,
      pageSize: query.limit || 20,
    };
  }

  async findById(id: string) {
    const task = await this.taskModel
      .findById(id)
      .populate('creator_id', 'nickname avatar')
      .populate('verified_by', 'nickname avatar')
      .exec();

    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    return task;
  }

  async complete(id: string, userId: string, completeTaskDto: CompleteTaskDto) {
    const task = await this.findById(id);

    if (task.status !== 'in_progress' && task.status !== 'approved') {
      throw new BadRequestException('任务状态不允许完成');
    }

    task.proof = {
      user_id: userId as any,
      content: completeTaskDto.content,
      media: completeTaskDto.media || [],
      submitted_at: new Date(),
    };

    task.status = 'completed';
    await task.save();

    return task;
  }

  async verify(id: string, userId: string) {
    const task = await this.findById(id);

    if (task.status !== 'completed') {
      throw new BadRequestException('任务未完成，无法验收');
    }

    if (!task.proof || !task.proof.user_id) {
      throw new BadRequestException('任务未提交完成证明');
    }

    if (task.proof.user_id.toString() === userId) {
      throw new ForbiddenException('不能验收自己完成的任务');
    }

    if (task.verified_by) {
      throw new BadRequestException('任务已经验收过了');
    }

    task.verified_by = userId as any;
    task.verified_at = new Date();
    task.status = 'verified';
    await task.save();

    await this.coupleService.updateLovePoints(
      task.couple_id.toString(),
      task.reward_points,
    );
    
    await this.coupleService.updateLoveCoins(
      task.couple_id.toString(),
      task.reward_coins,
    );

    console.log('✅ 任务验收成功，发放奖励:', {
      taskId: id,
      lovePoints: task.reward_points,
      loveCoins: task.reward_coins,
    });

    return task;
  }

  async approve(id: string, userId: string) {
    const task = await this.findById(id);

    if (task.status !== 'pending') {
      throw new BadRequestException('任务状态不允许审核');
    }

    if (task.creator_id.toString() === userId) {
      throw new BadRequestException('不能审核自己创建的任务');
    }

    task.status = 'approved';
    task.participants.push(userId as any);
    await task.save();

    console.log('✅ 任务审核通过:', { taskId: id, userId });

    return task;
  }

  async start(id: string, userId: string) {
    const task = await this.findById(id);

    if (task.status !== 'approved' && task.status !== 'pending') {
      throw new BadRequestException('任务状态不允许开始');
    }

    task.status = 'in_progress';
    await task.save();

    console.log('✅ 任务已开始:', { taskId: id });

    return task;
  }

  async delete(id: string, userId: string) {
    const task = await this.findById(id);

    if (task.creator_id.toString() !== userId) {
      throw new ForbiddenException('只能删除自己创建的任务');
    }

    if (task.status === 'completed' || task.status === 'verified') {
      throw new BadRequestException('已完成或已验收的任务不能删除');
    }

    await this.taskModel.findByIdAndDelete(id);

    console.log('🗑️ 任务已删除:', { taskId: id });

    return { message: '任务已删除' };
  }
}
