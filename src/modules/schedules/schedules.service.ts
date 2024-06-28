import { ConflictException, Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import { SchedulesRepository } from 'src/shared/database/repositories/schedules.repositories';
import { CreateManySchedulesDto } from './dtos/create-many-schedules.dto';
import { UpdateScheduleDto } from './dtos/update-schedule.dto';

@Injectable()
export class SchedulesService {
    constructor(private readonly schedulesRepo: SchedulesRepository) {}

    create(createScheduleDto: CreateScheduleDto) {
        const { dayOfWeek, startTime, endTime } = createScheduleDto;

        return this.schedulesRepo.create({
            data: {
                dayOfWeek,
                startTime,
                endTime
            }
        });
    }

    createMany(createManySchedulesDto: CreateManySchedulesDto) {
        for (const schedule of createManySchedulesDto) {

            if (this.hasTimeOverlap(schedule, createManySchedulesDto)) {
                throw new ConflictException('Scheduling times are overlapping.')
            }
        }

        return this.schedulesRepo.createMany({
            data: createManySchedulesDto
        })
    }

    findAll() {
        return this.schedulesRepo.findMany({
            orderBy: { startTime: 'asc' }
        });
    }

    update(id: string, updateScheduleDto: UpdateScheduleDto) {
        const { dayOfWeek, startTime, endTime } = updateScheduleDto;

        return this.schedulesRepo.update({
            where: { id },
            data: {
                dayOfWeek,
                startTime,
                endTime
            }
        })
    }

    delete(id: string) {
        return this.schedulesRepo.delete(id);
    }

    private hasTimeOverlap(schedule: CreateScheduleDto, schedules: CreateScheduleDto[]): boolean {
        for (const otherSchedule of schedules) {
            // Ignora o próprio item ao comparar com outros itens
            if (schedule === otherSchedule) {
            continue;
            }

            // Verifica se há sobreposição de horários
            if (
            (schedule.startTime >= otherSchedule.startTime && schedule.startTime < otherSchedule.endTime) ||
            (schedule.endTime > otherSchedule.startTime && schedule.endTime <= otherSchedule.endTime) ||
            (otherSchedule.startTime >= schedule.startTime && otherSchedule.startTime < schedule.endTime) ||
            (otherSchedule.endTime > schedule.startTime && otherSchedule.endTime <= schedule.endTime)
            ) {
            return true; // Há sobreposição de horários
            }
        }

        return false; // Não há sobreposição de horários
    }
}
