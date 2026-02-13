import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectiveService } from '../injective/injective.service';
import { SlippageCalculator } from './algorithms/slippage-calculator';
import { LiquidityScorer } from './algorithms/liquidity-scorer';
import { ArbitrageDetector } from './algorithms/arbitrage-detector';
import { RouteOptimizer } from './algorithms/route-optimizer';
import { CompareMarketsResponse, ComparisonResult } from './dto/best-route.dto';

// Type definitions for Injective SDK responses
interface InjectiveMarket {
  marketId: string;
  baseToken: { symbol: string };
  quoteToken: { symbol: string };
}

interface InjectiveOrderbook {
  buys: Array<{ price: string; quantity: string }>;
  sells: Array<{ price: string; quantity: string }>;
}

interface InjectiveMarketSummary {
  baseToken: { symbol: string };
}

interface ArbitrageMarketData {
  marketId: string;
  token: string;
  bestBid: number;
  bestAsk: number;
  bidQuantity: number;
  askQuantity: number;
}

@Injectable()
export class LiquidityService {
  private readonly logger = new Logger(LiquidityService.name);

  constructor(
    private injectiveService: InjectiveService,
    private slippageCalculator: SlippageCalculator,
    private liquidityScorer: LiquidityScorer,
    private arbitrageDetector: ArbitrageDetector,
    private routeOptimizer: RouteOptimizer,
  ) {}

  /**
   * Find best execution route across markets
   */
  async findBestRoute(token: string, amount: number, side: 'buy' | 'sell') {
    // Get all markets for this token
    const allMarkets = await this.injectiveService.getSpotMarkets() as InjectiveMarket[];
    const tokenMarkets = allMarkets.filter((m: InjectiveMarket) =>
      m.baseToken.symbol.toUpperCase() === token.toUpperCase() ||
      m.quoteToken.symbol.toUpperCase() === token.toUpperCase()
    );

    if (tokenMarkets.length === 0) {
      throw new NotFoundException(`No markets found for token ${token}`);
    }

    // Fetch orderbooks for all markets
    const marketData = await Promise.all(
      tokenMarkets.map(async (market: InjectiveMarket) => {
        const orderbook = await this.injectiveService.getOrderbook(market.marketId) as InjectiveOrderbook;
        return {
          marketId: market.marketId,
          orderbook: this.formatOrderbook(orderbook, side),
        };
      }),
    );

    // Find optimal route
    const route = this.routeOptimizer.findOptimalRoute(
      token,
      amount,
      side,
      marketData,
    );

    return {
      ...route,
      timestamp: new Date(),
    };
  }

  /**
   * Analyze single market liquidity
   */
  async analyzeMarket(marketId: string) {
    const orderbook = await this.injectiveService.getOrderbook(marketId) as InjectiveOrderbook;
    const market = await this.injectiveService.getMarketSummary(marketId) as InjectiveMarketSummary;

    const bids = orderbook.buys.map((b: { price: string; quantity: string }) => ({
      price: parseFloat(b.price),
      quantity: parseFloat(b.quantity),
    }));

    const asks = orderbook.sells.map((s: { price: string; quantity: string }) => ({
      price: parseFloat(s.price),
      quantity: parseFloat(s.quantity),
    }));

    // Calculate liquidity score
    const liquidityScore = this.liquidityScorer.calculateScore(bids, asks);

    // Calculate slippage at different sizes
    const slippageLadder = this.slippageCalculator.calculateSlippageLadder(
      asks,
      'buy',
      [100, 500, 1000, 5000, 10000],
    );

    return {
      marketId,
      token: market.baseToken.symbol,
      liquidityScore,
      orderbook: {
        bids: bids.slice(0, 10),
        asks: asks.slice(0, 10),
      },
      slippageEstimates: slippageLadder
        .filter((s: { orderSize: number; slippage: { slippagePercent: number; priceImpact: number } | null }) => s.slippage !== null)
        .map((s: { orderSize: number; slippage: { slippagePercent: number; priceImpact: number } | null }) => ({
          orderSize: s.orderSize,
          slippagePercent: s.slippage!.slippagePercent,
          priceImpact: s.slippage!.priceImpact,
        })),
      timestamp: new Date(),
    };
  }

  /**
   * Find arbitrage opportunities
   */
  async findArbitrageOpportunities(minSpread: number = 0.5) {
    const allMarkets = await this.injectiveService.getSpotMarkets() as InjectiveMarket[];

    // Get best bid/ask for each market
    const marketData = await Promise.all(
      allMarkets.map(async (market: InjectiveMarket) => {
        try {
          const orderbook = await this.injectiveService.getOrderbook(market.marketId) as InjectiveOrderbook;
          
          return {
            marketId: market.marketId,
            token: market.baseToken.symbol,
            bestBid: parseFloat(orderbook.buys[0]?.price || '0'),
            bestAsk: parseFloat(orderbook.sells[0]?.price || '0'),
            bidQuantity: parseFloat(orderbook.buys[0]?.quantity || '0'),
            askQuantity: parseFloat(orderbook.sells[0]?.quantity || '0'),
          };
        } catch (error) {
          this.logger.warn(`Failed to fetch orderbook for ${market.marketId}`);
          return null;
        }
      }),
    );

    const validMarkets = marketData.filter((m: ArbitrageMarketData | null): m is ArbitrageMarketData => 
      m !== null && m.bestBid > 0 && m.bestAsk > 0
    );

    const opportunities = this.arbitrageDetector.findOpportunities(
      validMarkets,
      minSpread,
    );

    return {
      opportunities,
      count: opportunities.length,
      timestamp: new Date(),
    };
  }

  /**
   * Compare liquidity across tokens
   */
  async compareMarkets(tokens: string[]): Promise<CompareMarketsResponse> {
    const results = await Promise.all(
      tokens.map(async (token: string): Promise<ComparisonResult> => {
        try {
          const allMarkets = await this.injectiveService.getSpotMarkets() as InjectiveMarket[];
          const tokenMarkets = allMarkets.filter((m: InjectiveMarket) =>
            m.baseToken.symbol.toUpperCase() === token.toUpperCase()
          );

          if (tokenMarkets.length === 0) {
            return { token, error: 'No markets found' };
          }

          // Get total liquidity across all markets
          const liquidityData = await Promise.all(
            tokenMarkets.map(async (m: InjectiveMarket) => {
              const analysis = await this.analyzeMarket(m.marketId);
              return analysis.liquidityScore;
            }),
          );

          const avgScore = liquidityData.reduce((sum: number, s: { overall: number }) => sum + s.overall, 0) / liquidityData.length;

          return {
            token,
            marketCount: tokenMarkets.length,
            averageLiquidityScore: avgScore,
            markets: tokenMarkets.map((m: InjectiveMarket, i: number) => ({
              marketId: m.marketId,
              score: liquidityData[i].overall,
            })),
          };
        } catch (error: any) {
          return { token, error: error.message };
        }
      }),
    );

    return {
      comparison: results,
      timestamp: new Date(),
    };
  }

  /**
   * Helper: Format orderbook for calculations
   */
  private formatOrderbook(orderbook: InjectiveOrderbook, side: 'buy' | 'sell') {
    const levels = side === 'buy' ? orderbook.sells : orderbook.buys;
    return levels.map((level: { price: string; quantity: string }) => ({
      price: parseFloat(level.price),
      quantity: parseFloat(level.quantity),
    }));
  }
}
