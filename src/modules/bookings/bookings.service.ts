import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingsRepository } from 'src/shared/database/repositories/bookings.repositories';
import { HttpService } from '@nestjs/axios';
import { randomUUID } from 'crypto';
import { ReturnDayOfWeek } from 'src/shared/utils/ReturnDayOfWeek';
import { env } from 'src/shared/config/env';
import { MailService } from '../mail/mail.service';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { PaymentsRepository } from 'src/shared/database/repositories/payments.repositories';
import { convertSecondsToHHMM } from 'src/shared/utils/convertSecondsToHour';
import { TransformDate } from 'src/shared/utils/transformDate';

interface ChargeReturn {
  charge: {
    correlationID: string,
    value: string,
    expiresIn: number,
    expiresDate: Date;
    brCode: string;
    qrCodeImage: string;
    pixKey: string;
    paymentLinkUrl: string;
  }
}

interface ChargeVerifyReturn {
  charge: {
    correlationID: string,
    status: string,
  }
}

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingsRepo: BookingsRepository,
    private readonly usersRepo: UsersRepository,
    private readonly paymentsRepo: PaymentsRepository,
    private readonly httpService: HttpService,
    private readonly mailService: MailService,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string) {
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
          status: 'PENDING',
          numberOfRackets,
          userId: userId,
          customerName: userName,
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

      // IF BOOKED SUCCESS, CREATE GENERATE FOR USER
      const { data } = await this.httpService.axiosRef.post<ChargeReturn>(
        'https://api.openpix.com.br/api/v1/charge',
        chargeBody,
        {
          headers: {
            Authorization: env.paymentAuthToken
          }
        }
      );

      await this.paymentsRepo.create({
        data: {
          amount: amount,
          expiresDate: data.charge.expiresDate,
          externalChargeId: data.charge.correlationID,
          bookingId: booking.id,
          status: 'PENDING',
          confirmedAt: booking.createdAt
        }
      });

      return {
        correlationId: data.charge.correlationID,
        value: amount,
        brCode: data.charge.brCode,
        qrCodeImage: data.charge.qrCodeImage,
        expiresDate: data.charge.expiresDate,
        expiresIn: data.charge.expiresIn
      };
  }

  findAll() {
    return this.bookingsRepo.findMany();
  }

  async findByDate(date: Date) {
    return await this.bookingsRepo.findByDate(date, ReturnDayOfWeek(date));
  }

  async findUnique(id: string) {
    return await this.bookingsRepo.findOne({
      where: { id: id },
      select: {
        court: {
          select: {
            name: true
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        bookingSlots: {
          select: {
            startTime: true,
            endTIme: true,
            bookingDate: true,
          }
        },
        payments: {
          select: {
            amount: true
          }
        }
      }
    });
  }

  async verifyPayment(correlationID: string, userId: string) {
    const { data } = await this.httpService.axiosRef.get<ChargeVerifyReturn>(
      `https://api.openpix.com.br/api/v1/charge/${correlationID}`,
      {
        headers: {
          Authorization: env.paymentAuthToken
        }
      }
    );

    if (data.charge.status === 'COMPLETED') {
      const user = await this.usersRepo.findUnique({
        where: {
          id: userId,
        }
      });

      const booking = await this.bookingsRepo.findByCorrelationId(correlationID);

      await this.bookingsRepo.update({
        data: {
          status: 'CONFIRMED',
        },
        where: {
          id: booking[0].id
        }
      })

      const schedules = booking.map(b => convertSecondsToHHMM(b.startTime)).join(' / ');

      const msg = `
        <p>Olá ${user.name},</p>
        <p>Sua reserva foi confirmada em nosso sistema!</p>
        <p>Horários reservados: </p>
        <p>${schedules}</p>
      `;
  
      await this.mailService.send({ to: user.email, msg: msg, subject: 'Reserva Confirmada - Arena Beach One', isRecoverPass: false });

      return { status: 'CONFIRMED'}
    }

    return { status: 'PENDING' };
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
      customerName
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
        customerName: customerName ?? userName,
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

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
