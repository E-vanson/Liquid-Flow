import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateWebhookDto, WebhookEventType } from './dto/webhook-subscription.dto';
import axios from 'axios';
import * as crypto from 'crypto';

export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: Date;
  signature?: string;
}

interface StoredSubscription extends CreateWebhookDto {
  createdAt: Date;
}

@Injectable()
export class WebhookService implements OnModuleInit {
  private readonly logger = new Logger(WebhookService.name);
  private subscriptions = new Map<string, StoredSubscription>();
  private webhookSecret: string = '';

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.webhookSecret = this.configService.get<string>('WEBHOOK_SECRET') || 'default-webhook-secret';
    this.logger.log('Webhook service initialized');
  }

  createSubscription(dto: CreateWebhookDto) {
    const id = this.generateId();
    this.subscriptions.set(id, {
      ...dto,
      createdAt: new Date(),
    });

    this.logger.log(`Webhook subscription created: ${id} for ${dto.eventType}`);

    return {
      subscriptionId: id,
      ...dto,
      createdAt: new Date(),
    };
  }

  deleteSubscription(id: string) {
    const deleted = this.subscriptions.delete(id);
    if (deleted) {
      this.logger.log(`Webhook subscription deleted: ${id}`);
    }
    return { success: deleted };
  }

  getSubscriptions(): any[] {
    return Array.from(this.subscriptions.entries()).map(([id, sub]) => ({
      subscriptionId: id,
      ...sub,
    }));
  }

  getSubscription(id: string): any {
    const sub = this.subscriptions.get(id);
    if (!sub) return null;
    return {
      subscriptionId: id,
      ...sub,
    };
  }

  async triggerWebhook(eventType: WebhookEventType, data: any): Promise<void> {
    const eventTypeStr = eventType.toString();
    const relevantSubs = Array.from(this.subscriptions.entries()).filter(
      ([_, sub]) => sub.eventType === eventTypeStr,
    );

    if (relevantSubs.length === 0) {
      this.logger.debug(`No subscriptions found for event: ${eventType}`);
      return;
    }

    this.logger.log(`Triggering ${eventType} webhooks to ${relevantSubs.length} subscribers`);

    for (const [id, sub] of relevantSubs) {
      try {
        const payload = this.createPayload(eventType, data);
        const headers = this.createHeaders(payload);

        await axios.post(sub.url, payload, {
          headers,
          timeout: 10000,
        });

        this.logger.log(`Webhook delivered to ${sub.url} (subscription: ${id})`);
      } catch (error: any) {
        this.logger.error(`Webhook failed for ${sub.url}: ${error.message}`);
        
        // Optionally: implement retry logic or dead letter queue here
        if (error.response?.status === 410) {
          // Subscription gone - remove it
          this.subscriptions.delete(id);
          this.logger.warn(`Removed stale webhook subscription: ${id}`);
        }
      }
    }
  }

  private createPayload(event: WebhookEventType, data: any): WebhookPayload {
    const eventStr = event.toString();
    const payload: WebhookPayload = {
      event: eventStr,
      data,
      timestamp: new Date(),
    };

    // Generate HMAC signature for payload verification
    if (this.webhookSecret && this.webhookSecret !== 'your-webhook-secret') {
      const signature = this.generateSignature(payload);
      payload.signature = signature;
    }

    return payload;
  }

  private createHeaders(payload: WebhookPayload): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Webhook-Event': payload.event,
      'X-Webhook-Timestamp': payload.timestamp.toISOString(),
    };

    if (payload.signature) {
      headers['X-Webhook-Signature'] = payload.signature;
    }

    return headers;
  }

  /**
   * Generate HMAC-SHA256 signature for webhook payload
   * This allows receivers to verify the authenticity of the webhook
   */
  private generateSignature(payload: WebhookPayload): string {
    const timestamp = Math.floor(payload.timestamp.getTime() / 1000);
    const payloadString = JSON.stringify({
      event: payload.event,
      data: payload.data,
      timestamp: payload.timestamp.toISOString(),
    });

    const signaturePayload = `${timestamp}.${payloadString}`;
    const signature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(signaturePayload)
      .digest('hex');

    return `t=${timestamp},v1=${signature}`;
  }

  /**
   * Verify a webhook signature (for receivers to use)
   * Example usage in your webhook receiver:
   * 
   * const isValid = WebhookService.verifySignature(
   *   payload, 
   *   signatureHeader, 
   *   webhookSecret
   * );
   */
  static verifySignature(
    payload: any,
    signatureHeader: string,
    secret: string,
  ): boolean {
    try {
      // Parse signature header: t=timestamp,v1=signature
      const parts = signatureHeader.split(',');
      const timestampPart = parts.find(p => p.startsWith('t='));
      const signaturePart = parts.find(p => p.startsWith('v1='));

      if (!timestampPart || !signaturePart) {
        return false;
      }

      const timestamp = timestampPart.replace('t=', '');
      const expectedSignature = signaturePart.replace('v1=', '');

      const payloadString = JSON.stringify({
        event: payload.event,
        data: payload.data,
        timestamp: payload.timestamp,
      });

      const signaturePayload = `${timestamp}.${payloadString}`;
      const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(signaturePayload)
        .digest('hex');

      // Use timing-safe comparison to prevent timing attacks
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(computedSignature),
      );
    } catch {
      return false;
    }
  }

  private generateId(): string {
    return `wh_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}
