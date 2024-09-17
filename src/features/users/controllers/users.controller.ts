import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  GetCurrentUserRequestDto,
  GetCurrentUserResponse,
} from '@users/dto/get-current-user.dto';
import { AuthGuard } from '@core/guards/auth.guard';
import { IResponse } from '@core/interfaces/interfaces';
import { UsersService } from '@users/services/users.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from '@auth/dto/user.dto';
import {
  UpdateUserRequestDto,
  UpdateUserResponse,
} from '@users/dto/update-user.dto';
import { UserId } from '@core/decorators/user-id.decorator';
import { ApiAuthorizationHeader } from '@core/decorators/api-authorization-header.decorator';

@ApiTags('Users')
@ApiAuthorizationHeader()
@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({
    description: 'User fetched successfully.',
    type: GetCurrentUserResponse,
  })
  @UseGuards(AuthGuard)
  @Get('/current')
  async getCurrentUser(
    @Request() getCurrentUserDto: GetCurrentUserRequestDto,
  ): Promise<IResponse<UserResponseDto>> {
    const user = await this.usersService.getCurrentUser(getCurrentUserDto);

    return {
      message: 'User fetched successfully.',
      data: user,
    };
  }

  @ApiOkResponse({
    description: 'User updated successfully.',
    type: UpdateUserResponse,
  })
  @UseGuards(AuthGuard)
  @Patch('/update')
  async updateUser(
    @UserId() userId: string,
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<IResponse<UserResponseDto>> {
    const response = await this.usersService.updateUser(userId, updateUserDto);

    return {
      message: 'User updated successfully.',
      data: response,
    };
  }
}
