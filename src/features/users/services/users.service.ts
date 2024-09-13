import { UserResponseDto } from '@auth/dto/user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetCurrentUserRequestDto } from '@users/dto/get-current-user.dto';
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
}
