import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DevicesService } from '@devices/services/devices.service';
import {
  RegisterDeviceRequestDto,
  RegisterDeviceResponse,
} from '@devices/dto/register-device.dto';
import { IResponse } from '@core/interfaces/interfaces';
import { AuthGuard } from '@core/guards/auth.guard';
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
} from '@devices/dto/get-devices.dto';
import {
  GetDeviceByIdRequestDto,
  GetDeviceByIdResponse,
} from '@devices/dto/get-device-by-id.dto';
import { DeviceResponseDto } from '@devices/dto/device.dto';
import {
  ToggleDeviceStatusRequestBodyDto,
  ToggleDeviceStatusRequestParamDto,
  ToggleDeviceStatusResponse,
} from '@devices/dto/toggle-device-status.dto';
import {
  UpdateDeviceRequestBodyDto,
  UpdateDeviceRequestParamDto,
  UpdateDeviceResponse,
} from '@devices/dto/update-device.dto';
import {
  DeleteDeviceRequestDto,
  DeleteDeviceResponse,
} from '@devices/dto/delete-device.dto';

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
  ): Promise<IResponse<DeviceResponseDto>> {
    const { userId } = request;
    const response = await this.devicesService.registerDevice(
      userId,
      registerDeviceDto,
    );

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

  @ApiOkResponse({
    description: 'Device fetched successfully.',
    type: GetDeviceByIdResponse,
  })
  @UseGuards(AuthGuard)
  @Get('/:deviceId')
  async getDeviceById(
    @Request() request: { userId: string },
    @Param() getDeviceByIdDto: GetDeviceByIdRequestDto,
  ) {
    const response = await this.devicesService.getDeviceById(
      request.userId,
      getDeviceByIdDto,
    );

    return {
      message: 'Device fetched successfully.',
      data: response,
    };
  }

  @ApiCreatedResponse({
    description: 'Device status toggled successfully.',
    type: ToggleDeviceStatusResponse,
  })
  @UseGuards(AuthGuard)
  @Post('/:deviceId/toggle-status')
  async toggleDeviceStatus(
    @Request() request: { userId: string },
    @Param() requestParamDto: ToggleDeviceStatusRequestParamDto,
    @Body() requestBodyDto: ToggleDeviceStatusRequestBodyDto,
  ): Promise<IResponse<DeviceResponseDto>> {
    const { userId } = request;

    const response = await this.devicesService.toggleDeviceStatus(
      userId,
      requestParamDto,
      requestBodyDto,
    );

    return {
      message: 'Device status toggled successfully.',
      data: response,
    };
  }

  @ApiOkResponse({
    description: 'Device updated successfully.',
    type: UpdateDeviceResponse,
  })
  @UseGuards(AuthGuard)
  @Patch('/:deviceId/update')
  async updateDevice(
    @Request() request: { userId: string },
    @Param() requestParamDto: UpdateDeviceRequestParamDto,
    @Body() requestBodyDto: UpdateDeviceRequestBodyDto,
  ): Promise<IResponse<DeviceResponseDto>> {
    const { userId } = request;
    const response = await this.devicesService.updateDevice(
      userId,
      requestParamDto,
      requestBodyDto,
    );

    return {
      message:
        'Device updated successfully. Please restart your device connection in the application.',
      data: response,
    };
  }

  @ApiOkResponse({
    description: 'Device deleted successfully.',
    type: DeleteDeviceResponse,
  })
  @UseGuards(AuthGuard)
  @Delete('/:deviceId/delete')
  async deleteDevice(
    @Request() request: { userId: string },
    @Param() requestParamDto: DeleteDeviceRequestDto,
  ): Promise<IResponse<boolean>> {
    const { userId } = request;
    const response = await this.devicesService.deleteDevice(
      userId,
      requestParamDto,
    );

    return {
      message: 'Device deleted successfully.',
      data: response,
    };
  }
}
