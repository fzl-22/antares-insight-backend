import { Module } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [AuthGuard, UserService, UserRepository],
})
export class UserModule {}
