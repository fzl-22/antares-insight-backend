import { Module } from '@nestjs/common';
import { AuthGuard } from '@core/guards/auth.guard';
import { UsersRepository } from '@users/repositories/users.repository';
import { UsersService } from '@users/services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@auth/schemas/user.schema';
import { UsersController } from '@users/controllers/users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [AuthGuard, UsersService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
