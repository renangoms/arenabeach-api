import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { IsPublic } from 'src/shared/decorators/IsPublic';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}
  
  @IsPublic()
  @Get('/date/:searchDate')
  findOne(
    @Param('searchDate') searchDate: string) 
  {
    return this.bookingsService.findByDate(new Date(searchDate));
  }
  
  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @ActiveUserId() userId: string) {
    return this.bookingsService.create(createBookingDto, userId);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }
  @Get('/payment/:id')
  verifyPayment(
    @Param('id') id: string,
    @ActiveUserId() userId: string,
) {
    return this.bookingsService.verifyPayment(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}
