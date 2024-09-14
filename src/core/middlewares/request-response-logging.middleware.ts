import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class RequestResponseLoggingMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const { method, url, ip } = req;

    const requestLogMessage = `${method} ${url} by ${ip}`;
    this.logger.info(requestLogMessage, { context: 'REQ' });

    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusCode = res.statusCode;
      const statusMessage = res.statusMessage;
      const status = `${statusCode} ${statusMessage}`;

      const responseLogMessage = `${method} ${url} by ${ip} takes ${duration}ms and returned ${status}`;
      this.logger.info(responseLogMessage, { context: 'RES' });
    });

    next();
  }
}
