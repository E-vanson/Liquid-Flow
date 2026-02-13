import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InjectiveService } from '../injective/injective.service';

@Processor('liquidity-updates')
export class LiquidityUpdaterProcessor {
  private readonly logger = new Logger(LiquidityUpdaterProcessor.name);

  constructor(private injectiveService: InjectiveService) {}

  @Process('update-market-data')
  async updateMarketData(job: Job) {
    this.logger.log('Starting market data update...');

    try {
      const markets = await this.injectiveService.getSpotMarkets();
      this.logger.log(`Fetched ${markets.length} markets`);

      // Process market data (store in database, update cache, etc.)
      // This is where you'd save to TimescaleDB

      return { success: true, marketsProcessed: markets.length };
    } catch (error) {
      this.logger.error(`Market data update failed: ${error.message}`);
      throw error;
    }
  }
}
