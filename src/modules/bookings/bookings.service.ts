import { Injectable } from '@nestjs/common';
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
    try {
      const { 
        courtId, 
        numberOfRackets, 
        amount, 
        bookingSlots, 
        userEmail,
        userPhone,
        userName,
       } = createBookingDto;

      const bookingSlotsData = bookingSlots.map(booking => {
        return ({
          bookingDate: new Date(booking.bookingDate),
          startTime: booking.startTime,
          endTIme: booking.endTime,
          scheduleId: booking.scheduleId,
        })
      })

      const booking = await this.bookingsRepo.create({
        data: {
          courtId,
          status: 'PENDING',
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

      // IF BOOKED SUCCESS, CREATE GENERATE FOR USER
      const { data } = await this.httpService.axiosRef.post<ChargeReturn>(
        'https://api.openpix.com.br/api/v1/charge',
        chargeBody,
        {
          headers: {
            Authorization: 'Q2xpZW50X0lkXzQzZGQ4NWRiLTZmMTQtNGRiNy1iYzhiLTQwOGJlNWU3NDNjZDpDbGllbnRfU2VjcmV0X0RYVDVNVWpuMUQ3WUVFKzV2TnZLUlZaY0RwS1B2anJzM0JicEtlakc3R1k9'
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
        value: data.charge.value,
        brCode: data.charge.brCode,
        qrCodeImage: data.charge.qrCodeImage,
        expiresDate: data.charge.expiresDate,
        expiresIn: data.charge.expiresIn
      };
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return `This action returns all bookings`;
  }

  findByDate(date: Date) {
    return this.bookingsRepo.findByDate(date, ReturnDayOfWeek(date));
  }

  async verifyPayment(correlationID: string, userId: string) {
    const { data } = await this.httpService.axiosRef.get<ChargeVerifyReturn>(
      `https://api.openpix.com.br/api/v1/charge/${correlationID}`,
      {
        headers: {
          Authorization: 'Q2xpZW50X0lkXzQzZGQ4NWRiLTZmMTQtNGRiNy1iYzhiLTQwOGJlNWU3NDNjZDpDbGllbnRfU2VjcmV0X0RYVDVNVWpuMUQ3WUVFKzV2TnZLUlZaY0RwS1B2anJzM0JicEtlakc3R1k9'
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

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
