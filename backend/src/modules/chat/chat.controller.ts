import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  async sendMessage(@CurrentUser('_id') userId: string, @Body() sendMessageDto: SendMessageDto) {
    return this.chatService.sendMessage(userId, sendMessageDto);
  }

  @Get('messages')
  async getMessages(
    @CurrentUser('_id') userId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.chatService.getMessages(userId, limit, offset);
  }
}
