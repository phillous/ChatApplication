import { NestFactory } from '@nestjs/core';
import {GateWayModule } from './websocket.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(GateWayModule);
  app.use(cookieParser(process.env.COOKIE_SECRET || 'supersecret'));
  await app.listen(3001);
}
bootstrap();
