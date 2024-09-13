import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';

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
        new winston.transports.File({
          filename: `logs/${new Date().toISOString().split('T')[0]}.log`,
          level: 'http',
          handleExceptions: true,
          format: winston.format.combine(winston.format.uncolorize()),
        }),
      ],
    }),
  ],
})
export class LoggerModule {}
