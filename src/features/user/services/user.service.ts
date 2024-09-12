import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GetCurrentUserRequestDto,
  GetCurrentUserResponseDto,
} from '../dto/get-current-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getCurrentUser(
    getCurrentUserDto: GetCurrentUserRequestDto,
  ): Promise<GetCurrentUserResponseDto> {
    const { userId } = getCurrentUserDto;

    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToClass(GetCurrentUserResponseDto, user.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
