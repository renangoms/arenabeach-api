// src/webhook/webhook.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class WebhookGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private wsClients = [];

  @WebSocketServer()
    server: Server;

  public handleConnection(client: Socket, ...args: any[]) {
      this.wsClients.push(client);
  }

  public handleDisconnect(client: any) {
      for (let i = 0; i < this.wsClients.length; i++) {
          if (this.wsClients[i] === client) {
              this.wsClients.splice(i, 1)
              break
          }
      }
  }

  public broadcast(event, broadCastMessage: any, userEmail: string) {
      this.wsClients.filter(socket => {
        return socket.handshake.query.userEmail == userEmail
      }).forEach(socket => {
        socket.emit(event, broadCastMessage)
      })
  }
}
