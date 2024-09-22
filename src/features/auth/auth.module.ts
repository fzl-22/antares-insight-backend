import { Module } from '@nestjs/common';
import { AuthController } from '@auth/controllers/auth.controller';
import { AuthService } from '@auth/services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@auth/schemas/user.schema';
import { AuthRepository } from '@auth/repositories/auth.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
