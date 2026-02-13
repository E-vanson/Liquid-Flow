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
