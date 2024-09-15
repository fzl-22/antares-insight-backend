import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@core/utils/notification/mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const FROM = `${configService.get('NODEMAILER_NAME')} <${configService.get('NODEMAILER_EMAIL')}>`;
        return {
          transport: {
            host: configService.get('NODEMAILER_TRANSPORT_HOST'),
            port: configService.get('NODEMAILER_TRANSPORT_PORT'),
            secure: configService.get<boolean>('NODEMAILER_TRANSPORT_SECURE'),
            auth: {
              user: configService.get('NODEMAILER_EMAIL'),
              pass: configService.get('NODEMAILER_PASSWORD'),
            },
          },
          defaults: {
            from: FROM,
          },
        };
      },
    }),
  ],
  providers: [MailService],
})
export class MailModule {}
