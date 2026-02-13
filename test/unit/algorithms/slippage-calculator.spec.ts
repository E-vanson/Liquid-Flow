import { SlippageCalculator } from '../../../src/modules/liquidity/algorithms/slippage-calculator';

describe('SlippageCalculator', () => {
  let calculator: SlippageCalculator;

  beforeEach(() => {
    calculator = new SlippageCalculator();
  });

  describe('calculateSlippage', () => {
    it('should calculate slippage for buy order', () => {
      const orderbook = [
        { price: 100, quantity: 50 },
        { price: 101, quantity: 50 },
        { price: 102, quantity: 100 },
      ];

      const result = calculator.calculateSlippage(orderbook, 100, 'buy');

      expect(result.expectedPrice).toBe(100);
      expect(result.actualPrice).toBe(100);
      expect(result.slippagePercent).toBe(0);
      expect(result.totalCost).toBe(10000);
    });

    it('should calculate slippage when order exceeds first level', () => {
      const orderbook = [
        { price: 100, quantity: 50 },
        { price: 101, quantity: 50 },
        { price: 102, quantity: 100 },
      ];

      const result = calculator.calculateSlippage(orderbook, 100, 'buy');

      expect(result.expectedPrice).toBe(100);
      expect(result.actualPrice).toBe(100.5);
      expect(result.slippagePercent).toBe(0.5);
      expect(result.totalCost).toBe(10050);
    });

    it('should calculate slippage for sell order', () => {
      const orderbook = [
        { price: 100, quantity: 50 },
        { price: 99, quantity: 50 },
        { price: 98, quantity: 100 },
      ];

      const result = calculator.calculateSlippage(orderbook, 100, 'sell');

      expect(result.expectedPrice).toBe(100);
      expect(result.actualPrice).toBe(99.5);
      expect(result.slippagePercent).toBe(0.5);
    });

    it('should throw error for invalid order size', () => {
      const orderbook = [{ price: 100, quantity: 50 }];

      expect(() => {
        calculator.calculateSlippage(orderbook, 0, 'buy');
      }).toThrow('Order size must be positive');
    });

    it('should throw error for empty orderbook', () => {
      expect(() => {
        calculator.calculateSlippage([], 100, 'buy');
      }).toThrow('Orderbook is empty');
    });

    it('should throw error for insufficient liquidity', () => {
      const orderbook = [
        { price: 100, quantity: 10 },
        { price: 101, quantity: 10 },
      ];

      expect(() => {
        calculator.calculateSlippage(orderbook, 100, 'buy');
      }).toThrow('Insufficient liquidity');
    });
  });

  describe('calculateSlippageLadder', () => {
    it('should calculate slippage for multiple order sizes', () => {
      const orderbook = [
        { price: 100, quantity: 100 },
        { price: 101, quantity: 100 },
        { price: 102, quantity: 100 },
      ];

      const result = calculator.calculateSlippageLadder(
        orderbook,
        'buy',
        [50, 100, 150, 250],
      );

      expect(result).toHaveLength(4);
      expect(result[0].orderSize).toBe(50);
      expect(result[0].slippage).not.toBeNull();
      expect(result[3].slippage).not.toBeNull();
    });

    it('should return null for unsfillable orders', () => {
      const orderbook = [
        { price: 100, quantity: 10 },
        { price: 101, quantity: 10 },
      ];

      const result = calculator.calculateSlippageLadder(
        orderbook,
        'buy',
        [5, 15, 25],
      );

      expect(result[0].slippage).not.toBeNull();
      expect(result[1].slippage).toBeNull();
      expect(result[2].slippage).toBeNull();
    });
  });
});
