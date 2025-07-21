import { swaggerSetupOptions } from '@/config/swagger.config';
import { LoggingInterceptor } from '@/interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalFilters();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false, // 👈 critical
      },
      forbidUnknownValues: true, // 👈 also critical
      validateCustomDecorators: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('MakeEasyCommerce GateWay API')
    .setDescription('E-commerce platform User API documentation')
    .setVersion('1.0')
    .addTag('App', 'Health check and basic operations')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api', app, document, swaggerSetupOptions);

  const port = Number(process.env.GATEWAY_PORT) || 3000;
  await app.listen(port);
}

void bootstrap();
