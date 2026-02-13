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
