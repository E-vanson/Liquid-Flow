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
