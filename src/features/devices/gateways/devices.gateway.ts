import { WsAuthGuard } from '@core/guards/ws-auth.guard';
import { DeviceStatus } from '@devices/schemas/device.schema';
import { DevicesService } from '@devices/services/devices.service';
import { Inject, OnModuleInit, UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Server, Socket } from 'socket.io';
import { Logger } from 'winston';

@WebSocketGateway({
  namespace: 'devices',
  cors: {
    origin: '*',
  },
})
export class DevicesGateway implements OnModuleInit {
  @WebSocketServer()
  private server: Server;

  constructor(
    private devicesService: DevicesService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      const message = `Socket ${socket.id} connected!`;
      this.logger.info(message, { context: 'SOCKET' });
    });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('message')
  async handleMessage(client: Socket): Promise<void> {
    try {
      const url = client.handshake.url;
      const queryParams = this.parseQueryParams(url);

      const userId = client['userId'] as string;
      const deviceId = queryParams.deviceId;

      const device = await this.devicesService.getDeviceById(userId, {
        deviceId: deviceId,
      });
      if (device.status === DeviceStatus.INACTIVE) {
        client.emit('onError', {
          message: 'Device is inactive, please activate',
          error: 'DeviceError',
        });
        return;
      }

      client.emit('onMessage', {
        message: 'New Message',
        body: device,
      });
    } catch (err) {
      client.emit('onError', {
        message: err.message,
        error: err.name,
      });
    }
  }

  private parseQueryParams(url: string): { [s: string]: string } {
    const paramsString = url.split('?')[1].split('&');
    const params = {};
    paramsString.forEach((param) => {
      const [key, value] = param.split('=');
      params[key] = value;
    });
    return params;
  }
}
