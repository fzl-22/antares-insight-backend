import { Test, TestingModule } from '@nestjs/testing';
import { DevicesRepository } from '@devices/repositories/devices.repository';

describe('DevicesRepository', () => {
  let provider: DevicesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevicesRepository],
    }).compile();

    provider = module.get<DevicesRepository>(DevicesRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
