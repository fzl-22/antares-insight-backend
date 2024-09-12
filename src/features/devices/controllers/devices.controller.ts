import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { DevicesService } from '../services/devices.service';
import {
  RegisterDeviceRequestDto,
  RegisterDeviceResponse,
  RegisterDeviceResponseDto,
} from '../dto/register-device.dto';
import { IResponse } from 'src/core/interfaces/interfaces';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { Types } from 'mongoose';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Devices')
@ApiBearerAuth()
@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token for authentication',
    required: true,
    schema: {
      type: 'string',
      example: 'my.jwt.token',
    },
  })
  @ApiCreatedResponse({
    description: 'Device created successfully.',
    type: RegisterDeviceResponse,
  })
  @UseGuards(AuthGuard)
  @Post('/register')
  async registerDevice(
    @Request() request: { userId: string },
    @Body() registerDeviceDto: RegisterDeviceRequestDto,
  ): Promise<IResponse<RegisterDeviceResponseDto>> {
    const response = await this.devicesService.registerDevice({
      ...registerDeviceDto,
      userId: Types.ObjectId.createFromHexString(request.userId),
    });

    return {
      message: 'Device created successfully.',
      data: response,
    };
  }
}
