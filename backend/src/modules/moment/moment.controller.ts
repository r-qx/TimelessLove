import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MomentService } from './moment.service';
import { CreateMomentDto } from './dto/create-moment.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('moments')
@UseGuards(JwtAuthGuard)
export class MomentController {
  constructor(private readonly momentService: MomentService) {}

  @Post()
  async create(@CurrentUser('_id') userId: string, @Body() createMomentDto: CreateMomentDto) {
    return this.momentService.create(userId, createMomentDto);
  }

  @Get()
  async findAll(@CurrentUser('_id') userId: string, @Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.momentService.findAll(userId, limit, offset);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.momentService.findById(id);
  }
}
