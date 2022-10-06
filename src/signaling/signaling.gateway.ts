import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'net';

interface ISocket extends Socket {
  id: string;
  to: (room: string) => ISocket;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SignalingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @SubscribeMessage('from sender to receiver')
  fromSenderToReceiver(
    @ConnectedSocket() client: ISocket,
    @MessageBody() payload,
  ): void {
    client.to(payload.receiver).emit('from sender to receiver', client.id);
  }

  @SubscribeMessage('from receiver to sender')
  fromReceiverToSender(
    @ConnectedSocket() client,
    @MessageBody() payload,
  ): void {
    client.to(payload).emit('from receiver to sender');
  }

  @SubscribeMessage('msg to socket')
  transferMessage(@ConnectedSocket() client, @MessageBody() payload): void {
    console.log('transfer');
    client.to(payload.receiver).emit('msg to socket', payload.data, client.id);
  }

  handleConnection(): void {
    // console.log(`connected: ${client.id}`);
  }

  handleDisconnect(): void {
    // console.log(`disconnected: ${client.id}`);
  }
}
