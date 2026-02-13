import {
  Controller,
  Get,
  Query,
  Param,
  HttpStatus,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { LiquidityService } from './liquidity.service';
import {
  BestRouteQueryDto,
  BestRouteResponseDto,
  CompareMarketsResponse,
} from './dto/best-route.dto';
import {
  ArbitrageQueryDto,
  ArbitrageResponseDto,
} from './dto/arbitrage.dto';
import { MarketAnalysisResponseDto } from './dto/market-analysis.dto';

@ApiTags('liquidity')
@Controller('liquidity')
@UseInterceptors(CacheInterceptor)
export class LiquidityController {
  private readonly logger = new Logger(LiquidityController.name);

  constructor(private readonly liquidityService: LiquidityService) {}

  @Get('token/:token/best-route')
  @CacheTTL(5) // Cache for 5 seconds
  @ApiOperation({
    summary: 'Get optimal execution route for a token',
    description:
      'Returns the best way to split an order across multiple markets to minimize slippage',
  })
  @ApiParam({ name: 'token', example: 'INJ' })
  @ApiQuery({ name: 'amount', example: 1000 })
  @ApiQuery({ name: 'side', enum: ['buy', 'sell'] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Optimal route calculated successfully',
    type: BestRouteResponseDto,
  })
  async getBestRoute(
    @Param('token') token: string,
    @Query() query: BestRouteQueryDto,
  ): Promise<BestRouteResponseDto> {
    this.logger.log(`Getting best route for ${query.amount} ${token} (${query.side})`);
    return this.liquidityService.findBestRoute(token, query.amount, query.side);
  }

  @Get('market/:marketId/analysis')
  @CacheTTL(10)
  @ApiOperation({
    summary: 'Get comprehensive liquidity analysis for a market',
    description:
      'Returns liquidity score, orderbook depth, slippage estimates, and market health metrics',
  })
  @ApiParam({ name: 'marketId', example: '0x...' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Market analysis retrieved successfully',
    type: MarketAnalysisResponseDto,
  })
  async getMarketAnalysis(
    @Param('marketId') marketId: string,
  ): Promise<MarketAnalysisResponseDto> {
    this.logger.log(`Analyzing market ${marketId}`);
    return this.liquidityService.analyzeMarket(marketId);
  }

  @Get('opportunities/arbitrage')
  @CacheTTL(3)
  @ApiOperation({
    summary: 'Find arbitrage opportunities across markets',
    description:
      'Scans all markets to find price discrepancies that can be exploited for profit',
  })
  @ApiQuery({
    name: 'minSpread',
    required: false,
    example: 0.5,
    description: 'Minimum spread percentage (default: 0.5%)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Arbitrage opportunities found',
    type: ArbitrageResponseDto,
  })
  async getArbitrageOpportunities(
    @Query() query: ArbitrageQueryDto,
  ): Promise<ArbitrageResponseDto> {
    this.logger.log(`Scanning for arbitrage opportunities (min spread: ${query.minSpread || 0.5}%)`);
    return this.liquidityService.findArbitrageOpportunities(query.minSpread);
  }

  @Get('markets/comparison')
  @CacheTTL(15)
  @ApiOperation({
    summary: 'Compare liquidity across multiple tokens',
    description: 'Returns comparative liquidity metrics for specified tokens',
  })
  @ApiQuery({
    name: 'tokens',
    example: 'INJ,USDT,ETH',
    description: 'Comma-separated list of tokens',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Market comparison retrieved successfully',
  })
  async compareMarkets(@Query('tokens') tokens: string): Promise<CompareMarketsResponse> {
    const tokenList = tokens.split(',').map(t => t.trim());
    this.logger.log(`Comparing markets for: ${tokenList.join(', ')}`);
    return this.liquidityService.compareMarkets(tokenList);
  }
}
