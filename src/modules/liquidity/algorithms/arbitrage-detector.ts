import { Injectable } from '@nestjs/common';

export interface ArbitrageOpportunity {
  buyMarket: string;
  sellMarket: string;
  buyPrice: number;
  sellPrice: number;
  spread: number;
  spreadPercent: number;
  maxProfitableSize: number;
  estimatedProfit: number;
  token: string;
}

@Injectable()
export class ArbitrageDetector {
  /**
   * Find arbitrage opportunities across markets
   */
  findOpportunities(
    markets: Array<{
      marketId: string;
      token: string;
      bestBid: number;
      bestAsk: number;
      bidQuantity: number;
      askQuantity: number;
    }>,
    minSpreadPercent: number = 0.5,
  ): ArbitrageOpportunity[] {
    const opportunities: ArbitrageOpportunity[] = [];

    // Compare all market pairs for the same token
    const tokenGroups = this.groupByToken(markets);

    for (const [token, tokenMarkets] of Object.entries(tokenGroups)) {
      for (let i = 0; i < tokenMarkets.length; i++) {
        for (let j = i + 1; j < tokenMarkets.length; j++) {
          const market1 = tokenMarkets[i];
          const market2 = tokenMarkets[j];

          // Check if buying on market1 and selling on market2 is profitable
          const opportunity1 = this.checkArbitrage(
            market1,
            market2,
            token,
            minSpreadPercent,
          );
          if (opportunity1) opportunities.push(opportunity1);

          // Check reverse direction
          const opportunity2 = this.checkArbitrage(
            market2,
            market1,
            token,
            minSpreadPercent,
          );
          if (opportunity2) opportunities.push(opportunity2);
        }
      }
    }

    // Sort by estimated profit
    return opportunities.sort((a, b) => b.estimatedProfit - a.estimatedProfit);
  }

  /**
   * Check if arbitrage exists between two markets
   */
  private checkArbitrage(
    buyMarket: any,
    sellMarket: any,
    token: string,
    minSpreadPercent: number,
  ): ArbitrageOpportunity | null {
    const buyPrice = buyMarket.bestAsk;
    const sellPrice = sellMarket.bestBid;

    if (buyPrice >= sellPrice) return null;

    const spread = sellPrice - buyPrice;
    const spreadPercent = (spread / buyPrice) * 100;

    if (spreadPercent < minSpreadPercent) return null;

    // Max size limited by available liquidity
    const maxSize = Math.min(buyMarket.askQuantity, sellMarket.bidQuantity);

    // Estimate profit (assuming 0.1% fees on each side)
    const feePercent = 0.002; // 0.2% total
    const profitPerUnit = spread - (buyPrice + sellPrice) * feePercent;
    const estimatedProfit = profitPerUnit * maxSize;

    if (estimatedProfit <= 0) return null;

    return {
      buyMarket: buyMarket.marketId,
      sellMarket: sellMarket.marketId,
      buyPrice,
      sellPrice,
      spread,
      spreadPercent,
      maxProfitableSize: maxSize,
      estimatedProfit,
      token,
    };
  }

  /**
   * Group markets by token
   */
  private groupByToken(markets: any[]): Record<string, any[]> {
    return markets.reduce((groups, market) => {
      const token = market.token;
      if (!groups[token]) groups[token] = [];
      groups[token].push(market);
      return groups;
    }, {});
  }
}
