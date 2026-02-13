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
