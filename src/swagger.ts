import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const configureSwagger = (app: INestApplication): void => {
  const configService = new ConfigService();

  // Load Swagger Documentation on Dev and Staging only
  if (configService.get('NODE_ENV') === 'production') {
    return;
  }

  const appTitle = configService.get('APP_NAME') || '';
  const documentTitle = `${appTitle} Gate Pass Tracker`;
  const config = new DocumentBuilder()
    .setTitle(documentTitle.trim())
    .setDescription('API Documentation for Gate Pass Tracker')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup('docs', app, document);
};
