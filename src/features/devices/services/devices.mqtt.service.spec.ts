import { Test, TestingModule } from '@nestjs/testing';
import { DevicesMqttService } from '@devices/services/devices.mqtt.service';

describe('DevicesMqttService', () => {
  let service: DevicesMqttService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevicesMqttService],
    }).compile();

    service = module.get<DevicesMqttService>(DevicesMqttService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
