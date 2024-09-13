import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DevicesRepository } from '../repositories/devices.repository';
import {
  RegisterDeviceRequestDto,
  RegisterDeviceResponseDto,
} from '../dto/register-device.dto';
import { plainToClass } from 'class-transformer';
import { UsersRepository } from 'src/features/users/repositories/users.repository';
import {
  GetDevicesRequestDto,
  GetDevicesResponseDto,
} from '../dto/get-devices.dto';
import { Types } from 'mongoose';
import {
  GetDeviceByIdRequestDto,
  GetDeviceByIdResponseDto,
} from '../dto/get-device-by-id.dto';

@Injectable()
export class DevicesService {
  constructor(
    private devicesRepository: DevicesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async registerDevice(
    userId: string,
    registerDeviceDto: RegisterDeviceRequestDto,
  ): Promise<RegisterDeviceResponseDto> {
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

    return plainToClass(RegisterDeviceResponseDto, device.toObject(), {
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
  ): Promise<GetDeviceByIdResponseDto> {
    const { deviceId } = getDeviceByIdDto;

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

    return plainToClass(GetDeviceByIdResponseDto, device.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
