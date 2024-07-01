import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.PaymentCreateArgs) {
    return this.prismaService.payment.create(createDto);
  }

  findFirst(findFirstDto: Prisma.PaymentFindFirstArgs) {
    return this.prismaService.payment.findFirst(findFirstDto);
  }
}
