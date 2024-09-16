import { MailerModule } from '@nestjs-modules/mailer';
import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailNotificationService } from '@core/utils/notification/mail-notification.service';
import * as admin from 'firebase-admin';

export const firebaseAdminProvider: Provider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: () => {
    const defaultApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });

    return { defaultApp };
  },
};

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
  providers: [MailNotificationService, firebaseAdminProvider],
})
export class NotificationModule {}
