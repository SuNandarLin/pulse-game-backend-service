import { Test, TestingModule } from '@nestjs/testing';
import { RepliesService } from './replies.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('RepliesService', () => {
  let service: RepliesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [RepliesService],
    }).compile();

    service = module.get<RepliesService>(RepliesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
