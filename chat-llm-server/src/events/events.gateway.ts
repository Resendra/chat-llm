import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer() server: Server;

  emit(event: string, data: any): void {
    this.server.emit(event, data);
  }
}
