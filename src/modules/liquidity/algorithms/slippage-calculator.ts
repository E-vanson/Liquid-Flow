import { Injectable } from '@nestjs/common';

export interface SlippageResult {
  expectedPrice: number;
  actualPrice: number;
  slippagePercent: number;
  priceImpact: number;
  totalCost: number;
}

@Injectable()
export class SlippageCalculator {
  /**
   * Calculate slippage for a given order size
   * @param orderbook - Array of price levels [{price, quantity}]
   * @param orderSize - Size of the order to execute
   * @param side - 'buy' or 'sell'
   */
  calculateSlippage(
    orderbook: Array<{ price: number; quantity: number }>,
    orderSize: number,
    side: 'buy' | 'sell',
  ): SlippageResult {
    if (orderSize <= 0) {
      throw new Error('Order size must be positive');
    }

    if (!orderbook || orderbook.length === 0) {
      throw new Error('Orderbook is empty');
    }

    // Sort orderbook (best prices first)
    const sortedBook = [...orderbook].sort((a, b) => 
      side === 'buy' ? a.price - b.price : b.price - a.price
    );

    const bestPrice = sortedBook[0].price;
    let remainingSize = orderSize;
    let totalCost = 0;
    let totalQuantity = 0;

    // Walk through orderbook to fill the order
    for (const level of sortedBook) {
      if (remainingSize <= 0) break;

      const quantityToTake = Math.min(remainingSize, level.quantity);
      totalCost += quantityToTake * level.price;
      totalQuantity += quantityToTake;
      remainingSize -= quantityToTake;
    }

    // Check if orderbook has enough liquidity
    if (remainingSize > 0) {
      throw new Error(
        `Insufficient liquidity. Can only fill ${totalQuantity} of ${orderSize}`,
      );
    }

    const averagePrice = totalCost / totalQuantity;
    const slippagePercent = ((averagePrice - bestPrice) / bestPrice) * 100;
    const priceImpact = slippagePercent;

    return {
      expectedPrice: bestPrice,
      actualPrice: averagePrice,
      slippagePercent: Math.abs(slippagePercent),
      priceImpact: Math.abs(priceImpact),
      totalCost,
    };
  }

  /**
   * Calculate slippage at different order sizes
   */
  calculateSlippageLadder(
    orderbook: Array<{ price: number; quantity: number }>,
    side: 'buy' | 'sell',
    steps: number[] = [100, 500, 1000, 5000, 10000],
  ): Array<{ orderSize: number; slippage: SlippageResult | null }> {
    return steps.map(size => {
      try {
        return {
          orderSize: size,
          slippage: this.calculateSlippage(orderbook, size, side),
        };
      } catch (error) {
        return {
          orderSize: size,
          slippage: null,
        };
      }
    });
  }
}
