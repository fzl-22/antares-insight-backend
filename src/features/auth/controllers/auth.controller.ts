import {
  Body,
  Controller,
  Delete,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  RegisterUserRequestDto,
  RegisterUserResponse,
} from '@auth/dto/register-user.dto';
import { AuthService } from '@auth/services/auth.service';
import {
  LoginUserRequestDto,
  LoginUserResponse,
  LoginUserResponseDto,
} from '@auth/dto/login-user.dto';
import { IResponse } from '@core/interfaces/interfaces';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from '@auth/dto/user.dto';
import { AuthGuard } from '@auth/guards/auth.guard';
import { LogoutUserResponse } from '@auth/dto/logout-user.dto';
import { ApiAuthorizationHeader } from '@core/decorators/api-authorization-header.decorator';

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
  ): Promise<IResponse<UserResponseDto>> {
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

  @ApiAuthorizationHeader()
  @ApiOkResponse({
    description: 'User logged out successfully.',
    type: LogoutUserResponse,
  })
  @UseGuards(AuthGuard)
  @Delete('/logout')
  async logoutUser(
    @Request() request: { userId: string },
  ): Promise<IResponse<boolean>> {
    const { userId } = request;

    const response = await this.authService.logoutUser(userId);

    return {
      message: 'User logged out successfully.',
      data: response,
    };
  }
}
