# Comprehensive AI Coding Agent Prompt: Cross-DEX Liquidity Intelligence API

```markdown
# PROJECT: Cross-DEX Liquidity Intelligence API for Injective Blockchain

## MISSION
Build a production-ready, professional API service that provides intelligent liquidity analysis across all Injective DEX markets. This API must help developers make informed trading decisions by exposing liquidity metrics, arbitrage opportunities, and optimal execution routes.

## CRITICAL SUCCESS CRITERIA
1. ✅ All endpoints must return real data from Injective testnet
2. ✅ Response times must be <200ms for cached data, <1s for computed data
3. ✅ Professional code structure following NestJS best practices
4. ✅ Complete OpenAPI/Swagger documentation auto-generated
5. ✅ Comprehensive README with setup instructions and examples
6. ✅ Docker setup for one-command local deployment
7. ✅ Error handling for all edge cases
8. ✅ TypeScript with strict typing throughout
9. ✅ Unit tests for critical business logic
10. ✅ Working webhook system for real-time alerts

---

## TECH STACK REQUIREMENTS

### Core Stack
- **Runtime:** Node.js v20+
- **Language:** TypeScript 5.3+ (strict mode enabled)
- **Framework:** NestJS 10+
- **Injective SDK:** @injectivelabs/sdk-ts (latest version)
- **Package Manager:** pnpm

### Data Layer
- **Cache:** Redis 7+
- **Database:** TimescaleDB (PostgreSQL extension for time-series)
- **ORM:** TypeORM with TimescaleDB support
- **Queue:** Bull + Bull-Board (for queue monitoring)

### Infrastructure
- **API Documentation:** @nestjs/swagger
- **Validation:** class-validator + class-transformer
- **Configuration:** @nestjs/config with .env
- **Logging:** Winston + nest-winston
- **Rate Limiting:** @nestjs/throttler with Redis storage
- **Authentication:** @nestjs/jwt (optional for API keys)

### Development
- **Testing:** Jest (unit tests for core logic)
- **Linting:** ESLint + Prettier
- **Docker:** Multi-stage Dockerfile + docker-compose
- **Git:** Proper .gitignore, .env.example

---

## PROJECT STRUCTURE

```
liquidity-intelligence-api/
├── src/
│   ├── main.ts                          # Application entry point
│   ├── app.module.ts                    # Root module
│   ├── config/                          # Configuration files
│   │   ├── injective.config.ts          # Injective network configs
│   │   ├── redis.config.ts              # Redis connection
│   │   └── database.config.ts           # TimescaleDB config
│   ├── common/                          # Shared utilities
│   │   ├── decorators/                  # Custom decorators
│   │   ├── filters/                     # Exception filters
│   │   ├── guards/                      # Auth guards (optional)
│   │   ├── interceptors/                # Response interceptors
│   │   └── pipes/                       # Validation pipes
│   ├── modules/
│   │   ├── liquidity/                   # Main liquidity module
│   │   │   ├── liquidity.controller.ts  # REST endpoints
│   │   │   ├── liquidity.service.ts     # Business logic
│   │   │   ├── liquidity.module.ts      
│   │   │   ├── dto/                     # Data transfer objects
│   │   │   │   ├── token-liquidity.dto.ts
│   │   │   │   ├── market-analysis.dto.ts
│   │   │   │   ├── arbitrage.dto.ts
│   │   │   │   └── best-route.dto.ts
│   │   │   ├── entities/                # Database entities
│   │   │   │   ├── liquidity-snapshot.entity.ts
│   │   │   │   └── market-metrics.entity.ts
│   │   │   └── algorithms/              # Core computation
│   │   │       ├── slippage-calculator.ts
│   │   │       ├── liquidity-scorer.ts
│   │   │       ├── arbitrage-detector.ts
│   │   │       └── route-optimizer.ts
│   │   ├── injective/                   # Injective integration
│   │   │   ├── injective.service.ts     # SDK wrapper
│   │   │   ├── injective.module.ts
│   │   │   ├── websocket.service.ts     # Real-time data stream
│   │   │   └── types/                   # Injective type definitions
│   │   ├── cache/                       # Redis cache module
│   │   │   ├── cache.service.ts
│   │   │   └── cache.module.ts
│   │   ├── webhooks/                    # Webhook system
│   │   │   ├── webhook.controller.ts
│   │   │   ├── webhook.service.ts
│   │   │   ├── webhook.module.ts
│   │   │   └── dto/
│   │   │       └── webhook-subscription.dto.ts
│   │   └── jobs/                        # Background jobs
│   │       ├── jobs.module.ts
│   │       ├── liquidity-updater.processor.ts
│   │       └── arbitrage-scanner.processor.ts
│   └── health/                          # Health check endpoints
│       ├── health.controller.ts
│       └── health.module.ts
├── test/                                # Test files
│   ├── unit/
│   │   └── algorithms/
│   │       ├── slippage-calculator.spec.ts
│   │       └── arbitrage-detector.spec.ts
│   └── e2e/
│       └── liquidity.e2e-spec.ts
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .dockerignore
├── docs/                                # Additional documentation
│   ├── API.md                          # API usage examples
│   ├── ARCHITECTURE.md                 # System design
│   └── DEPLOYMENT.md                   # Deployment guide
├── scripts/
│   └── seed-database.ts                # Initial data seeding
├── .env.example                        # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── nest-cli.json
├── README.md                           # Main documentation
└── LICENSE
```

---

## DETAILED IMPLEMENTATION REQUIREMENTS

### PHASE 1: Project Initialization & Setup

#### 1.1 Initialize NestJS Project
```bash
# Commands you should execute:
pnpm dlx @nestjs/cli new liquidity-intelligence-api
cd liquidity-intelligence-api
pnpm install
```

#### 1.2 Install All Dependencies
```bash
# Core dependencies
pnpm add @injectivelabs/sdk-ts @injectivelabs/networks
pnpm add @nestjs/config @nestjs/swagger @nestjs/throttler
pnpm add @nestjs/typeorm typeorm pg
pnpm add @nestjs/bull bull bull-board
pnpm add ioredis @nestjs/cache-manager cache-manager-ioredis-yet
pnpm add class-validator class-transformer
pnpm add winston nest-winston
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt

# Dev dependencies
pnpm add -D @types/node @types/bull @types/ioredis
pnpm add -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
pnpm add -D @nestjs/testing @types/jest
```

#### 1.3 Configure TypeScript (tsconfig.json)
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["src/*"],
      "@config/*": ["src/config/*"],
      "@modules/*": ["src/modules/*"],
      "@common/*": ["src/common/*"]
    }
  }
}
```

