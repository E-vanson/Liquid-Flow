import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, Min, IsOptional } from 'class-validator';

export class BestRouteQueryDto {
  @ApiPropertyOptional({
    description: 'Order amount',
    example: 1000,
  })
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({
    description: 'Order side',
    enum: ['buy', 'sell'],
    example: 'buy',
  })
  @IsEnum(['buy', 'sell'])
  side?: 'buy' | 'sell';
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

export interface ComparisonResult {
  token: string;
  marketCount?: number;
  averageLiquidityScore?: number;
  markets?: Array<{ marketId: string; score: number }>;
  error?: string;
}

export interface CompareMarketsResponse {
  comparison: ComparisonResult[];
  timestamp: Date;
}
