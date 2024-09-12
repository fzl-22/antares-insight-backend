import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

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
  return new ApiKeyGuard(app.get(ConfigModule));
};