#### 1.4 Environment Configuration (.env.example)
```bash
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Injective Network
INJECTIVE_NETWORK=testnet
INJECTIVE_CHAIN_ID=injective-888
INJECTIVE_LCD_ENDPOINT=https://testnet.lcd.injective.network
INJECTIVE_GRPC_ENDPOINT=testnet.grpc.injective.network:443

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# TimescaleDB
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=liquidity_intelligence
DATABASE_SYNCHRONIZE=true

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Bull Queue
BULL_REDIS_HOST=localhost
BULL_REDIS_PORT=6379

# Logging
LOG_LEVEL=debug

# API Keys (optional)
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=30d

# Webhook Configuration
WEBHOOK_SECRET=your-webhook-secret
```

---

### PHASE 2: Core Infrastructure Setup

#### 2.1 App Module Configuration (src/app.module.ts)
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ThrottlerModule } from '@nestjs/throttler';
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
        },
      }),
      inject: [ConfigService],
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('RATE_LIMIT_TTL'),
        limit: config.get('RATE_LIMIT_MAX'),
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
```

#### 2.2 Main Application Bootstrap (src/main.ts)
```typescript
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
```

---

### PHASE 3: Injective Integration Module

#### 3.1 Injective Service (src/modules/injective/injective.service.ts)
```typescript
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ChainGrpcWasmApi,
  IndexerGrpcSpotApi,
  IndexerGrpcDerivativesApi,
  IndexerRestExplorerApi,
} from '@injectivelabs/sdk-ts';
import { Network, getNetworkEndpoints } from '@injectivelabs/networks';

@Injectable()
export class InjectiveService implements OnModuleInit {
  private readonly logger = new Logger(InjectiveService.name);
  
  private spotApi: IndexerGrpcSpotApi;
  private derivativesApi: IndexerGrpcDerivativesApi;
  private explorerApi: IndexerRestExplorerApi;
  private wasmApi: ChainGrpcWasmApi;
  private network: Network;

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    const networkType = this.config.get('INJECTIVE_NETWORK');
    this.network = networkType === 'mainnet' ? Network.Mainnet : Network.Testnet;
    
    const endpoints = getNetworkEndpoints(this.network);
    
    this.spotApi = new IndexerGrpcSpotApi(endpoints.indexer);
    this.derivativesApi = new IndexerGrpcDerivativesApi(endpoints.indexer);
    this.explorerApi = new IndexerRestExplorerApi(endpoints.explorer);
    this.wasmApi = new ChainGrpcWasmApi(endpoints.grpc);

