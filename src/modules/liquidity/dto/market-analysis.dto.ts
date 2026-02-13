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
