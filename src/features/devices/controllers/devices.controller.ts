import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DevicesService } from '../services/devices.service';
import {
  RegisterDeviceRequestDto,
  RegisterDeviceResponse,
  RegisterDeviceResponseDto,
} from '../dto/register-device.dto';
import { IResponse } from 'src/core/interfaces/interfaces';
import { AuthGuard } from 'src/core/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GetDevicesRequestDto,
  GetDevicesResponse,
  GetDevicesResponseDto,
} from '../dto/get-devices.dto';

@ApiTags('Devices')
@ApiBearerAuth()
@ApiHeader({
  name: 'Authorization',
  description: 'JWT token for authentication',
  required: true,
  schema: {
    type: 'string',
    example: 'my.jwt.token',
  },
})
@Controller('devices')
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

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
    const { userId } = request;
    console.log('BEFORE CONTROLLER: ', userId);
    const response = await this.devicesService.registerDevice(
      userId,
      registerDeviceDto,
    );

    console.log('AFTER CONTROLLER: ', response.userId);

    return {
      message: 'Device created successfully.',
      data: response,
    };
  }

  @ApiOkResponse({
    description: 'Devices fetched successfully.',
    type: GetDevicesResponse,
  })
  @UseGuards(AuthGuard)
  @Get('/')
  async getDevices(
    @Request() request: { userId: string },
    @Query() getDevicesDto: GetDevicesRequestDto,
  ): Promise<IResponse<GetDevicesResponseDto>> {
    const response = await this.devicesService.getDevices(
      request.userId,
      getDevicesDto,
    );

    return {
      message: 'Devices fetched successfully.',
      data: response,
    };
  }
}
