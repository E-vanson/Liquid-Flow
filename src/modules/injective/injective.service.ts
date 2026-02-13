import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ChainGrpcWasmApi,
  IndexerGrpcSpotApi,
  IndexerGrpcDerivativesApi,
  IndexerRestExplorerApi,
} from '@injectivelabs/sdk-ts';
import { Network, getNetworkEndpoints } from '@injectivelabs/networks';

@Injectable()
export class InjectiveService implements OnModuleInit {
  private readonly logger = new Logger(InjectiveService.name);
  
  private spotApi: IndexerGrpcSpotApi;
  private derivativesApi: IndexerGrpcDerivativesApi;
  private explorerApi: IndexerRestExplorerApi;
  private wasmApi: ChainGrpcWasmApi;
  private network: Network;

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    const networkType = this.config.get('INJECTIVE_NETWORK') || 'testnet';
    this.network = networkType === 'mainnet' ? Network.Mainnet : Network.Testnet;
    
    const endpoints = getNetworkEndpoints(this.network);
    
    this.spotApi = new IndexerGrpcSpotApi(endpoints.indexer);
    this.derivativesApi = new IndexerGrpcDerivativesApi(endpoints.indexer);
    this.explorerApi = new IndexerRestExplorerApi(endpoints.explorer || '');
    this.wasmApi = new ChainGrpcWasmApi(endpoints.grpc);

    this.logger.log(`Connected to Injective ${networkType}`);
  }

  /**
   * Get all active spot markets
   */
  async getSpotMarkets() {
    try {
      const markets = await this.spotApi.fetchMarkets();
      return markets;
    } catch (error: any) {
      this.logger.error(`Failed to fetch spot markets: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get orderbook for a specific market
   */
  async getOrderbook(marketId: string) {
    try {
      const orderbook = await this.spotApi.fetchOrderbookV2(marketId);
      return orderbook;
    } catch (error: any) {
      this.logger.error(`Failed to fetch orderbook for ${marketId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get market trades
   */
  async getMarketTrades(marketId: string, limit: number = 100) {
    try {
      const response = await this.spotApi.fetchTrades({
        marketId,
      });
      // Handle the response based on SDK version
      const trades = Array.isArray(response) ? response : (response as any).trades || [];
      return { trades: trades.slice(0, limit) };
    } catch (error: any) {
      this.logger.error(`Failed to fetch trades for ${marketId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get market summary (24h stats)
   */
  async getMarketSummary(marketId: string) {
    try {
      const market = await this.spotApi.fetchMarket(marketId);
      return market;
    } catch (error: any) {
      this.logger.error(`Failed to fetch market summary for ${marketId}: ${error.message}`);
      throw error;
    }
  }

  // Getters for APIs (for direct access if needed)
  getSpotApi() {
    return this.spotApi;
  }

  getDerivativesApi() {
    return this.derivativesApi;
  }

  getExplorerApi() {
    return this.explorerApi;
  }

  getWasmApi() {
    return this.wasmApi;
  }

  getNetwork() {
    return this.network;
  }
}
