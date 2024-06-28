-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_user_id_fkey";

-- CreateTable
CREATE TABLE "booking_slots" (
    "id" UUID NOT NULL,
    "schedule_id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "booking_date" TIMESTAMP(3) NOT NULL,
    "start_time" INT4 NOT NULL,
    "end_time" INT4 NOT NULL,

    CONSTRAINT "booking_slots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_court_id_fkey" FOREIGN KEY ("court_id") REFERENCES "courts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_slots" ADD CONSTRAINT "booking_slots_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_slots" ADD CONSTRAINT "booking_slots_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
