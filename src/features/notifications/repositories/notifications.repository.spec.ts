import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsRepository } from '@notifications/repositories/notifications.repository';

describe('NotificationsRepository', () => {
  let provider: NotificationsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsRepository],
    }).compile();

    provider = module.get<NotificationsRepository>(NotificationsRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
