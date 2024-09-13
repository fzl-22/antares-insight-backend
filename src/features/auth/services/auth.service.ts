import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  RegisterUserRequestDto,
  RegisterUserResponseDto,
} from '@auth/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '@auth/repositories/auth.repository';
import { plainToClass, plainToInstance } from 'class-transformer';
import {
  LoggedInUserDto,
  LoginUserRequestDto,
  LoginUserResponseDto,
} from '@auth/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async registerUser(
    registerUserDto: RegisterUserRequestDto,
  ): Promise<RegisterUserResponseDto> {
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

    return plainToClass(RegisterUserResponseDto, user.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async loginUser(
    loginUserDto: LoginUserRequestDto,
  ): Promise<LoginUserResponseDto> {
    const { email, password } = loginUserDto;

    const user = await this.authRepository.findOne({ email: email });
    if (!user) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const isPasswordMathing = await bcrypt.compare(password, user.password);
    if (!isPasswordMathing) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const payload = { userId: user._id.toString(), email: user.email };
    const token = await this.jwtService.signAsync(payload);

    const userResponse = plainToInstance(LoggedInUserDto, user.toObject());

    return plainToClass(
      LoginUserResponseDto,
      {
        token: token,
        user: userResponse,
      },
      { excludeExtraneousValues: true },
    );
  }
}
