import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { LiquidityModule } from './modules/liquidity/liquidity.module';
import { InjectiveModule } from './modules/injective/injective.module';
import { WebhookModule } from './modules/webhooks/webhook.module';
import { HealthModule } from './health/health.module';
import { JobsModule } from './modules/jobs/jobs.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database (TimescaleDB)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: config.get('DATABASE_PORT'),
        username: config.get('DATABASE_USERNAME'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('DATABASE_SYNCHRONIZE') === 'true',
        logging: config.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Redis Cache
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),          
          password: config.get('REDIS_PASSWORD'),
          username: config.get('REDIS_USERNAME'),
          db: config.get('REDIS_DB'),
          ttl: 60 * 1000, // 60 seconds default
        }),
      }),
      inject: [ConfigService],
    }),

    // Bull Queue
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('BULL_REDIS_HOST'),
          port: config.get('BULL_REDIS_PORT'),
          username: config.get('REDIS_USERNAME'),
          password: config.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: config.get('RATE_LIMIT_TTL') || 60,
            limit: config.get('RATE_LIMIT_MAX') || 100,
          },
        ],
      }),
      inject: [ConfigService],
    }),

    // Logging
    WinstonModule.forRootAsync({
      useFactory: () => ({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.colorize(),
              winston.format.printf(({ timestamp, level, message, context }) => {
                return `${timestamp} [${context}] ${level}: ${message}`;
              }),
            ),
          }),
        ],
      }),
    }),

    // Feature Modules
    InjectiveModule,
    LiquidityModule,
    WebhookModule,
    JobsModule,
    HealthModule,
  ],
})
export class AppModule {}
