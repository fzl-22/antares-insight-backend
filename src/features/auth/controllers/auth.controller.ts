import { Body, Controller, Post } from '@nestjs/common';
import {
  RegisterUserRequestDto,
  RegisterUserResponse,
  RegisterUserResponseDto,
} from '@auth/dto/register-user.dto';
import { AuthService } from '@auth/services/auth.service';
import {
  LoginUserRequestDto,
  LoginUserResponse,
  LoginUserResponseDto,
} from '@auth/dto/login-user.dto';
import { IResponse } from '@core/interfaces/interfaces';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'User registered successfully.',
    type: RegisterUserResponse,
  })
  @Post('/register')
  async registerUser(
    @Body() registerUserDto: RegisterUserRequestDto,
  ): Promise<IResponse<RegisterUserResponseDto>> {
    const response = await this.authService.registerUser(registerUserDto);
    return {
      message: 'User registered successfully.',
      data: response,
    };
  }

  @ApiCreatedResponse({
    description: 'User logged in successfully.',
    type: LoginUserResponse,
  })
  @Post('/login')
  async loginUser(
    @Body() loginUserDto: LoginUserRequestDto,
  ): Promise<IResponse<LoginUserResponseDto>> {
    const response = await this.authService.loginUser(loginUserDto);

    return {
      message: 'User logged in successfully.',
      data: response,
    };
  }
}
