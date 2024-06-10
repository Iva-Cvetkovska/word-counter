import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CounterController } from './counter.controller';
import { CounterService } from './providers/counter.service';
import { ProcessingService } from './providers/processing.service'
import { WordCountingService } from './providers/word-counting.service';
import { SortingService } from './providers/sorting.service';
import { LanguageMiddleware } from '../middlewares/language.middleware';

@Module({
  controllers: [CounterController],
  providers: [CounterService, ProcessingService, WordCountingService, SortingService],
})

export class CounterModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LanguageMiddleware)
      .forRoutes('*');
  }
}
