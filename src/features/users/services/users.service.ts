import { UserResponseDto } from '@auth/dto/user.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetCurrentUserRequestDto } from '@users/dto/get-current-user.dto';
import { UpdateUserConfigRequestDto } from '@users/dto/update-user-config.dto';
import { UpdateUserProfileRequestDto } from '@users/dto/update-user-profile.dto';
import { UsersRepository } from '@users/repositories/users.repository';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getCurrentUser(
    getCurrentUserDto: GetCurrentUserRequestDto,
  ): Promise<UserResponseDto> {
    const { userId } = getCurrentUserDto;

    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToClass(UserResponseDto, user.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async updateUserProfile(
    userId: string,
    updateUserProfileDto: UpdateUserProfileRequestDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (updateUserProfileDto.email) {
      const userWithSameEmail = await this.usersRepository.findUserByEmail(
        updateUserProfileDto.email,
      );
      if (userWithSameEmail && userWithSameEmail._id.toString() !== userId) {
        throw new ConflictException('Email is not available');
      }
    }

    const updatedUser = await this.usersRepository.update(
      { _id: userId },
      { $set: updateUserProfileDto },
    );
    if (!updatedUser) {
      throw new NotFoundException('Failed to update user');
    }

    return plainToClass(UserResponseDto, updatedUser.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async updateUserConfig(
    userId: string,
    updateUserConfigDto: UpdateUserConfigRequestDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.usersRepository.update(
      { _id: userId },
      { $set: { configuration: updateUserConfigDto } },
    );
    if (!updatedUser) {
      throw new NotFoundException('Failed to update user configuration');
    }

    return plainToClass(UserResponseDto, updatedUser.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
