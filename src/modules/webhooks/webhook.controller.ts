import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { CreateWebhookDto } from './dto/webhook-subscription.dto';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private webhookService: WebhookService) {}

  @Post('subscribe')
  @ApiOperation({
    summary: 'Subscribe to webhook notifications',
    description:
      'Register a webhook URL to receive real-time liquidity alerts. ' +
      'Webhooks will be triggered when arbitrage opportunities are found, ' +
      'liquidity changes significantly, or large orders are detected.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Webhook subscription created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request - missing required fields',
  })
  async subscribe(@Body() dto: CreateWebhookDto) {
    this.logger.log(`Creating webhook subscription for event: ${dto.eventType}`);
    return this.webhookService.createSubscription(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all webhook subscriptions',
    description: 'Returns all active webhook subscriptions',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all subscriptions',
  })
  getSubscriptions() {
    return this.webhookService.getSubscriptions();
  }

  @Get(':subscriptionId')
  @ApiOperation({
    summary: 'Get a specific webhook subscription',
    description: 'Returns details of a specific webhook subscription',
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'The subscription ID to retrieve',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subscription details',
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription not found',
  })
  getSubscription(@Param('subscriptionId') subscriptionId: string) {
    const subscription = this.webhookService.getSubscription(subscriptionId);
    if (!subscription) {
      return { error: 'Subscription not found', subscriptionId };
    }
    return subscription;
  }

  @Delete(':subscriptionId')
  @ApiOperation({
    summary: 'Unsubscribe from webhook notifications',
    description: 'Remove a webhook subscription by ID',
  })
  @ApiParam({
    name: 'subscriptionId',
    description: 'The subscription ID to remove',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subscription deleted successfully',
  })
  async unsubscribe(@Param('subscriptionId') subscriptionId: string) {
    this.logger.log(`Deleting webhook subscription: ${subscriptionId}`);
    return this.webhookService.deleteSubscription(subscriptionId);
  }
}
