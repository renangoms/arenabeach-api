import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CourtsModule } from './modules/courts/courts.module';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PixWebhookModule } from './modules/webhook/webhook.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    CourtsModule,
    UsersModule,
    SchedulesModule,
    BookingsModule,
    PixWebhookModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
})
export class AppModule {}
