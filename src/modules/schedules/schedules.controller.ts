import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import { CreateManySchedulesDto } from './dtos/create-many-schedules.dto';
import { UpdateScheduleDto } from './dtos/update-schedule.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  create(@Body() createCourtDto: CreateScheduleDto) {
    return this.schedulesService.create(createCourtDto);
  }

  @Post('/bulk')
  createMany(@Body() createManySchedulesDto: CreateManySchedulesDto) {
    return this.schedulesService.createMany(createManySchedulesDto);
  }

  @Get()
  findAll() {
    return this.schedulesService.findAll();
  }

  @Put(':id') 
  update(
    @Param('id') id: string, updateScheduleDto: UpdateScheduleDto
  ) {
    return this.schedulesService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.delete(id);
  }
}
