import { Module, Provider } from '@nestjs/common';
import { NotificationsService } from '@notifications/services/notifications.service';
import { NotificationsController } from '@notifications/controllers/notifications.controller';
import { NotificationsRepository } from '@notifications/repositories/notifications.repository';
import { UsersRepository } from '@users/repositories/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@auth/schemas/user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as firebase from 'firebase-admin';

export const firebaseAdminProvider: Provider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: () => {
    const defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert({
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
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
  providers: [
    firebaseAdminProvider,
    NotificationsService,
    NotificationsRepository,
    UsersRepository,
  ],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
