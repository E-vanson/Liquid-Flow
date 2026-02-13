import { Module } from '@nestjs/common';
import { InjectiveService } from './injective.service';
import { WebSocketService } from './websocket.service';

@Module({
  providers: [InjectiveService, WebSocketService],
  exports: [InjectiveService, WebSocketService],
})
export class InjectiveModule {}
