import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersRepository } from './repositories/users.repositories';
import { CourtsRepository } from './repositories/courts.repositories';
import { SchedulesRepository } from './repositories/schedules.repositories';
import { BookingsRepository } from './repositories/bookings.repositories';
import { PaymentsRepository } from './repositories/payments.repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    CourtsRepository,
    SchedulesRepository,
    BookingsRepository,
    PaymentsRepository
  ],
  exports: [
    UsersRepository,
    CourtsRepository,
    SchedulesRepository,
    BookingsRepository,
    PaymentsRepository
  ],
})
export class DatabaseModule {}