import { Injectable } from '@nestjs/common';
import { DayOfWeek, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class BookingsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.BookingCreateArgs) {
    return this.prismaService.booking.create(createDto);
  }

  findMany(findManyDto: Prisma.BookingFindManyArgs) {
    return this.prismaService.booking.findMany(findManyDto)
  }

  findByCorrelationId(correlationID: string): Promise<{id:string; startTime: number; endTime: number}[]> {
    return this.prismaService.$queryRaw`
      select b.id as id, bs.start_time as "startTime", bs.end_time as "endTime"  from booking_slots bs
      inner join bookings b 
        on b.id = bs.booking_id 
      inner join payments p 
        on p.booking_id = b.id 
      where p.external_charge_id = ${correlationID};`;
  }

  findByDate(date: Date, dayOfWeek: DayOfWeek) {
    return this.prismaService.$queryRaw(Prisma.sql`
      with calendary as (
        select 
            c.id as "courtId", 
            s.id as "scheduleId",
            s."day_of_week", 
            s.start_time as "startTime",
            s.end_time as "endTime",
            exists (
                select 1
                from bookings b
                inner join booking_slots bs on bs.booking_id = b.id and bs.schedule_id = s.id and bs.booking_date = ${date}
                inner join payments p on p.booking_id = b.id
                where b.court_id = c.id and (b.status = 'CONFIRMED' or p.expires_date > current_timestamp AT TIME ZONE 'UTC')
            ) as reservado
        from schedules s 
        cross join courts c 
        where s."day_of_week" = ${dayOfWeek}
      )
      select 
        "scheduleId",
        "courtId",
        "startTime",
        "endTime",
        "reservado"
      from calendary 
      order by "startTime", "courtId"

    `, []);
  }

  update(updateDto: Prisma.BookingUpdateArgs) {
    return this.prismaService.booking.update(updateDto)
  }
}
