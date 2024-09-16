import { Injectable, Inject } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class FirebaseNotificationService {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

  async sendPushNotification(params: {
    fcmToken: string;
    title: string;
    body: string;
  }): Promise<void> {
    try {
      await firebase.messaging().send({
        notification: {
          title: params.title,
          body: params.body,
        },
        token: params.fcmToken,
        data: {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'default',
          },
        },
      });
      this.logger.info(
        `Push notification sent successfully to ${params.fcmToken}.`,
        { context: 'FIREBASE_NOTIFICATION' },
      );
    } catch {
      this.logger.warn(`Failed to push notification to ${params.fcmToken}.`, {
        context: 'FIREBASE_NOTIFICATION',
      });
    }
  }
}
