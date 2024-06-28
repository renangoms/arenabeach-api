-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED', 'REFUNDED');

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "amount" FLOAT8 NOT NULL,
    "external_charge_id" UUID NOT NULL,
    "expires_date" TIMESTAMP(3) NOT NULL,
    "status" "payment_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
