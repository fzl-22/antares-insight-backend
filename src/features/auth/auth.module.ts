import { Module } from '@nestjs/common';
import { AuthController } from '@auth/controllers/auth.controller';
import { AuthService } from '@auth/services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@auth/schemas/user.schema';
import { AuthRepository } from '@auth/repositories/auth.repository';
import { MailNotificationService } from '@core/utils/notification/mail-notification.service';
import { FirebaseNotificationService } from '@core/utils/notification/firebase-notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    MailNotificationService,
    FirebaseNotificationService,
  ],
})
export class AuthModule {}
