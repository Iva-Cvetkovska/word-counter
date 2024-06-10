import { Test, TestingModule } from '@nestjs/testing';
import { CounterController } from './counter.controller';
import { CounterService } from './providers/counter.service';
import { ProcessingService } from './providers/processing.service';
import { WordCountingService } from './providers/word-counting.service';
import { SortingService } from './providers/sorting.service';

describe('CounterController', () => {
  let controller: CounterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CounterController],
      providers: [CounterService, ProcessingService, WordCountingService, SortingService],
    }).compile();

    controller = module.get<CounterController>(CounterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
