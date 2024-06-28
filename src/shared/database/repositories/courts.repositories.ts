import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class CourtsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.CourtCreateArgs) {
    return this.prismaService.court.create(createDto);
  }

  findMany(findManyDto: Prisma.CourtFindManyArgs) {
    return this.prismaService.court.findMany(findManyDto)
  }

  findFirst(findFirst: Prisma.CourtFindFirstArgs) {
    return this.prismaService.court.findFirst(findFirst)
  }

  update(updateDto: Prisma.CourtUpdateArgs) {
    return this.prismaService.court.update(updateDto)
  }
}