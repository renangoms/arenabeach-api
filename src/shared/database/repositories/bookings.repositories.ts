import { Injectable } from '@nestjs/common';
import { DayOfWeek, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

interface FindUniqueDtoArgs {
  date: Date;
  scheduleId: string;
  startTime: number;
  endTime: number;
  courtId: string;
}

@Injectable()
export class BookingsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.BookingCreateArgs) {
    return this.prismaService.booking.create(createDto);
  }

  findMany() {
    return this.prismaService.$queryRaw(Prisma.sql`
      select 
        b.id,
        (p.amount / 100) as amount,
        case 
          when b.status = 'PENDING' and p.expires_date > current_timestamp AT TIME ZONE 'UTC' 
            then 'PENDING'
          when b.status = 'PENDING' and p.expires_date < current_timestamp AT TIME ZONE 'UTC' 
            then 'EXPIRED'
          when b.status = 'CANCELED' then 'CANCELED'
          when b.status = 'CONFIRMED' then 'CONFIRMED'
        end as status,
        b.created_at,
        u.name,
        u.phone,
        u.email
        
      from bookings b 
      inner join users u 
        on u.id = b.user_id
      inner join payments p 
        on p.booking_id = b.id
      order by b.created_at desc
    `, []);
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

  async findByDate(date: Date, dayOfWeek: DayOfWeek) {
    return await this.prismaService.$queryRaw(Prisma.sql`
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
                where b.court_id = c.id and (b.status = 'CONFIRMED' or (p.expires_date > current_timestamp AT TIME ZONE 'UTC' and b.status != 'PENDING'))
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

  findUnique(findUniqueDto: FindUniqueDtoArgs): Promise<Array<any>> {
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
                inner join booking_slots bs on bs.booking_id = b.id and bs.schedule_id = s.id and bs.booking_date = ${findUniqueDto.date}
                inner join payments p on p.booking_id = b.id
                where b.court_id = c.id and (b.status = 'CONFIRMED' or (p.expires_date > current_timestamp AT TIME ZONE 'UTC' and b.status != 'PENDING'))
            ) as reservado
        from schedules s 
        cross join courts c 
        where s.id = ${findUniqueDto.scheduleId}
        and s.start_time = ${findUniqueDto.startTime}
        and s.end_time = ${findUniqueDto.endTime}
        and c.id = ${findUniqueDto.courtId}
      )
      select 
        "scheduleId",
        "courtId",
        "startTime",
        "endTime",
        "reservado"
      from calendary 
      where "reservado" = true
      order by "startTime", "courtId"

    `, []);
  }

  findOne(findUniqueDto: Prisma.BookingFindUniqueArgs) {
    return this.prismaService.booking.findUnique(findUniqueDto);
  }

  update(updateDto: Prisma.BookingUpdateArgs) {
    return this.prismaService.booking.update(updateDto)
  }
}
