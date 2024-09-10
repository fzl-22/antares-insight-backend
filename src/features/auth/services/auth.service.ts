import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../schemas/user.schema';
import {
  RegisterUserRequestDto,
  RegisterUserResponseDto,
} from '../dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../repositories/auth.repository';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async registerUser(registerUserDto: RegisterUserRequestDto): Promise<User> {
    const { email, password } = registerUserDto;

    const existingUser = await this.authRepository.findOne({ email: email });
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.authRepository.create({
      ...registerUserDto,
      password: hashedPassword,
    });
    if (!user) {
      throw new InternalServerErrorException(
        'Failed to register user, please try again later',
      );
    }

    return plainToClass(RegisterUserResponseDto, user.toObject());
  }
}
