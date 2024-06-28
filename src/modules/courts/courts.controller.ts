import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { IsPublic } from 'src/shared/decorators/IsPublic';

@Controller('courts')
export class CourtsController {
  constructor(private readonly courtsService: CourtsService) {}

  @Post()
  create(@Body() createCourtDto: CreateCourtDto) {
    return this.courtsService.create(createCourtDto);
  }

  @IsPublic()
  @Get()
  findAll() {
    return this.courtsService.findAll();
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courtsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCourtDto: UpdateCourtDto) {
    return this.courtsService.update(id, updateCourtDto);
  }
}
