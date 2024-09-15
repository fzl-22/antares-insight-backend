import { MailerService } from '@nestjs-modules/mailer';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

export class MailService {
  constructor(
    private mailerService: MailerService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async sendMail(params: {
    to: string;
    subject: string;
    text: string;
  }): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: params.to,
        subject: params.subject,
        text: params.text,
      });

      return true;
    } catch (err) {
      this.logger.warn(err.message, { context: 'MAILER' });
      return false;
    }
  }
}