    this.logger.log(`Connected to Injective ${networkType}`);
  }

  /**
   * Get all active spot markets
   */
  async getSpotMarkets() {
    try {
      const { markets } = await this.spotApi.fetchMarkets();
      return markets;
    } catch (error) {
      this.logger.error(`Failed to fetch spot markets: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get orderbook for a specific market
   */
  async getOrderbook(marketId: string) {
    try {
      const orderbook = await this.spotApi.fetchOrderbookV2(marketId);
      return orderbook;
    } catch (error) {
      this.logger.error(`Failed to fetch orderbook for ${marketId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get market trades
   */
  async getMarketTrades(marketId: string, limit: number = 100) {
    try {
      const { trades } = await this.spotApi.fetchTrades({
        marketId,
        limit,
      });
      return trades;
    } catch (error) {
      this.logger.error(`Failed to fetch trades for ${marketId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get market summary (24h stats)
   */
  async getMarketSummary(marketId: string) {
    try {
      const market = await this.spotApi.fetchMarket(marketId);
      return market;
    } catch (error) {
      this.logger.error(`Failed to fetch market summary for ${marketId}: ${error.message}`);
      throw error;
    }
  }

  // Getters for APIs (for direct access if needed)
  getSpotApi() {
    return this.spotApi;
  }

  getDerivativesApi() {
    return this.derivativesApi;
  }

  getExplorerApi() {
    return this.explorerApi;
  }

  getWasmApi() {
    return this.wasmApi;
  }

  getNetwork() {
    return this.network;
  }
}
```

#### 3.2 WebSocket Service for Real-time Data (src/modules/injective/websocket.service.ts)
```typescript
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subject, Observable } from 'rxjs';
import {
  IndexerGrpcSpotStream,
  SpotOrderbookUpdate,
} from '@injectivelabs/sdk-ts';
import { getNetworkEndpoints, Network } from '@injectivelabs/networks';

export interface OrderbookStreamData {
  marketId: string;
  orderbook: SpotOrderbookUpdate;
  timestamp: Date;
}

@Injectable()
export class WebSocketService implements OnModuleInit {
  private readonly logger = new Logger(WebSocketService.name);
  private spotStream: IndexerGrpcSpotStream;
  private orderbookSubject = new Subject<OrderbookStreamData>();

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    const networkType = this.config.get('INJECTIVE_NETWORK');
    const network = networkType === 'mainnet' ? Network.Mainnet : Network.Testnet;
    const endpoints = getNetworkEndpoints(network);

    this.spotStream = new IndexerGrpcSpotStream(endpoints.indexer);
    this.logger.log('WebSocket service initialized');
  }

  /**
   * Subscribe to orderbook updates for specific markets
   */
  subscribeToOrderbooks(marketIds: string[]) {
    const streamFn = this.spotStream.streamOrderbooksV2.bind(this.spotStream);

    streamFn(marketIds).subscribe({
      next: (orderbookUpdate) => {
        this.orderbookSubject.next({
          marketId: orderbookUpdate.marketId,
          orderbook: orderbookUpdate,
          timestamp: new Date(),
        });
      },
      error: (error) => {
        this.logger.error(`Orderbook stream error: ${error.message}`);
      },
      complete: () => {
        this.logger.warn('Orderbook stream completed');
      },
    });

    this.logger.log(`Subscribed to orderbooks: ${marketIds.join(', ')}`);
  }

  /**
   * Get observable for orderbook updates
   */
  getOrderbookStream(): Observable<OrderbookStreamData> {
    return this.orderbookSubject.asObservable();
  }
}
```

#### 3.3 Injective Module (src/modules/injective/injective.module.ts)
```typescript
import { Module } from '@nestjs/common';
import { InjectiveService } from './injective.service';
import { WebSocketService } from './websocket.service';

@Module({
  providers: [InjectiveService, WebSocketService],
  exports: [InjectiveService, WebSocketService],
})
export class InjectiveModule {}
```

---

### PHASE 4: Core Liquidity Analysis Algorithms

#### 4.1 Slippage Calculator (src/modules/liquidity/algorithms/slippage-calculator.ts)
```typescript
import { Injectable } from '@nestjs/common';

export interface SlippageResult {
  expectedPrice: number;
  actualPrice: number;
  slippagePercent: number;
  priceImpact: number;
  totalCost: number;
}

@Injectable()
export class SlippageCalculator {
  /**
   * Calculate slippage for a given order size
   * @param orderbook - Array of price levels [{price, quantity}]
   * @param orderSize - Size of the order to execute
   * @param side - 'buy' or 'sell'
   */
  calculateSlippage(
    orderbook: Array<{ price: number; quantity: number }>,
    orderSize: number,
    side: 'buy' | 'sell',
  ): SlippageResult {
    if (orderSize <= 0) {
      throw new Error('Order size must be positive');
    }

    if (!orderbook || orderbook.length === 0) {
      throw new Error('Orderbook is empty');
    }

    // Sort orderbook (best prices first)
    const sortedBook = [...orderbook].sort((a, b) => 
      side === 'buy' ? a.price - b.price : b.price - a.price
    );

    const bestPrice = sortedBook[0].price;
    let remainingSize = orderSize;
    let totalCost = 0;
    let totalQuantity = 0;

    // Walk through orderbook to fill the order
    for (const level of sortedBook) {
      if (remainingSize <= 0) break;

      const quantityToTake = Math.min(remainingSize, level.quantity);
      totalCost += quantityToTake * level.price;
      totalQuantity += quantityToTake;
      remainingSize -= quantityToTake;
    }

    // Check if orderbook has enough liquidity
    if (remainingSize > 0) {
      throw new Error(
        `Insufficient liquidity. Can only fill ${totalQuantity} of ${orderSize}`,
      );
    }

    const averagePrice = totalCost / totalQuantity;
    const slippagePercent = ((averagePrice - bestPrice) / bestPrice) * 100;
    const priceImpact = slippagePercent;

    return {
      expectedPrice: bestPrice,
      actualPrice: averagePrice,
      slippagePercent: Math.abs(slippagePercent),
      priceImpact: Math.abs(priceImpact),
      totalCost,
    };
  }

  /**
   * Calculate slippage at different order sizes
   */
  calculateSlippageLadder(
    orderbook: Array<{ price: number; quantity: number }>,
    side: 'buy' | 'sell',
    steps: number[] = [100, 500, 1000, 5000, 10000],
  ): Array<{ orderSize: number; slippage: SlippageResult }> {
    return steps.map(size => {
      try {
        return {
          orderSize: size,
          slippage: this.calculateSlippage(orderbook, size, side),
        };
      } catch (error) {
        return {
          orderSize: size,
          slippage: null,
        };
      }
    });
  }
}
```

#### 4.2 Liquidity Scorer (src/modules/liquidity/algorithms/liquidity-scorer.ts)
```typescript
import { Injectable } from '@nestjs/common';

export interface LiquidityScore {
  overall: number;          // 0-100
  depth: number;           // Amount available at best 10 levels
  spread: number;          // Bid-ask spread percentage
  concentration: number;   // Gini coefficient (0=perfect distribution)
  resilience: number;      // How quickly liquidity recovers
}

@Injectable()
export class LiquidityScorer {
  /**
   * Calculate comprehensive liquidity score
   */
  calculateScore(
    bids: Array<{ price: number; quantity: number }>,
    asks: Array<{ price: number; quantity: number }>,
  ): LiquidityScore {
    const depth = this.calculateDepth(bids, asks);
    const spread = this.calculateSpread(bids, asks);
    const concentration = this.calculateConcentration(bids, asks);

    // Weighted scoring (depth 40%, spread 40%, distribution 20%)
    const depthScore = Math.min((depth / 100000) * 100, 100); // Normalize to 100k
    const spreadScore = Math.max(100 - spread * 100, 0);
    const concentrationScore = (1 - concentration) * 100;

    const overall = (
      depthScore * 0.4 +
      spreadScore * 0.4 +
      concentrationScore * 0.2
    );

    return {
      overall: Math.round(overall * 100) / 100,
      depth,
      spread,
      concentration,
      resilience: 0, // Would need historical data
    };
  }

  /**
   * Calculate total depth at top 10 levels
   */
  private calculateDepth(
    bids: Array<{ price: number; quantity: number }>,
    asks: Array<{ price: number; quantity: number }>,
  ): number {
    const topBids = bids.slice(0, 10);
    const topAsks = asks.slice(0, 10);

    const bidDepth = topBids.reduce((sum, level) => sum + level.quantity, 0);
    const askDepth = topAsks.reduce((sum, level) => sum + level.quantity, 0);

    return (bidDepth + askDepth) / 2;
  }

  /**
   * Calculate bid-ask spread
   */
  private calculateSpread(
    bids: Array<{ price: number; quantity: number }>,
    asks: Array<{ price: number; quantity: number }>,
  ): number {
    if (bids.length === 0 || asks.length === 0) return 100;

    const bestBid = Math.max(...bids.map(b => b.price));
    const bestAsk = Math.min(...asks.map(a => a.price));

    return ((bestAsk - bestBid) / bestBid);
  }

  /**
   * Calculate concentration (Gini coefficient)
   * 0 = perfectly distributed, 1 = concentrated
   */
  private calculateConcentration(
    bids: Array<{ price: number; quantity: number }>,
    asks: Array<{ price: number; quantity: number }>,
  ): number {
    const allLevels = [...bids, ...asks];
    const quantities = allLevels.map(l => l.quantity).sort((a, b) => a - b);
    
    if (quantities.length === 0) return 1;

    const n = quantities.length;
    const totalQuantity = quantities.reduce((sum, q) => sum + q, 0);
    
    if (totalQuantity === 0) return 1;

    let gini = 0;
    for (let i = 0; i < n; i++) {
      gini += (2 * (i + 1) - n - 1) * quantities[i];
    }

    return gini / (n * totalQuantity);
  }
}
```

#### 4.3 Arbitrage Detector (src/modules/liquidity/algorithms/arbitrage-detector.ts)
```typescript
import { Injectable } from '@nestjs/common';

export interface ArbitrageOpportunity {
  buyMarket: string;
  sellMarket: string;
  buyPrice: number;
  sellPrice: number;
  spread: number;
  spreadPercent: number;
  maxProfitableSize: number;
  estimatedProfit: number;
  token: string;
}

@Injectable()
export class ArbitrageDetector {
  /**
   * Find arbitrage opportunities across markets
   */
  findOpportunities(
    markets: Array<{
      marketId: string;
      token: string;
      bestBid: number;
      bestAsk: number;
      bidQuantity: number;
      askQuantity: number;
    }>,
    minSpreadPercent: number = 0.5,
  ): ArbitrageOpportunity[] {
    const opportunities: ArbitrageOpportunity[] = [];

    // Compare all market pairs for the same token
    const tokenGroups = this.groupByToken(markets);

    for (const [token, tokenMarkets] of Object.entries(tokenGroups)) {
      for (let i = 0; i < tokenMarkets.length; i++) {
        for (let j = i + 1; j < tokenMarkets.length; j++) {
          const market1 = tokenMarkets[i];
          const market2 = tokenMarkets[j];

          // Check if buying on market1 and selling on market2 is profitable
          const opportunity1 = this.checkArbitrage(
            market1,
            market2,
            token,
            minSpreadPercent,
          );
          if (opportunity1) opportunities.push(opportunity1);

          // Check reverse direction
          const opportunity2 = this.checkArbitrage(
            market2,
            market1,
            token,
            minSpreadPercent,
          );
          if (opportunity2) opportunities.push(opportunity2);
        }
      }
    }

    // Sort by estimated profit
    return opportunities.sort((a, b) => b.estimatedProfit - a.estimatedProfit);
  }

  /**
   * Check if arbitrage exists between two markets
   */
  private checkArbitrage(
    buyMarket: any,
    sellMarket: any,
    token: string,
    minSpreadPercent: number,
  ): ArbitrageOpportunity | null {
    const buyPrice = buyMarket.bestAsk;
    const sellPrice = sellMarket.bestBid;

    if (buyPrice >= sellPrice) return null;

    const spread = sellPrice - buyPrice;
    const spreadPercent = (spread / buyPrice) * 100;

    if (spreadPercent < minSpreadPercent) return null;

    // Max size limited by available liquidity
    const maxSize = Math.min(buyMarket.askQuantity, sellMarket.bidQuantity);

    // Estimate profit (assuming 0.1% fees on each side)
    const feePercent = 0.002; // 0.2% total
    const profitPerUnit = spread - (buyPrice + sellPrice) * feePercent;
    const estimatedProfit = profitPerUnit * maxSize;

    if (estimatedProfit <= 0) return null;

    return {
      buyMarket: buyMarket.marketId,
      sellMarket: sellMarket.marketId,
      buyPrice,
      sellPrice,
      spread,
      spreadPercent,
      maxProfitableSize: maxSize,
      estimatedProfit,
      token,
    };
  }

  /**
   * Group markets by token
   */
  private groupByToken(markets: any[]): Record<string, any[]> {
    return markets.reduce((groups, market) => {
      const token = market.token;
      if (!groups[token]) groups[token] = [];
      groups[token].push(market);
      return groups;
    }, {});
  }
}
```

#### 4.4 Route Optimizer (src/modules/liquidity/algorithms/route-optimizer.ts)
```typescript
import { Injectable } from '@nestjs/common';
import { SlippageCalculator } from './slippage-calculator';

export interface OptimalRoute {
  markets: Array<{
    marketId: string;
    amount: number;
    price: number;
    slippage: number;
  }>;
  totalAmount: number;
  averagePrice: number;
  totalSlippage: number;
  savings: number; // vs single market execution
}

@Injectable()
export class RouteOptimizer {
  constructor(private slippageCalculator: SlippageCalculator) {}

  /**
   * Find optimal execution route across multiple markets
   */
  findOptimalRoute(
    token: string,
    totalAmount: number,
    side: 'buy' | 'sell',
    markets: Array<{
      marketId: string;
      orderbook: Array<{ price: number; quantity: number }>;
    }>,
  ): OptimalRoute {
    // Calculate slippage for each market at different sizes
    const marketAnalysis = markets.map(market => {
      const maxLiquidity = market.orderbook.reduce(
        (sum, level) => sum + level.quantity,
        0,
      );

      return {
        marketId: market.marketId,
        orderbook: market.orderbook,
        maxLiquidity,
        basePrice: market.orderbook[0]?.price || 0,
      };
    });

    // Sort markets by best price
    const sortedMarkets = marketAnalysis.sort((a, b) =>
      side === 'buy' ? a.basePrice - b.basePrice : b.basePrice - a.basePrice,
    );

    // Greedy allocation: fill from best prices first
    let remainingAmount = totalAmount;
    const allocations: Array<{
      marketId: string;
      amount: number;
      price: number;
      slippage: number;
    }> = [];

    for (const market of sortedMarkets) {
      if (remainingAmount <= 0) break;

      const amountToFill = Math.min(remainingAmount, market.maxLiquidity);
      
      try {
        const result = this.slippageCalculator.calculateSlippage(
          market.orderbook,
          amountToFill,
          side,
        );

        allocations.push({
          marketId: market.marketId,
          amount: amountToFill,
          price: result.actualPrice,
          slippage: result.slippagePercent,
        });

        remainingAmount -= amountToFill;
      } catch (error) {
        // Skip market if insufficient liquidity
        continue;
      }
    }

    if (remainingAmount > 0) {
      throw new Error(
        `Insufficient liquidity across all markets. Missing ${remainingAmount}`,
      );
    }

    // Calculate metrics
    const totalCost = allocations.reduce(
      (sum, a) => sum + a.amount * a.price,
      0,
    );
    const averagePrice = totalCost / totalAmount;
    const weightedSlippage = allocations.reduce(
      (sum, a) => sum + (a.slippage * a.amount) / totalAmount,
      0,
    );

    // Calculate savings vs single best market
    const bestMarket = sortedMarkets[0];
    let singleMarketCost = 0;
    try {
      const singleResult = this.slippageCalculator.calculateSlippage(
        bestMarket.orderbook,
        totalAmount,
        side,
      );
      singleMarketCost = singleResult.totalCost;
    } catch {
      singleMarketCost = totalCost; // If can't fill in single market
    }

    const savings = singleMarketCost - totalCost;

    return {
      markets: allocations,
      totalAmount,
      averagePrice,
      totalSlippage: weightedSlippage,
      savings: Math.max(savings, 0),
    };
  }
}
```

---

### PHASE 5: API Endpoints & DTOs

#### 5.1 DTOs (Data Transfer Objects)

**src/modules/liquidity/dto/best-route.dto.ts**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, Min } from 'class-validator';

export class BestRouteQueryDto {
  @ApiProperty({
    description: 'Token symbol or address',
    example: 'INJ',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Order amount',
    example: 1000,
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Order side',
    enum: ['buy', 'sell'],
    example: 'buy',
  })
  @IsEnum(['buy', 'sell'])
  side: 'buy' | 'sell';
}

export class BestRouteResponseDto {
  @ApiProperty()
  markets: Array<{
    marketId: string;
    amount: number;
    price: number;
    slippage: number;
  }>;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  averagePrice: number;

  @ApiProperty()
  totalSlippage: number;

  @ApiProperty()
  savings: number;

  @ApiProperty()
  timestamp: Date;
}
```

**src/modules/liquidity/dto/market-analysis.dto.ts**
```typescript
import { ApiProperty } from '@nestjs/swagger';

export class MarketAnalysisResponseDto {
  @ApiProperty()
  marketId: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  liquidityScore: {
    overall: number;
    depth: number;
    spread: number;
    concentration: number;
    resilience: number;
  };

  @ApiProperty()
  orderbook: {
    bids: Array<{ price: number; quantity: number }>;
    asks: Array<{ price: number; quantity: number }>;
  };

  @ApiProperty()
  slippageEstimates: Array<{
    orderSize: number;
    slippagePercent: number;
    priceImpact: number;
  }>;

  @ApiProperty()
  timestamp: Date;
}
```

**src/modules/liquidity/dto/arbitrage.dto.ts**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class ArbitrageQueryDto {
  @ApiProperty({
    description: 'Minimum spread percentage to filter opportunities',
    example: 0.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minSpread?: number;
}

export class ArbitrageOpportunityDto {
  @ApiProperty()
  buyMarket: string;

  @ApiProperty()
  sellMarket: string;

  @ApiProperty()
  buyPrice: number;

  @ApiProperty()
  sellPrice: number;

  @ApiProperty()
  spread: number;

  @ApiProperty()
  spreadPercent: number;

  @ApiProperty()
  maxProfitableSize: number;

  @ApiProperty()
  estimatedProfit: number;

  @ApiProperty()
  token: string;
}

export class ArbitrageResponseDto {
  @ApiProperty({ type: [ArbitrageOpportunityDto] })
  opportunities: ArbitrageOpportunityDto[];

  @ApiProperty()
  count: number;

  @ApiProperty()
  timestamp: Date;
}
```

#### 5.2 Liquidity Controller (src/modules/liquidity/liquidity.controller.ts)
```typescript
import {
  Controller,
  Get,
  Query,
  Param,
  HttpStatus,
  Logger,
  UseInterceptors,
  CacheInterceptor,
  CacheTTL,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { LiquidityService } from './liquidity.service';
import {
  BestRouteQueryDto,
  BestRouteResponseDto,
} from './dto/best-route.dto';
import {
  ArbitrageQueryDto,
  ArbitrageResponseDto,
} from './dto/arbitrage.dto';
import { MarketAnalysisResponseDto } from './dto/market-analysis.dto';

@ApiTags('liquidity')
@Controller('liquidity')
@UseInterceptors(CacheInterceptor)
export class LiquidityController {
  private readonly logger = new Logger(LiquidityController.name);

  constructor(private readonly liquidityService: LiquidityService) {}

  @Get('token/:token/best-route')
  @CacheTTL(5) // Cache for 5 seconds
  @ApiOperation({
    summary: 'Get optimal execution route for a token',
    description:
      'Returns the best way to split an order across multiple markets to minimize slippage',
  })
  @ApiParam({ name: 'token', example: 'INJ' })
  @ApiQuery({ name: 'amount', example: 1000 })
  @ApiQuery({ name: 'side', enum: ['buy', 'sell'] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Optimal route calculated successfully',
    type: BestRouteResponseDto,
  })
  async getBestRoute(
    @Param('token') token: string,
    @Query() query: BestRouteQueryDto,
  ): Promise<BestRouteResponseDto> {
    this.logger.log(`Getting best route for ${query.amount} ${token} (${query.side})`);
    return this.liquidityService.findBestRoute(token, query.amount, query.side);
  }

  @Get('market/:marketId/analysis')
  @CacheTTL(10)
  @ApiOperation({
    summary: 'Get comprehensive liquidity analysis for a market',
    description:
      'Returns liquidity score, orderbook depth, slippage estimates, and market health metrics',
  })
  @ApiParam({ name: 'marketId', example: '0x...' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Market analysis retrieved successfully',
    type: MarketAnalysisResponseDto,
  })
  async getMarketAnalysis(
    @Param('marketId') marketId: string,
  ): Promise<MarketAnalysisResponseDto> {
    this.logger.log(`Analyzing market ${marketId}`);
    return this.liquidityService.analyzeMarket(marketId);
  }

  @Get('opportunities/arbitrage')
  @CacheTTL(3)
  @ApiOperation({
    summary: 'Find arbitrage opportunities across markets',
    description:
      'Scans all markets to find price discrepancies that can be exploited for profit',
  })
  @ApiQuery({
    name: 'minSpread',
    required: false,
    example: 0.5,
    description: 'Minimum spread percentage (default: 0.5%)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Arbitrage opportunities found',
    type: ArbitrageResponseDto,
  })
  async getArbitrageOpportunities(
    @Query() query: ArbitrageQueryDto,
  ): Promise<ArbitrageResponseDto> {
    this.logger.log(`Scanning for arbitrage opportunities (min spread: ${query.minSpread || 0.5}%)`);
    return this.liquidityService.findArbitrageOpportunities(query.minSpread);
  }

  @Get('markets/comparison')
  @CacheTTL(15)
  @ApiOperation({
    summary: 'Compare liquidity across multiple tokens',
    description: 'Returns comparative liquidity metrics for specified tokens',
  })
  @ApiQuery({
    name: 'tokens',
    example: 'INJ,USDT,ETH',
    description: 'Comma-separated list of tokens',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Market comparison retrieved successfully',
  })
  async compareMarkets(@Query('tokens') tokens: string) {
    const tokenList = tokens.split(',').map(t => t.trim());
    this.logger.log(`Comparing markets for: ${tokenList.join(', ')}`);
    return this.liquidityService.compareMarkets(tokenList);
  }
}
```

#### 5.3 Liquidity Service (src/modules/liquidity/liquidity.service.ts)
```typescript
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectiveService } from '../injective/injective.service';
import { SlippageCalculator } from './algorithms/slippage-calculator';
import { LiquidityScorer } from './algorithms/liquidity-scorer';
import { ArbitrageDetector } from './algorithms/arbitrage-detector';
import { RouteOptimizer } from './algorithms/route-optimizer';

@Injectable()
export class LiquidityService {
  private readonly logger = new Logger(LiquidityService.name);

  constructor(
    private injectiveService: InjectiveService,
    private slippageCalculator: SlippageCalculator,
    private liquidityScorer: LiquidityScorer,
    private arbitrageDetector: ArbitrageDetector,
    private routeOptimizer: RouteOptimizer,
  ) {}

  /**
   * Find best execution route across markets
   */
  async findBestRoute(token: string, amount: number, side: 'buy' | 'sell') {
    // Get all markets for this token
    const allMarkets = await this.injectiveService.getSpotMarkets();
    const tokenMarkets = allMarkets.filter(m =>
      m.baseToken.symbol.toUpperCase() === token.toUpperCase() ||
      m.quoteToken.symbol.toUpperCase() === token.toUpperCase()
    );

    if (tokenMarkets.length === 0) {
      throw new NotFoundException(`No markets found for token ${token}`);
    }

    // Fetch orderbooks for all markets
    const marketData = await Promise.all(
      tokenMarkets.map(async market => {
        const orderbook = await this.injectiveService.getOrderbook(market.marketId);
        return {
          marketId: market.marketId,
          orderbook: this.formatOrderbook(orderbook, side),
        };
      }),
    );

    // Find optimal route
    const route = this.routeOptimizer.findOptimalRoute(
      token,
      amount,
      side,
      marketData,
    );

    return {
      ...route,
      timestamp: new Date(),
    };
  }

  /**
   * Analyze single market liquidity
   */
  async analyzeMarket(marketId: string) {
    const orderbook = await this.injectiveService.getOrderbook(marketId);
    const market = await this.injectiveService.getMarketSummary(marketId);

    const bids = orderbook.buys.map(b => ({
      price: parseFloat(b.price),
      quantity: parseFloat(b.quantity),
    }));

    const asks = orderbook.sells.map(s => ({
      price: parseFloat(s.price),
      quantity: parseFloat(s.quantity),
    }));

    // Calculate liquidity score
    const liquidityScore = this.liquidityScorer.calculateScore(bids, asks);

    // Calculate slippage at different sizes
    const slippageLadder = this.slippageCalculator.calculateSlippageLadder(
      asks,
      'buy',
      [100, 500, 1000, 5000, 10000],
    );

    return {
      marketId,
      token: market.baseToken.symbol,
      liquidityScore,
      orderbook: {
        bids: bids.slice(0, 10),
        asks: asks.slice(0, 10),
      },
      slippageEstimates: slippageLadder
        .filter(s => s.slippage !== null)
        .map(s => ({
          orderSize: s.orderSize,
          slippagePercent: s.slippage.slippagePercent,
          priceImpact: s.slippage.priceImpact,
        })),
      timestamp: new Date(),
    };
  }

  /**
   * Find arbitrage opportunities
   */
  async findArbitrageOpportunities(minSpread: number = 0.5) {
    const allMarkets = await this.injectiveService.getSpotMarkets();

    // Get best bid/ask for each market
    const marketData = await Promise.all(
      allMarkets.map(async market => {
        try {
          const orderbook = await this.injectiveService.getOrderbook(market.marketId);
          
          return {
            marketId: market.marketId,
            token: market.baseToken.symbol,
            bestBid: parseFloat(orderbook.buys[0]?.price || '0'),
            bestAsk: parseFloat(orderbook.sells[0]?.price || '0'),
            bidQuantity: parseFloat(orderbook.buys[0]?.quantity || '0'),
            askQuantity: parseFloat(orderbook.sells[0]?.quantity || '0'),
          };
        } catch (error) {
          this.logger.warn(`Failed to fetch orderbook for ${market.marketId}`);
          return null;
        }
      }),
    );

    const validMarkets = marketData.filter(m => m !== null && m.bestBid > 0 && m.bestAsk > 0);

    const opportunities = this.arbitrageDetector.findOpportunities(
      validMarkets,
      minSpread,
    );

    return {
      opportunities,
      count: opportunities.length,
      timestamp: new Date(),
    };
  }

  /**
   * Compare liquidity across tokens
   */
  async compareMarkets(tokens: string[]) {
    const results = await Promise.all(
      tokens.map(async token => {
        try {
          const allMarkets = await this.injectiveService.getSpotMarkets();
          const tokenMarkets = allMarkets.filter(m =>
            m.baseToken.symbol.toUpperCase() === token.toUpperCase()
          );

          if (tokenMarkets.length === 0) {
            return { token, error: 'No markets found' };
          }

          // Get total liquidity across all markets
          const liquidityData = await Promise.all(
            tokenMarkets.map(async m => {
              const analysis = await this.analyzeMarket(m.marketId);
              return analysis.liquidityScore;
            }),
          );

          const avgScore = liquidityData.reduce((sum, s) => sum + s.overall, 0) / liquidityData.length;

          return {
            token,
            marketCount: tokenMarkets.length,
            averageLiquidityScore: avgScore,
            markets: tokenMarkets.map((m, i) => ({
              marketId: m.marketId,
              score: liquidityData[i].overall,
            })),
          };
        } catch (error) {
          return { token, error: error.message };
        }
      }),
    );

    return {
      comparison: results,
      timestamp: new Date(),
    };
  }

  /**
   * Helper: Format orderbook for calculations
   */
  private formatOrderbook(orderbook: any, side: 'buy' | 'sell') {
    const levels = side === 'buy' ? orderbook.sells : orderbook.buys;
    return levels.map(level => ({
      price: parseFloat(level.price),
      quantity: parseFloat(level.quantity),
    }));
  }
}
```

#### 5.4 Liquidity Module (src/modules/liquidity/liquidity.module.ts)
```typescript
import { Module } from '@nestjs/common';
import { LiquidityController } from './liquidity.controller';
import { LiquidityService } from './liquidity.service';
import { SlippageCalculator } from './algorithms/slippage-calculator';
import { LiquidityScorer } from './algorithms/liquidity-scorer';
import { ArbitrageDetector } from './algorithms/arbitrage-detector';
import { RouteOptimizer } from './algorithms/route-optimizer';
import { InjectiveModule } from '../injective/injective.module';

@Module({
  imports: [InjectiveModule],
  controllers: [LiquidityController],
  providers: [
    LiquidityService,
    SlippageCalculator,
    LiquidityScorer,
    ArbitrageDetector,
    RouteOptimizer,
  ],
  exports: [LiquidityService],
})
export class LiquidityModule {}
```

---

### PHASE 6: Background Jobs for Data Updates

#### 6.1 Jobs Module Setup

**src/modules/jobs/jobs.module.ts**
```typescript
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { LiquidityUpdaterProcessor } from './liquidity-updater.processor';
import { InjectiveModule } from '../injective/injective.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'liquidity-updates',
    }),
    InjectiveModule,
  ],
  providers: [LiquidityUpdaterProcessor],
})
export class JobsModule {}
```

**src/modules/jobs/liquidity-updater.processor.ts**
```typescript
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InjectiveService } from '../injective/injective.service';

@Processor('liquidity-updates')
export class LiquidityUpdaterProcessor {
  private readonly logger = new Logger(LiquidityUpdaterProcessor.name);

  constructor(private injectiveService: InjectiveService) {}

  @Process('update-market-data')
  async updateMarketData(job: Job) {
    this.logger.log('Starting market data update...');

    try {
      const markets = await this.injectiveService.getSpotMarkets();
      this.logger.log(`Fetched ${markets.length} markets`);

      // Process market data (store in database, update cache, etc.)
      // This is where you'd save to TimescaleDB

      return { success: true, marketsProcessed: markets.length };
    } catch (error) {
      this.logger.error(`Market data update failed: ${error.message}`);
      throw error;
    }
  }
}
```

---

### PHASE 7: Webhook System

#### 6.2 Webhook Module

**src/modules/webhooks/dto/webhook-subscription.dto.ts**
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsEnum, IsOptional, IsNumber } from 'class-validator';

export class CreateWebhookDto {
  @ApiProperty({
    description: 'Webhook callback URL',
    example: 'https://your-app.com/webhooks/liquidity',
  })
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'Event type to subscribe to',
    enum: ['arbitrage', 'liquidity_change', 'large_order'],
  })
  @IsEnum(['arbitrage', 'liquidity_change', 'large_order'])
  eventType: string;

  @ApiProperty({
    description: 'Optional filter (e.g., specific token or market)',
    required: false,
  })
  @IsOptional()
  @IsString()
  filter?: string;

  @ApiProperty({
    description: 'Minimum threshold for alerts (e.g., min spread % for arbitrage)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  threshold?: number;
}
```

**src/modules/webhooks/webhook.controller.ts**
```typescript
import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { CreateWebhookDto } from './dto/webhook-subscription.dto';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post('subscribe')
  @ApiOperation({
    summary: 'Subscribe to webhook notifications',
    description: 'Register a webhook URL to receive real-time liquidity alerts',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Webhook subscription created',
  })
  async subscribe(@Body() dto: CreateWebhookDto) {
    return this.webhookService.createSubscription(dto);
  }

  @Delete(':subscriptionId')
  @ApiOperation({ summary: 'Unsubscribe from webhook notifications' })
  async unsubscribe(@Param('subscriptionId') id: string) {
    return this.webhookService.deleteSubscription(id);
  }
}
```

**src/modules/webhooks/webhook.service.ts**
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { CreateWebhookDto } from './dto/webhook-subscription.dto';
import axios from 'axios';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private subscriptions = new Map<string, CreateWebhookDto>();

  createSubscription(dto: CreateWebhookDto) {
    const id = this.generateId();
    this.subscriptions.set(id, dto);

    this.logger.log(`Webhook subscription created: ${id} for ${dto.eventType}`);

    return {
      subscriptionId: id,
      ...dto,
    };
  }

  deleteSubscription(id: string) {
    const deleted = this.subscriptions.delete(id);
    return { success: deleted };
  }

  async triggerWebhook(eventType: string, data: any) {
    const relevantSubs = Array.from(this.subscriptions.values()).filter(
      sub => sub.eventType === eventType,
    );

    for (const sub of relevantSubs) {
      try {
        await axios.post(sub.url, {
          event: eventType,
          data,
          timestamp: new Date(),
        }, {
          timeout: 5000,
        });

        this.logger.log(`Webhook triggered: ${sub.url}`);
      } catch (error) {
        this.logger.error(`Webhook failed for ${sub.url}: ${error.message}`);
      }
    }
  }

  private generateId(): string {
    return `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

**src/modules/webhooks/webhook.module.ts**
```typescript
import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
```

---

### PHASE 8: Health Check & Monitoring

**src/health/health.controller.ts**
```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { InjectiveService } from '../modules/injective/injective.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private injectiveService: InjectiveService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check API health status' })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      async () => {
        try {
          await this.injectiveService.getSpotMarkets();
          return { injective: { status: 'up' } };
        } catch {
          return { injective: { status: 'down' } };
        }
      },
    ]);
  }
}
```

**src/health/health.module.ts**
```typescript
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { InjectiveModule } from '../modules/injective/injective.module';

@Module({
  imports: [TerminusModule, InjectiveModule],
  controllers: [HealthController],
})
export class HealthModule {}
```

---

### PHASE 9: Docker & Deployment

#### 9.1 Dockerfile (docker/Dockerfile)
```dockerfile
# Multi-stage build for optimized image

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); });"

# Run application
CMD ["node", "dist/main"]
```

#### 9.2 Docker Compose (docker/docker-compose.yml)
```yaml
version: '3.8'

services:
  api:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - REDIS_HOST=redis
      - DATABASE_HOST=timescaledb
      - BULL_REDIS_HOST=redis
    depends_on:
      - redis
      - timescaledb
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  timescaledb:
    image: timescale/timescaledb:latest-pg15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=liquidity_intelligence
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - timescale_data:/var/lib/postgresql/data
    restart: unless-stopped

  bull-board:
    image: deadly0/bull-board
    ports:
      - "3001:3000"
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - redis
    restart: unless-stopped

volumes:
  redis_data:
  timescale_data:
```

#### 9.3 .dockerignore
```
node_modules
dist
.env
.git
.github
*.log
coverage
.vscode
.idea
README.md
docker-compose.yml
```

---

### PHASE 10: Comprehensive Documentation

#### 10.1 README.md (Root)
```markdown
# 🚀 Cross-DEX Liquidity Intelligence API

> Professional API service providing intelligent liquidity analysis across all Injective DEX markets.

Built for the **Ninja API Forge** hackathon on Injective blockchain.

## 🎯 What This API Does

This API helps developers build better trading applications by providing:

- **Optimal Execution Routes** - Split large orders across multiple markets to minimize slippage
- **Real-time Arbitrage Detection** - Find profitable price discrepancies across DEXes
- **Comprehensive Liquidity Metrics** - Get detailed market health scores and depth analysis
- **Smart Order Routing** - Automatically route trades for best execution
- **Webhook Alerts** - Get notified of arbitrage opportunities and liquidity changes

## 🏗️ Architecture

```
┌─────────────────┐
│   REST API      │
│   (NestJS)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │  Cache  │
    │ (Redis) │
    └─────────┘
         │
┌────────┴─────────┐
│  Injective SDK   │
│  (Real-time WS)  │
└──────────────────┘
         │
┌────────┴─────────┐
│  TimescaleDB     │
│  (Time-series)   │
└──────────────────┘
```

### Tech Stack

- **Backend:** TypeScript, NestJS 10
- **Blockchain:** Injective SDK (@injectivelabs/sdk-ts)
- **Cache:** Redis 7
- **Database:** TimescaleDB (PostgreSQL)
- **Queue:** Bull
- **Documentation:** OpenAPI/Swagger

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm
- Docker & Docker Compose

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/liquidity-intelligence-api.git
cd liquidity-intelligence-api
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start with Docker Compose (Recommended)**
```bash
cd docker
docker-compose up -d
```

The API will be available at:
- **API:** http://localhost:3000/api/v1
- **Documentation:** http://localhost:3000/docs
- **Health Check:** http://localhost:3000/api/v1/health

### Development Setup

```bash
# Start Redis & TimescaleDB
docker-compose up redis timescaledb -d

# Run in development mode
pnpm run start:dev

# Run tests
pnpm run test

# Build for production
pnpm run build
```

## 📚 API Documentation

### Core Endpoints

#### 1. Get Optimal Execution Route

Find the best way to split an order across markets.

```http
GET /api/v1/liquidity/token/{token}/best-route?amount=1000&side=buy
```

**Example Request:**
```bash
curl http://localhost:3000/api/v1/liquidity/token/INJ/best-route?amount=1000&side=buy
```

**Example Response:**
```json
{
  "markets": [
    {
      "marketId": "0x...",
      "amount": 700,
      "price": 15.23,
      "slippage": 0.12
    },
    {
      "marketId": "0x...",
      "amount": 300,
      "price": 15.28,
      "slippage": 0.08
    }
  ],
  "totalAmount": 1000,
  "averagePrice": 15.25,
  "totalSlippage": 0.10,
  "savings": 24.50,
  "timestamp": "2026-02-14T10:30:00Z"
}
```

#### 2. Market Liquidity Analysis

Get comprehensive liquidity metrics for a market.

```http
GET /api/v1/liquidity/market/{marketId}/analysis
```

**Example Response:**
```json
{
  "marketId": "0x...",
  "token": "INJ",
  "liquidityScore": {
    "overall": 85.4,
    "depth": 125000,
    "spread": 0.0015,
    "concentration": 0.23,
    "resilience": 0
  },
  "orderbook": {
    "bids": [
      { "price": 15.20, "quantity": 1000 },
      { "price": 15.19, "quantity": 1500 }
    ],
    "asks": [
      { "price": 15.21, "quantity": 1200 },
      { "price": 15.22, "quantity": 1100 }
    ]
  },
  "slippageEstimates": [
    { "orderSize": 100, "slippagePercent": 0.05, "priceImpact": 0.05 },
    { "orderSize": 500, "slippagePercent": 0.12, "priceImpact": 0.12 },
    { "orderSize": 1000, "slippagePercent": 0.25, "priceImpact": 0.25 }
  ],
  "timestamp": "2026-02-14T10:30:00Z"
}
```

#### 3. Arbitrage Opportunities

Find profitable arbitrage across markets.

```http
GET /api/v1/liquidity/opportunities/arbitrage?minSpread=0.5
```

**Example Response:**
```json
{
  "opportunities": [
    {
      "buyMarket": "0x...",
      "sellMarket": "0x...",
      "buyPrice": 15.20,
      "sellPrice": 15.35,
      "spread": 0.15,
      "spreadPercent": 0.99,
      "maxProfitableSize": 500,
      "estimatedProfit": 72.50,
      "token": "INJ"
    }
  ],
  "count": 1,
  "timestamp": "2026-02-14T10:30:00Z"
}
```

#### 4. Compare Markets

Compare liquidity across multiple tokens.

```http
GET /api/v1/liquidity/markets/comparison?tokens=INJ,USDT,ETH
```

#### 5. Webhook Subscriptions

Subscribe to real-time alerts.

```http
POST /api/v1/webhooks/subscribe
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "eventType": "arbitrage",
  "threshold": 0.5
}
```

### Interactive Documentation

Visit http://localhost:3000/docs for full Swagger documentation with:
- All endpoints
- Request/response schemas
- Try-it-now functionality
- Authentication details

## 🔧 Configuration

Key environment variables:

```bash
# Application
PORT=3000
NODE_ENV=development

# Injective
INJECTIVE_NETWORK=testnet
INJECTIVE_CHAIN_ID=injective-888

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=liquidity_intelligence

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

See `.env.example` for full configuration options.

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## 📊 Performance

- **Response Time:** <100ms (cached), <1s (computed)
- **Rate Limits:** 100 requests/minute (configurable)
- **Cache TTL:** 5-15 seconds (endpoint-specific)
- **WebSocket:** Real-time orderbook updates

## 🛠️ Development

### Project Structure

```
src/
├── modules/
│   ├── liquidity/          # Core liquidity logic
│   │   ├── algorithms/     # Calculation engines
│   │   ├── dto/           # Data transfer objects
│   │   └── entities/      # Database models
│   ├── injective/         # Injective SDK integration
│   ├── webhooks/          # Webhook system
│   └── jobs/              # Background tasks
├── config/                # Configuration
├── common/                # Shared utilities
└── health/                # Health checks
```

### Adding New Endpoints

1. Create DTOs in `dto/`
2. Implement business logic in service
3. Add controller endpoint
4. Update Swagger annotations
5. Write tests

## 🤝 Contributing

This project was built for Ninja API Forge hackathon. Contributions welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file

## 🏆 Hackathon Submission

**Event:** Ninja API Forge  
**Category:** Developer APIs on Injective  
**Built by:** [Your Name]  
**Date:** February 2026

### Why This API Matters

Trading applications need liquidity intelligence to:
- Minimize slippage on large orders
- Find arbitrage opportunities
- Route orders optimally
- Monitor market health

This API provides all of that in simple, well-documented endpoints.

## 📞 Contact

- Twitter: [@yourusername](https://twitter.com/yourusername)
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Injective Labs for the amazing blockchain infrastructure
- Ninja Labs for organizing the hackathon
- NestJS community for the excellent framework

---

Made with ❤️ for Injective ecosystem
```

---

## ⚡ EXECUTION CHECKLIST

### Day 1-2: Foundation
- [ ] Initialize NestJS project
- [ ] Install all dependencies
- [ ] Configure TypeScript strictly
- [ ] Set up environment configuration
- [ ] Create project structure

### Day 3-4: Injective Integration
- [ ] Implement Injective service
- [ ] Set up WebSocket connections
- [ ] Test data fetching from testnet
- [ ] Verify orderbook streaming works

### Day 5-7: Core Algorithms
- [ ] Implement SlippageCalculator with tests
- [ ] Implement LiquidityScorer with tests
- [ ] Implement ArbitrageDetector with tests
- [ ] Implement RouteOptimizer with tests

### Day 8-10: API Layer
- [ ] Create all DTOs with validation
- [ ] Implement LiquidityController
- [ ] Implement LiquidityService
- [ ] Add Swagger documentation
- [ ] Test all endpoints manually

### Day 11-12: Advanced Features
- [ ] Set up Redis caching
- [ ] Implement rate limiting
- [ ] Create webhook system
- [ ] Set up Bull queues
- [ ] Add health checks

### Day 13: Docker & Deployment
- [ ] Create Dockerfile
- [ ] Create docker-compose.yml
- [ ] Test Docker deployment locally
- [ ] Verify all services work together

### Day 14: Documentation & Submission
- [ ] Write comprehensive README
- [ ] Add API usage examples
- [ ] Create API.md with detailed examples
- [ ] Record demo video (optional)
- [ ] Test everything end-to-end
- [ ] Submit via Typeform
- [ ] Post on Twitter/X

---

## 🎯 SUCCESS METRICS

Your API will be judged on:

1. **API Design Quality (30%)** - Clean, intuitive endpoints
2. **Developer Usefulness (30%)** - Solves real problems
3. **Code Quality (20%)** - Professional, maintainable code
4. **Documentation (20%)** - Clear README and Swagger docs

This prompt ensures you build a **production-quality API** that will impress the judges!

---

## 🚨 CRITICAL REQUIREMENTS

1. **ALL code must use TypeScript with strict typing**
2. **Every endpoint must have Swagger documentation**
3. **All DTOs must use class-validator**
4. **Include error handling for ALL edge cases**
5. **Cache responses appropriately**
6. **Test with REAL Injective testnet data**
7. **Docker setup must work with `docker-compose up`**
8. **README must have working examples**

Good luck building! 🚀
```
