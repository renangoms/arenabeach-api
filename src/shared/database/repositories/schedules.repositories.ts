import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class SchedulesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.ScheduleCreateArgs) {
    return this.prismaService.schedule.create(createDto);
  }

  createMany(createManyDto: Prisma.ScheduleCreateManyArgs) {
    return this.prismaService.schedule.createMany(createManyDto);
  }

  findMany(findManyDto: Prisma.ScheduleFindManyArgs) {
    return this.prismaService.schedule.findMany(findManyDto)
  }

  update(updateDto: Prisma.ScheduleUpdateArgs) {
    return this.prismaService.schedule.update(updateDto)
  }

  delete(id: string) {
    return this.prismaService.schedule.delete({ where: { id } });
  }
}