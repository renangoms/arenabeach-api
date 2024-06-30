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

  async createManually(createBookingDto: CreateBookingDto, userId: string) {
    const { 
      courtId, 
      numberOfRackets, 
      bookingSlots, 
      userEmail,
      userPhone,
      userName,
      amount,
     } = createBookingDto;

     const bookingSlotsData = await Promise.all(
      bookingSlots.map(async booking => {
        const isReserved = await this.bookingsRepo.findUnique({
          courtId: courtId,
          date: TransformDate(booking.bookingDate),
          startTime: booking.startTime,
          endTime: booking.endTime,
          scheduleId: booking.scheduleId,
        });

        if (isReserved.length > 0) {
          throw new ConflictException();
        }
    
        return {
          bookingDate: new Date(booking.bookingDate),
          startTime: booking.startTime,
          endTIme: booking.endTime,
          scheduleId: booking.scheduleId,
        };
      })
    );

    const booking = await this.bookingsRepo.create({
      data: {
        courtId,
        status: 'CONFIRMED',
        numberOfRackets,
        userId: userId,
        bookingSlots: {
          createMany: {
            data: bookingSlotsData
          }
        },
        
      },
    });

    const chargeBody = {
      correlationID: randomUUID(),
      customer: {
        name: userName,
        email: userEmail,
        phone: userPhone,
      },
      value: amount,
      type: 'DYNAMIC',
      comment: 'Cobrança referente a reserva',
      expiresIn: Number(env.chargeExpiresIn) ?? 300,
      additionalInfo: [
        {
          key: 'Product',
          value: 'Reserva'
        }
      ]
    }

    
    await this.paymentsRepo.create({
      data: {
        amount: amount,
        expiresDate: new Date(),
        externalChargeId: chargeBody.correlationID,
        bookingId: booking.id,
        status: 'CONFIRMED',
        confirmedAt: booking.createdAt
      }
    });

    return {
      correlationId: chargeBody.correlationID,
      value: amount,
      brCode: null,
      qrCodeImage: null,
      expiresDate: null,
      expiresIn: null
    };
  }

  async update(id: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELED') {
    await this.bookingsRepo.update({
      where: { id: id },
      data: {
        status: status
      }
    })

    return { ok: true };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}
