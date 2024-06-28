/*
  Warnings:

  - Changed the type of `pricePerHour` on the `courts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `amount` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_extra_equipment_id_fkey";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "numberOfRackets" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "bookings" ALTER COLUMN "extra_equipment_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "courts" DROP COLUMN "pricePerHour";
ALTER TABLE "courts" ADD COLUMN     "pricePerHour" FLOAT8 NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "amount";
ALTER TABLE "payments" ADD COLUMN     "amount" FLOAT8 NOT NULL;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_extra_equipment_id_fkey" FOREIGN KEY ("extra_equipment_id") REFERENCES "extra_equipments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
