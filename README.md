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
