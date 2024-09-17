import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DevicesService } from '@devices/services/devices.service';
import {
  RegisterDeviceRequestDto,
  RegisterDeviceResponse,
} from '@devices/dto/register-device.dto';
import { IResponse } from '@core/interfaces/interfaces';
import { AuthGuard } from '@auth/guards/auth.guard';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
  ToggleDeviceStatusRequestDto,
  ToggleDeviceStatusResponse,
} from '@devices/dto/toggle-device-status.dto';
import {
  UpdateDeviceRequestDto,
  UpdateDeviceResponse,
} from '@devices/dto/update-device.dto';
import { DeleteDeviceResponse } from '@devices/dto/delete-device.dto';
import { ApiAuthorizationHeader } from '@core/decorators/api-authorization-header.decorator';
import { UserId } from '@core/decorators/user-id.decorator';

@ApiTags('Devices')
@ApiAuthorizationHeader()
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
    @UserId() userId: string,
    @Body() registerDeviceDto: RegisterDeviceRequestDto,
  ): Promise<IResponse<DeviceResponseDto>> {
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
    @UserId() userId: string,
    @Query() getDevicesDto: GetDevicesRequestDto,
  ): Promise<IResponse<GetDevicesResponseDto>> {
    const response = await this.devicesService.getDevices(
      userId,
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
    @UserId() userId: string,
    @Param() getDeviceByIdDto: GetDeviceByIdRequestDto,
  ) {
    const response = await this.devicesService.getDeviceById(
      userId,
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
    @UserId() userId: string,
    @Param('deviceId') deviceId: string,
    @Body() requestBodyDto: ToggleDeviceStatusRequestDto,
  ): Promise<IResponse<DeviceResponseDto>> {
    const response = await this.devicesService.toggleDeviceStatus(
      userId,
      deviceId,
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
    @UserId() userId: string,
    @Param('deviceId') deviceId: string,
    @Body() requestBodyDto: UpdateDeviceRequestDto,
  ): Promise<IResponse<DeviceResponseDto>> {
    const response = await this.devicesService.updateDevice(
      userId,
      deviceId,
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
    @UserId() userId: string,
    @Param('deviceId') deviceId: string,
  ): Promise<IResponse<boolean>> {
    const response = await this.devicesService.deleteDevice(userId, deviceId);

    return {
      message: 'Device deleted successfully.',
      data: response,
    };
  }
}
