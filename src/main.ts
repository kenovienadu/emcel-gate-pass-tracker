import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { FormattedResponseInterceptor } from './interceptors/response.interceptor';
import { TIMEZONES } from './constants';
import { configureSwagger } from './swagger';

async function bootstrap() {
  process.env.TZ = TIMEZONES.LAGOS; // Set default timezone

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger = new Logger('APP_INIT');
  const PORT = config.get('PORT') || 3000;

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('v1/api');
  app.use(compression());
  app.enableCors();
  app.useGlobalInterceptors(new FormattedResponseInterceptor());

  configureSwagger(app);
  await app.listen(+PORT, () => logger.log(`App Running on Port: ${PORT}`));
}
bootstrap();
