import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/tasks' })
export class TaskGateway {
  @WebSocketServer()
  server: Server;

  emitTaskStatusChanged(task: any) {
    this.server.emit('taskStatusChanged', task);
  }
}
