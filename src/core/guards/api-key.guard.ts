import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  Inject,
  Injectable,
  Provider,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const apiKey = this.extractApiKeyFromHeader(request);
      if (!apiKey) {
        throw new UnauthorizedException('API key is missing');
      }

      const isApiKeyVerified = this.verifyApiKey(apiKey);
      if (!isApiKeyVerified) {
        throw new UnauthorizedException('Invalid API key');
      }

      return true;
    } catch (err) {
      this.logger.warn(`${err.status} ${err.message}`, {
        context: err.name,
        trace: err.stack,
      });
      throw err;
    }
  }

  private extractApiKeyFromHeader(request: Request): string | undefined {
    const apiKey = request.headers['x-api-key'];
    return apiKey;
  }

  private verifyApiKey(apiKey: string): boolean {
    const storedApiKey = this.configService.get('API_KEY');
    return storedApiKey === apiKey;
  }
}

export const createApiKeyGuard = (app: INestApplication<any>): ApiKeyGuard => {
  return new ApiKeyGuard(
    app.get(ConfigModule),
    app.get(WINSTON_MODULE_PROVIDER),
  );
};

export const createApiKeyGuardProvider = (): Provider => {
  return {
    provide: APP_GUARD,
    useClass: ApiKeyGuard,
  };
};
