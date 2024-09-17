import { Module } from '@nestjs/common';
import { UsersRepository } from '@users/repositories/users.repository';
import { UsersService } from '@users/services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@auth/schemas/user.schema';
import { UsersController } from '@users/controllers/users.controller';
import { AuthRepository } from '@auth/repositories/auth.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AuthRepository],
})
export class UsersModule {}
