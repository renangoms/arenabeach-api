import { Injectable } from '@nestjs/common';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { CourtsRepository } from 'src/shared/database/repositories/courts.repositories';

@Injectable()
export class CourtsService {
  constructor(
    private readonly courtsRepo: CourtsRepository
  ) {}

  create(createCourtDto: CreateCourtDto) {
    const { name, location, pricePerHour, avaiability } = createCourtDto;

    return this.courtsRepo.create({
      data: { name, location, pricePerHour, avaiability }
    });
  }

  findAll() {
    return this.courtsRepo.findMany({ orderBy: { name: 'asc' } });
  }

  findOne(id: string) {
    return this.courtsRepo.findFirst({
      where: { id }
    });
  }

  update(id: string, updateCourtDto: UpdateCourtDto) {
    const { name, location, pricePerHour, avaiability } = updateCourtDto;

    return this.courtsRepo.update({
      where: { id },
      data: {
        name,
        location,
        pricePerHour,
        avaiability
      }
    })
  }
}
