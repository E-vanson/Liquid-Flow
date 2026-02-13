# Architecture Documentation

## System Overview

The Liquidity Intelligence API is built as a modular, scalable microservices-style application using NestJS.

## Core Components

### 1. API Layer (NestJS)

The main entry point handles:
- HTTP request routing
- Request validation
- Authentication (optional)
- Rate limiting
- Swagger documentation

### 2. Module Structure

```
┌─────────────────────────────────────┐
│           API Gateway               │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───┴───┐           ┌────┴────┐
│Modules│           │  Health  │
└───┬───┘           └──────────┘
    │
    ├── Liquidity Module
    │   ├── Controller
    │   ├── Service
    │   └── Algorithms
    │       ├── SlippageCalculator
    │       ├── LiquidityScorer
    │       ├── ArbitrageDetector
    │       └── RouteOptimizer
    │
    ├── Injective Module
    │   ├── Service (SDK Wrapper)
    │   └── WebSocketService
    │
    ├── Webhooks Module
    │   ├── Controller
    │   └── Service
    │
    └── Jobs Module
        └── Processors
```

### 3. Data Flow

#### Synchronous Requests (REST API)

```
Client → API → Controller → Service → Algorithm → Injective SDK → Response
                ↓
            Cache (Redis)
```

#### Background Jobs (Bull Queue)

```
Trigger → Job Queue → Processor → Database → Cache Update
                                     ↓
                              Webhook Notification
```

### 4. Caching Strategy

- **Redis** for all API responses
- **TTL** varies by endpoint:
  - Best Route: 5 seconds
  - Market Analysis: 10 seconds
  - Arbitrage: 3 seconds
  - Market Comparison: 15 seconds

### 5. Database Schema

#### TimescaleDB Tables

**liquidity_snapshots**
- id: UUID
- market_id: VARCHAR
- token: VARCHAR
- bid_depth: DECIMAL
- ask_depth: DECIMAL
- spread: DECIMAL
- timestamp: TIMESTAMP
- created_at: TIMESTAMP

**market_metrics**
- id: UUID
- market_id: VARCHAR
- liquidity_score: DECIMAL
- volume_24h: DECIMAL
- trades_24h: INTEGER
- timestamp: TIMESTAMP

### 6. External Integrations

#### Injective Blockchain

- **SDK:** @injectivelabs/sdk-ts
- **Endpoints:**
  - Indexer gRPC for market data
  - REST API for historical data
  - WebSocket for real-time streams

#### Redis

- **Cache:** Response caching
- **Rate Limiting:** Token bucket algorithm
- **Bull Queue:** Job queue backend

### 7. Security Measures

- **Helmet:** HTTP security headers
- **CORS:** Configured for allowed origins
- **Rate Limiting:** Prevents abuse
- **Validation:** class-validator for input sanitization

### 8. Monitoring & Health

- **Health Checks:** Database, Injective SDK connectivity
- **Logging:** Winston with structured logs
- **Metrics:** Response times, cache hit rates

## Scalability Considerations

1. **Horizontal Scaling:** Stateless design allows multiple instances
2. **Cache:** Reduces load on Injective API
3. **Queue System:** Background job processing
4. **Connection Pooling:** Database connections managed by TypeORM

## Performance Targets

- **API Response:** < 200ms cached, < 1s computed
- **Cache Hit Rate:** > 80%
- **Uptime:** 99.9%
- **Rate Limit:** 100 req/min default
