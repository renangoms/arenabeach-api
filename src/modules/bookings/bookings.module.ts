import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { HttpModule } from '@nestjs/axios';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    HttpModule,
    MailModule
],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
