import { ArbitrageDetector } from '../../../src/modules/liquidity/algorithms/arbitrage-detector';

describe('ArbitrageDetector', () => {
  let detector: ArbitrageDetector;

  beforeEach(() => {
    detector = new ArbitrageDetector();
  });

  describe('findOpportunities', () => {
    it('should find arbitrage opportunity between two markets', () => {
      const markets = [
        {
          marketId: 'market1',
          token: 'INJ',
          bestBid: 15.20,
          bestAsk: 15.25,
          bidQuantity: 100,
          askQuantity: 100,
        },
        {
          marketId: 'market2',
          token: 'INJ',
          bestBid: 15.35,
          bestAsk: 15.40,
          bidQuantity: 100,
          askQuantity: 100,
        },
      ];

      const opportunities = detector.findOpportunities(markets, 0.5);

      expect(opportunities.length).toBeGreaterThan(0);
      expect(opportunities[0].buyMarket).toBe('market1');
      expect(opportunities[0].sellMarket).toBe('market2');
      expect(opportunities[0].spreadPercent).toBeGreaterThan(0.5);
    });

    it('should not find opportunities when spread is too small', () => {
      const markets = [
        {
          marketId: 'market1',
          token: 'INJ',
          bestBid: 15.20,
          bestAsk: 15.21,
          bidQuantity: 100,
          askQuantity: 100,
        },
        {
          marketId: 'market2',
          token: 'INJ',
          bestBid: 15.22,
          bestAsk: 15.23,
          bidQuantity: 100,
          askQuantity: 100,
        },
      ];

      const opportunities = detector.findOpportunities(markets, 0.5);

      expect(opportunities.length).toBe(0);
    });

    it('should return opportunities sorted by estimated profit', () => {
      const markets = [
        {
          marketId: 'market1',
          token: 'INJ',
          bestBid: 15.20,
          bestAsk: 15.25,
          bidQuantity: 100,
          askQuantity: 100,
        },
        {
          marketId: 'market2',
          token: 'INJ',
          bestBid: 15.35,
          bestAsk: 15.40,
          bidQuantity: 100,
          askQuantity: 100,
        },
        {
          marketId: 'market3',
          token: 'INJ',
          bestBid: 15.40,
          bestAsk: 15.45,
          bidQuantity: 100,
          askQuantity: 100,
        },
      ];

      const opportunities = detector.findOpportunities(markets, 0.1);

      expect(opportunities.length).toBeGreaterThan(0);
      for (let i = 0; i < opportunities.length - 1; i++) {
        expect(opportunities[i].estimatedProfit).toBeGreaterThanOrEqual(
          opportunities[i + 1].estimatedProfit,
        );
      }
    });

    it('should handle different tokens separately', () => {
      const markets = [
        {
          marketId: 'market1',
          token: 'INJ',
          bestBid: 15.20,
          bestAsk: 15.25,
          bidQuantity: 100,
          askQuantity: 100,
        },
        {
          marketId: 'market2',
          token: 'USDT',
          bestBid: 1.00,
          bestAsk: 1.01,
          bidQuantity: 1000,
          askQuantity: 1000,
        },
      ];

      const opportunities = detector.findOpportunities(markets, 0.1);

      const tokens = opportunities.map((o) => o.token);
      expect(new Set(tokens).size).toBe(tokens.length);
    });
  });
});
