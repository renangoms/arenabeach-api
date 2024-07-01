import { Body, Controller, Get, Post } from '@nestjs/common';
import { WebhookGateway } from './webhook.gateway';
import { IsPublic } from 'src/shared/decorators/IsPublic';

@Controller()
export class WebhookController {
  constructor(private readonly webhookGateway: WebhookGateway) {}

  @IsPublic()
  @Post('pix-webhook')
  async webhook(@Body() data: any) {
    console.log('## Pagou');
    console.log(data);
    if (data.pix) {
      const paymentRef = await this.paymentsRepo.findFirst({
        where: {
          externalChargeId: data.pix.charge.correlationID
        }
      });

      await this.bookingsRepo.update({
        where: {
          id: paymentRef.bookingId,
        },
        data: {
          status: 'CONFIRMED'
        }
      });

      const userEmail = data.pix.charge.customer.email;
      const event = 'webhook';
      this.webhookGateway.broadcast(event, data, userEmail);
    }

    return { ok: true };
  }
}
