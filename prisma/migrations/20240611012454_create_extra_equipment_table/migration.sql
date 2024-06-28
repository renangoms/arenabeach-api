/*
  Warnings:

  - Added the required column `extra_equipment_id` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "extra_equipment_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "extra_equipments" (
    "id" UUID NOT NULL,
    "name" STRING NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "extra_equipments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_extra_equipment_id_fkey" FOREIGN KEY ("extra_equipment_id") REFERENCES "extra_equipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
