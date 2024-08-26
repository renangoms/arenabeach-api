export class CreateBookingDto {
    courtId: string;
    numberOfRackets: number;
    amount: number;
    bookingSlots: {
        scheduleId: string;
        bookingDate: string;
        startTime: number;
        endTime: number;
    } [];
    userName: string;
    userEmail: string;
    userPhone: string;
    customerName?: string;
}
