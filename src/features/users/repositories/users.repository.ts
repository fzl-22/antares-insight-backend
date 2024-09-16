import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@auth/schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findUserById(
    userId: string,
    params: { selectConfiguration: boolean } = { selectConfiguration: true },
  ): Promise<UserDocument | null> {
    const query = this.userModel.findById(userId);
    if (!params.selectConfiguration) {
      query.select('-configuration');
    }
    return await query.exec();
  }
}
