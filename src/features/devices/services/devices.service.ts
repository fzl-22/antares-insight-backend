import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DevicesRepository } from '@devices/repositories/devices.repository';
import { RegisterDeviceRequestDto } from '@devices/dto/register-device.dto';
import { plainToClass } from 'class-transformer';
import { UsersRepository } from '@users/repositories/users.repository';
import {
  GetDevicesRequestDto,
  GetDevicesResponseDto,
} from '@devices/dto/get-devices.dto';
import { Types } from 'mongoose';
import { GetDeviceByIdRequestDto } from '@devices/dto/get-device-by-id.dto';
import { DeviceHistoryDto, DeviceResponseDto } from '@devices/dto/device.dto';
import {
  ToggleDeviceStatusRequestBodyDto,
  ToggleDeviceStatusRequestParamDto,
} from '@devices/dto/toggle-device-status.dto';
import {
  DeviceHistoryDocument,
  DeviceStatus,
} from '@devices/schemas/device.schema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { DevicesMqttService } from '@devices/services/devices.mqtt.service';

@Injectable()
export class DevicesService {
  constructor(
    private devicesRepository: DevicesRepository,
    private usersRepository: UsersRepository,
    private mqttService: DevicesMqttService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async registerDevice(
    userId: string,
    registerDeviceDto: RegisterDeviceRequestDto,
  ): Promise<DeviceResponseDto> {
    const { name, connectionUrl } = registerDeviceDto;

    const existingUser = await this.usersRepository.findUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const existingDevice = await this.devicesRepository.findOne({
      userId: Types.ObjectId.createFromHexString(userId),
      $or: [{ name: name }, { connectionUrl: connectionUrl }],
    });
    if (existingDevice) {
      throw new ConflictException('Device is already registered');
    }

    const device = await this.devicesRepository.create({
      ...registerDeviceDto,
      userId: Types.ObjectId.createFromHexString(userId),
    });
    if (!device) {
      throw new InternalServerErrorException(
        'Failed to register device, please try again later',
      );
    }

    return plainToClass(DeviceResponseDto, device.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async getDevices(
    userId: string,
    getDevicesDto: GetDevicesRequestDto,
  ): Promise<GetDevicesResponseDto> {
    const { page, perPage } = getDevicesDto;

    const existingUser = await this.usersRepository.findUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const filter = { userId: Types.ObjectId.createFromHexString(userId) };
    const [devices, totalDevices] = await Promise.all([
      this.devicesRepository.findAll(filter, { page: page, perPage: perPage }),
      this.devicesRepository.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDevices / perPage);

    return plainToClass(
      GetDevicesResponseDto,
      {
        page: page,
        perPage: perPage,
        totalPages: totalPages,
        devices: devices.map((device) =>
          plainToClass(GetDevicesResponseDto, device.toObject()),
        ),
      },
      { excludeExtraneousValues: true },
    );
  }

  async getDeviceById(
    userId: string,
    getDeviceByIdDto: GetDeviceByIdRequestDto,
    params: { selectHistory: boolean } = { selectHistory: true },
  ): Promise<DeviceResponseDto> {
    const { deviceId } = getDeviceByIdDto;

    const existingUser = await this.usersRepository.findUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const device = await this.devicesRepository.findOne(
      {
        _id: Types.ObjectId.createFromHexString(deviceId),
        userId: Types.ObjectId.createFromHexString(userId),
      },
      { selectHistory: params.selectHistory },
    );
    if (!device) {
      throw new NotFoundException('Device not found');
    }

    return plainToClass(DeviceResponseDto, device.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async toggleDeviceStatus(
    userId: string,
    requestParamDto: ToggleDeviceStatusRequestParamDto,
    requestBodyDto: ToggleDeviceStatusRequestBodyDto,
  ): Promise<DeviceResponseDto> {
    const { deviceId } = requestParamDto;
    const { message } = requestBodyDto;

    const existingUser = await this.usersRepository.findUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const device = await this.devicesRepository.findOne({
      _id: Types.ObjectId.createFromHexString(deviceId),
      userId: Types.ObjectId.createFromHexString(userId),
    });
    if (!device) {
      throw new NotFoundException('Device not found');
    }

    const newStatus =
      device.status === DeviceStatus.ACTIVE
        ? DeviceStatus.INACTIVE
        : DeviceStatus.ACTIVE;

    const updatedHistory = [
      ...device.history,
      { status: newStatus, message: message },
    ];

    const updatedDevice = await this.devicesRepository.findByIdAndUpdate({
      deviceId: Types.ObjectId.createFromHexString(deviceId),
      updateData: { status: newStatus, history: updatedHistory },
    });
    if (!updatedDevice) {
      throw new InternalServerErrorException(
        'Failed to toggle device status, please try again later',
      );
    }

    if (newStatus === DeviceStatus.ACTIVE) {
      this.mqttService.connectToDevice(existingUser, updatedDevice);
    } else {
      this.mqttService.disconnectDevice(deviceId);
    }

    return plainToClass(
      DeviceResponseDto,
      {
        ...updatedDevice.toObject(),
        history: device.history.map((hist) => {
          return plainToClass(
            DeviceHistoryDto,
            (hist as DeviceHistoryDocument).toObject(),
          );
        }),
      },
      { excludeExtraneousValues: true },
    );
  }
}
