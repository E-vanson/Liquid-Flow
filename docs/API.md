# API Reference

## Overview

The Liquidity Intelligence API provides comprehensive endpoints for analyzing liquidity across Injective DEX markets.

## Base URL

```
http://localhost:3000/api/v1
```

## Endpoints

### Liquidity Endpoints

#### Get Best Route

```
GET /liquidity/token/{token}/best-route
```

Finds the optimal way to split an order across multiple markets to minimize slippage.

**Parameters:**
- `token` (path): Token symbol (e.g., INJ, USDT)
- `amount` (query): Order size
- `side` (query): 'buy' or 'sell'

**Response:**
```json
{
  "markets": [
    {
      "marketId": "0x...",
      "amount": 700,
      "price": 15.23,
      "slippage": 0.12
    }
  ],
  "totalAmount": 1000,
  "averagePrice": 15.25,
  "totalSlippage": 0.10,
  "savings": 24.50,
  "timestamp": "2026-02-14T10:30:00Z"
}
```

#### Get Market Analysis

```
GET /liquidity/market/{marketId}/analysis
```

Returns comprehensive liquidity analysis for a specific market.

**Parameters:**
- `marketId` (path): Market ID (0x... format)

**Response:**
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
    "bids": [...],
    "asks": [...]
  },
  "slippageEstimates": [...],
  "timestamp": "2026-02-14T10:30:00Z"
}
```

#### Get Arbitrage Opportunities

```
GET /liquidity/opportunities/arbitrage
```

Scans all markets for profitable arbitrage opportunities.

**Parameters:**
- `minSpread` (query, optional): Minimum spread percentage (default: 0.5)

**Response:**
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

#### Compare Markets

```
GET /liquidity/markets/comparison
```

Compares liquidity metrics across multiple tokens.

**Parameters:**
- `tokens` (query): Comma-separated list of tokens (e.g., "INJ,USDT,ETH")

**Response:**
```json
{
  "comparison": [
    {
      "token": "INJ",
      "marketCount": 3,
      "averageLiquidityScore": 85.4,
      "markets": [...]
    }
  ],
  "timestamp": "2026-02-14T10:30:00Z"
}
```

### Webhook Endpoints

#### Subscribe to Webhook

```
POST /webhooks/subscribe
```

Creates a new webhook subscription.

**Request Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "eventType": "arbitrage",
  "filter": "INJ",
  "threshold": 0.5
}
```

**Response:**
```json
{
  "subscriptionId": "wh_1234567890_abc123",
  "url": "https://your-app.com/webhook",
  "eventType": "arbitrage",
  "filter": "INJ",
  "threshold": 0.5
}
```

#### Unsubscribe

```
DELETE /webhooks/{subscriptionId}
```

Removes a webhook subscription.

**Response:**
```json
{
  "success": true
}
```

### Health Endpoints

#### Health Check

```
GET /health
```

Returns the health status of all API components.

**Response:**
```json
{
  "status": "ok",
  "details": {
    "database": { "status": "up" },
    "injective": { "status": "up" }
  }
}
```

## Rate Limits

- **Default:** 100 requests per minute
- **Cached endpoints:** Higher limits apply
- **Configurable** via environment variables

## Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Internal Server Error |

## Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation error",
  "error": "Bad Request"
}
```
