// pix-webhook.module.ts

import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookGateway } from './webhook.gateway'; // Importe o WebSocket Gateway aqui, se necessário

@Module({
  controllers: [WebhookController],
  providers: [WebhookGateway], // Se o WebSocket Gateway precisar ser fornecido dentro deste módulo
})
export class PixWebhookModule {}
