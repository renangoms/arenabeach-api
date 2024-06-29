import { Body, Controller, Get, Post } from '@nestjs/common';
import { WebhookGateway } from './webhook.gateway';
import { IsPublic } from 'src/shared/decorators/IsPublic';

@Controller()
export class WebhookController {
  constructor(private readonly webhookGateway: WebhookGateway) {}

  @IsPublic()
  @Post('pix-webhook')
  webhook(@Body() data: any) {
    console.log(data);

    if (data.pix) {
      const userEmail = data.pix.charge.customer.email;
      const event = 'webhook';
      this.webhookGateway.broadcast(event, data, userEmail);
    }

    return { Ok: true };
  }
}
