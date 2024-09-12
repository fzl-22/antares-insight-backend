import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GetCurrentUserRequestDto,
  GetCurrentUserResponseDto,
} from '../dto/get-current-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getCurrentUser(
    getCurrentUserDto: GetCurrentUserRequestDto,
  ): Promise<GetCurrentUserResponseDto> {
    const { userId } = getCurrentUserDto;

    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToClass(GetCurrentUserResponseDto, user.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
