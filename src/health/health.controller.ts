import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { InjectiveService } from '../modules/injective/injective.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private injectiveService: InjectiveService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check API health status' })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      async () => {
        try {
          await this.injectiveService.getSpotMarkets();
          return { injective: { status: 'up' } };
        } catch {
          return { injective: { status: 'down' } };
        }
      },
    ]);
  }
}
