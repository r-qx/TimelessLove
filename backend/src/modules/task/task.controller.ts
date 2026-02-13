import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@CurrentUser('_id') userId: string, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(userId, createTaskDto);
  }

  @Get()
  async findAll(@CurrentUser('_id') userId: string, @Query() query: QueryTaskDto) {
    return this.taskService.findAll(userId, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.taskService.findById(id);
  }

  @Patch(':id/complete')
  async complete(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
    @Body() completeTaskDto: CompleteTaskDto,
  ) {
    return this.taskService.complete(id, userId, completeTaskDto);
  }

  @Patch(':id/verify')
  async verify(@Param('id') id: string, @CurrentUser('_id') userId: string) {
    return this.taskService.verify(id, userId);
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string, @CurrentUser('_id') userId: string) {
    return this.taskService.approve(id, userId);
  }

  @Patch(':id/start')
  async start(@Param('id') id: string, @CurrentUser('_id') userId: string) {
    return this.taskService.start(id, userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser('_id') userId: string) {
    return this.taskService.delete(id, userId);
  }
}
