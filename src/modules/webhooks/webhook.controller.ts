import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { CreateWebhookDto } from './dto/webhook-subscription.dto';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post('subscribe')
  @ApiOperation({
    summary: 'Subscribe to webhook notifications',
    description: 'Register a webhook URL to receive real-time liquidity alerts',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Webhook subscription created',
  })
  async subscribe(@Body() dto: CreateWebhookDto) {
    return this.webhookService.createSubscription(dto);
  }

  @Delete(':subscriptionId')
  @ApiOperation({ summary: 'Unsubscribe from webhook notifications' })
  async unsubscribe(@Param('subscriptionId') id: string) {
    return this.webhookService.deleteSubscription(id);
  }
}
