import { CanActivate, ExecutionContext, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Socket } from 'socket.io';

export class WsAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = this.extractTokenFromHeader(client);
      if (!token) {
        throw new WsException('Unauthorized.');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });

      client['userId'] = payload.userId as string;
      return true;
    } catch {
      this.logger.warn('Websocket connection unauthorized', {
        context: 'UNAUTHORIZED',
      });
      return false;
      // throw new WsException('Unauthorized.');
    }
  }

  private extractTokenFromHeader(client: Socket): string | undefined {
    const authorizationHeader = client.handshake.headers.authorization;
    if (!authorizationHeader) {
      return undefined;
    }

    const [type, token] = authorizationHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
