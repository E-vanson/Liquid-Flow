import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { LiquidityUpdaterProcessor } from './liquidity-updater.processor';
import { InjectiveModule } from '../injective/injective.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'liquidity-updates',
    }),
    InjectiveModule,
  ],
  providers: [LiquidityUpdaterProcessor],
})
export class JobsModule {}
