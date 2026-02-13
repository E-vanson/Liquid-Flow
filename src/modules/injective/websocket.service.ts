import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Subject, Observable } from 'rxjs';
import { IndexerGrpcSpotStream } from '@injectivelabs/sdk-ts';
import { getNetworkEndpoints, Network } from '@injectivelabs/networks';

export interface OrderbookStreamData {
  marketId: string;
  orderbook: any;
  timestamp: Date;
}

@Injectable()
export class WebSocketService implements OnModuleInit {
  private readonly logger = new Logger(WebSocketService.name);
  private spotStream: IndexerGrpcSpotStream;
  private orderbookSubject = new Subject<OrderbookStreamData>();

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    const networkType = this.config.get('INJECTIVE_NETWORK') || 'testnet';
    const network = networkType === 'mainnet' ? Network.Mainnet : Network.Testnet;
    const endpoints = getNetworkEndpoints(network);

    this.spotStream = new IndexerGrpcSpotStream(endpoints.indexer);
    this.logger.log('WebSocket service initialized');
  }

  /**
   * Subscribe to orderbook updates for specific markets
   */
  subscribeToOrderbooks(marketIds: string[]) {
    const streamFn = this.spotStream.streamOrderbooksV2.bind(this.spotStream);

    const subscription = streamFn({
      marketIds,
      callback: (orderbookUpdate: any) => {
        this.orderbookSubject.next({
          marketId: orderbookUpdate.marketId,
          orderbook: orderbookUpdate,
          timestamp: new Date(),
        });
      },
      onEndCallback: () => {
        this.logger.warn('Orderbook stream completed');
      },
      onStatusCallback: (status: any) => {
        this.logger.error(`Orderbook stream error: ${JSON.stringify(status)}`);
      },
    });

    this.logger.log(`Subscribed to orderbooks: ${marketIds.join(', ')}`);
    
    return subscription;
  }

  /**
   * Get observable for orderbook updates
   */
  getOrderbookStream(): Observable<OrderbookStreamData> {
    return this.orderbookSubject.asObservable();
  }
}
