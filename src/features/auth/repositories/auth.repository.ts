import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@auth/schemas/user.schema';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(filter: FilterQuery<User>): Promise<UserDocument | null> {
    return await this.userModel.findOne(filter).exec();
  }

  async create(user: User): Promise<UserDocument | null> {
    return await this.userModel.create(user);
  }

  async update(
    filter: FilterQuery<User>,
    updateData: UpdateQuery<User>,
  ): Promise<UserDocument | null> {
    return await this.userModel.findOneAndUpdate(filter, updateData, {
      new: true,
    });
  }
}
