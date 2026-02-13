import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Configuration
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const apiPrefix = configService.get('API_PREFIX') || 'api/v1';

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Liquidity Intelligence API')
    .setDescription(
      'Cross-DEX liquidity analysis API for Injective blockchain. ' +
      'Provides real-time liquidity metrics, arbitrage opportunities, ' +
      'and optimal execution routes across all Injective markets.',
    )
    .setVersion('1.0')
    .addTag('liquidity', 'Liquidity analysis endpoints')
    .addTag('markets', 'Market data endpoints')
    .addTag('arbitrage', 'Arbitrage opportunity detection')
    .addTag('webhooks', 'Webhook subscriptions')
    .addTag('health', 'Health check endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Liquidity Intelligence API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(port);

  console.log(`
    🚀 Application is running on: http://localhost:${port}/${apiPrefix}
    📚 API Documentation: http://localhost:${port}/docs
    🏥 Health Check: http://localhost:${port}/${apiPrefix}/health
  `);
}

bootstrap();
