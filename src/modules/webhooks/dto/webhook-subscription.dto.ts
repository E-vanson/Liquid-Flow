import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUrl, IsEnum, IsOptional, IsNumber, Min } from 'class-validator';

/**
 * Available webhook event types
 */
export enum WebhookEventType {
  ARBITRAGE = 'arbitrage',
  LIQUIDITY_CHANGE = 'liquidity_change',
  LARGE_ORDER = 'large_order',
}

/**
 * DTO for creating a webhook subscription
 */
export class CreateWebhookDto {
  @ApiProperty({
    title: 'Webhook URL',
    description: 'The HTTPS URL that will receive webhook payloads',
    example: 'https://your-app.com/api/webhooks/injective',
    format: 'uri',
  })
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  url: string;

  @ApiProperty({
    title: 'Event Type',
    description: 'The type of events to receive',
    enum: WebhookEventType,
    example: WebhookEventType.ARBITRAGE,
  })
  @IsEnum(WebhookEventType)
  eventType: WebhookEventType;

  @ApiPropertyOptional({
    title: 'Token Filter',
    description:
      'Optional filter to receive events for a specific token only. ' +
      'Provide the token symbol (e.g., "INJ", "USDT")',
    example: 'INJ',
  })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiPropertyOptional({
    title: 'Market Filter',
    description:
      'Optional filter to receive events for a specific market only. ' +
      'Provide the market ID (0x...)',
    example: '0x...',
  })
  @IsOptional()
  @IsString()
  marketId?: string;

  @ApiPropertyOptional({
    title: 'Threshold',
    description:
      'Minimum threshold for triggering alerts. ' +
      'For arbitrage: minimum spread percentage (e.g., 0.5 for 0.5%)' +
      'For liquidity_change: minimum percentage change' +
      'For large_order: minimum order size in quote currency',
    example: 0.5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  threshold?: number;
}

/**
 * Response when a webhook subscription is created
 */
export class WebhookSubscriptionResponse {
  @ApiProperty({
    description: 'Unique subscription ID',
    example: 'wh_1700000000_abc123xyz',
  })
  subscriptionId: string;

  @ApiProperty({
    description: 'Webhook URL',
    format: 'uri',
  })
  url: string;

  @ApiProperty({
    description: 'Event type',
    enum: WebhookEventType,
  })
  eventType: string;

  @ApiPropertyOptional({
    description: 'Token filter',
  })
  token?: string;

  @ApiPropertyOptional({
    description: 'Market filter',
  })
  marketId?: string;

  @ApiPropertyOptional({
    description: 'Threshold value',
  })
  threshold?: number;

  @ApiProperty({
    description: 'When the subscription was created',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
}

/**
 * Example webhook payload that will be sent to your endpoint
 */
export class WebhookPayloadExample {
  @ApiProperty({
    description: 'Event type',
    example: 'arbitrage',
  })
  event: string;

  @ApiProperty({
    description: 'Event data',
    example: {
      buyMarket: '0x...',
      sellMarket: '0x...',
      spreadPercent: 0.75,
      estimatedProfit: 150.50,
    },
  })
  data: Record<string, any>;

  @ApiProperty({
    description: 'When the event occurred',
    type: 'string',
    format: 'date-time',
  })
  timestamp: Date;

  @ApiProperty({
    description:
      'HMAC-SHA256 signature for payload verification. ' +
      'Use WEBHOOK_SECRET to verify this signature.',
    example: 't=1700000000,v1=abc123...',
  })
  signature: string;
}
