import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { InjectiveModule } from '../modules/injective/injective.module';

@Module({
  imports: [TerminusModule, InjectiveModule],
  controllers: [HealthController],
})
export class HealthModule {}
