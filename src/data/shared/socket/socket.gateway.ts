import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { SocketMessage } from './interfaces/socket.interfaces';

//para intalar
// npm i --save socket.io
//npm i --save @nestjs/platform-ws
@Injectable()
@WebSocketGateway({ cors: { origin: '*' }, path: '/main' })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('SocketGateway');
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    const clientAddress = client.handshake.address.replace(/::ffff:/gm, '');
    this.logger.log(`Client connected: ${client.id}, IP: ${clientAddress}`);
  }

  handleDisconnect(client: Socket) {
    const clientAddress = client.handshake.address.replace(/::ffff:/gm, '');
    this.logger.log(`Client disconnected: ${client.id}, IP: ${clientAddress}`);
  }

  public afterInit(server: Server) {
    this.logger.log('SocketGateway initialized');
    this.server = server;
  }

  @OnEvent('emit')
  handleOutgoing(
    @MessageBody()
    { channel, data }: SocketMessage,
  ) {
    this.logger.log(channel);
    this.server.emit(channel, data);
  }
}
