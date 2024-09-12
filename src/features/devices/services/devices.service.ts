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

@Injectable()
export class DevicesService {
  constructor(
    private devicesRepository: DevicesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async registerDevice(
    registerDeviceDto: RegisterDeviceRequestDto,
  ): Promise<RegisterDeviceResponseDto> {
    const { userId, name, connectionUrl } = registerDeviceDto;

    const existingUser = await this.usersRepository.findUserById(
      userId.toString(),
    );
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const existingDevice = await this.devicesRepository.findOne({
      $or: [{ name: name }, { connectionUrl: connectionUrl }],
    });
    if (existingDevice) {
      throw new ConflictException('Device is already registered');
    }

    const device = await this.devicesRepository.create(registerDeviceDto);
    if (!device) {
      throw new InternalServerErrorException(
        'Failed to register device, please try again later',
      );
    }

    return plainToClass(RegisterDeviceResponseDto, device.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
