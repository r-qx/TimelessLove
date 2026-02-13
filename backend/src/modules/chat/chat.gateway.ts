import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_couple')
  handleJoinCouple(@MessageBody() coupleId: string, @ConnectedSocket() client: Socket) {
    client.join(`couple_${coupleId}`);
    return { event: 'joined', data: coupleId };
  }

  @SubscribeMessage('send_message')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const { coupleId, message } = data;
    this.server.to(`couple_${coupleId}`).emit('new_message', message);
    return { event: 'message_sent', data: message };
  }
}
