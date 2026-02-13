import { Injectable } from '@nestjs/common';

export interface LiquidityScore {
  overall: number;          // 0-100
  depth: number;           // Amount available at best 10 levels
  spread: number;          // Bid-ask spread percentage
  concentration: number;   // Gini coefficient (0=perfect distribution)
  resilience: number;      // How quickly liquidity recovers
}

@Injectable()
export class LiquidityScorer {
  /**
   * Calculate comprehensive liquidity score
   */
  calculateScore(
    bids: Array<{ price: number; quantity: number }>,
    asks: Array<{ price: number; quantity: number }>,
  ): LiquidityScore {
    const depth = this.calculateDepth(bids, asks);
    const spread = this.calculateSpread(bids, asks);
    const concentration = this.calculateConcentration(bids, asks);

    // Weighted scoring (depth 40%, spread 40%, distribution 20%)
    const depthScore = Math.min((depth / 100000) * 100, 100); // Normalize to 100k
    const spreadScore = Math.max(100 - spread * 100, 0);
    const concentrationScore = (1 - concentration) * 100;

    const overall = (
      depthScore * 0.4 +
      spreadScore * 0.4 +
      concentrationScore * 0.2
    );

    return {
      overall: Math.round(overall * 100) / 100,
      depth,
      spread,
      concentration,
      resilience: 0, // Would need historical data
    };
  }

  /**
   * Calculate total depth at top 10 levels
   */
  private calculateDepth(
    bids: Array<{ price: number; quantity: number }>,
    asks: Array<{ price: number; quantity: number }>,
  ): number {
    const topBids = bids.slice(0, 10);
    const topAsks = asks.slice(0, 10);

    const bidDepth = topBids.reduce((sum, level) => sum + level.quantity, 0);
    const askDepth = topAsks.reduce((sum, level) => sum + level.quantity, 0);

    return (bidDepth + askDepth) / 2;
  }

  /**
   * Calculate bid-ask spread
   */
  private calculateSpread(
    bids: Array<{ price: number; quantity: number }>,
    asks: Array<{ price: number; quantity: number }>,
  ): number {
    if (bids.length === 0 || asks.length === 0) return 100;

    const bestBid = Math.max(...bids.map(b => b.price));
    const bestAsk = Math.min(...asks.map(a => a.price));

    return ((bestAsk - bestBid) / bestBid);
  }

  /**
   * Calculate concentration (Gini coefficient)
   * 0 = perfectly distributed, 1 = concentrated
   */
  private calculateConcentration(
    bids: Array<{ price: number; quantity: number }>,
    asks: Array<{ price: number; quantity: number }>,
  ): number {
    const allLevels = [...bids, ...asks];
    const quantities = allLevels.map(l => l.quantity).sort((a, b) => a - b);
    
    if (quantities.length === 0) return 1;

    const n = quantities.length;
    const totalQuantity = quantities.reduce((sum, q) => sum + q, 0);
    
    if (totalQuantity === 0) return 1;

    let gini = 0;
    for (let i = 0; i < n; i++) {
      gini += (2 * (i + 1) - n - 1) * quantities[i];
    }

    return gini / (n * totalQuantity);
  }
}
