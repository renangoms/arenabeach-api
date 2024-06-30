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
    const dateString = searchDate + 'T00:00:00.000Z';
    const data = new Date(dateString);

    console.log('##VAI PESQUISAR');
    console.log(data);

    return this.bookingsService.findByDate(data);
  }
  
  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @ActiveUserId() userId: string) {
    return this.bookingsService.create(createBookingDto, userId);
  }

  @Post('/manually')
    createManually(@Body() createBookingDto: CreateBookingDto, @ActiveUserId() userId: string) {
    return this.bookingsService.createManually(createBookingDto, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: {status: 'PENDING' | 'CONFIRMED' | 'CANCELED'}) {
    return this.bookingsService.update(id, body.status);
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
