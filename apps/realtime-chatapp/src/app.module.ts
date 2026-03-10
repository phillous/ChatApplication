import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from '@/api/src/api.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CurrentUserMiddleware } from '@app/middleware/middleware';

@Module({
  imports: [ApiModule, EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(CurrentUserMiddleware).forRoutes('messages');
    }
}
