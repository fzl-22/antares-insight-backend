import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterUserRequestDto } from '@auth/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '@auth/repositories/auth.repository';
import { plainToClass, plainToInstance } from 'class-transformer';
import {
  LoginUserRequestDto,
  LoginUserResponseDto,
} from '@auth/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from '@auth/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async registerUser(
    registerUserDto: RegisterUserRequestDto,
  ): Promise<UserResponseDto> {
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

    return plainToClass(
      UserResponseDto,
      { ...user.toObject(), configuration: undefined },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async loginUser(
    loginUserDto: LoginUserRequestDto,
  ): Promise<LoginUserResponseDto> {
    const { email, password, fcmToken } = loginUserDto;

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

    const updatedUser = await this.authRepository.update(
      { _id: user._id },
      { fcmToken: fcmToken },
    );

    const userResponse = plainToInstance(
      UserResponseDto,
      updatedUser.toObject(),
    );

    return plainToClass(
      LoginUserResponseDto,
      {
        token: token,
        user: userResponse,
      },
      { excludeExtraneousValues: true },
    );
  }

  async logoutUser(userId: string): Promise<boolean> {
    const updatedUser = await this.authRepository.update(
      { _id: userId },
      { fcmToken: null },
    );

    return !!updatedUser;
  }
}
