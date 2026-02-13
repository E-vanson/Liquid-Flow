import { Injectable, Logger } from '@nestjs/common';
import { CreateWebhookDto } from './dto/webhook-subscription.dto';
import axios from 'axios';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private subscriptions = new Map<string, CreateWebhookDto>();

  createSubscription(dto: CreateWebhookDto) {
    const id = this.generateId();
    this.subscriptions.set(id, dto);

    this.logger.log(`Webhook subscription created: ${id} for ${dto.eventType}`);

    return {
      subscriptionId: id,
      ...dto,
    };
  }

  deleteSubscription(id: string) {
    const deleted = this.subscriptions.delete(id);
    return { success: deleted };
  }

  async triggerWebhook(eventType: string, data: any) {
    const relevantSubs = Array.from(this.subscriptions.values()).filter(
      sub => sub.eventType === eventType,
    );

    for (const sub of relevantSubs) {
      try {
        await axios.post(sub.url, {
          event: eventType,
          data,
          timestamp: new Date(),
        }, {
          timeout: 5000,
        });

        this.logger.log(`Webhook triggered: ${sub.url}`);
      } catch (error) {
        this.logger.error(`Webhook failed for ${sub.url}: ${error.message}`);
      }
    }
  }

  private generateId(): string {
    return `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
