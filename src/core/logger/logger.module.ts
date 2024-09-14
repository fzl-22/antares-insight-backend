import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: 'YYYY/MM/dd, hh:mm:ss A' }),
        winston.format.errors({ stack: true }),
        winston.format.printf(
          ({ timestamp, level, message, context, trace }) => {
            return `[${level}] ${timestamp}: [${context}]\t ${message} -> ${trace ? `STACK TRACE: ${trace}` : 'No trace'} `;
          },
        ),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          filename: `logs/%DATE%.log`,
          level: 'http',
          datePattern: 'YYYY-MM-DD',
          format: winston.format.combine(winston.format.uncolorize()),
          maxSize: '1m',
          maxFiles: '30d',
        }),
      ],
    }),
  ],
})
export class LoggerModule {}
