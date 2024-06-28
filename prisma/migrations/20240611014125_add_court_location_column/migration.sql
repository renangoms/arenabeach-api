/*
  Warnings:

  - Added the required column `location` to the `courts` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `pricePerHour` on the `courts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `price` on the `extra_equipments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `amount` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "courts" ADD COLUMN     "location" STRING NOT NULL;
ALTER TABLE "courts" DROP COLUMN "pricePerHour";
ALTER TABLE "courts" ADD COLUMN     "pricePerHour" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "extra_equipments" DROP COLUMN "price";
ALTER TABLE "extra_equipments" ADD COLUMN     "price" FLOAT8 NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "amount";
ALTER TABLE "payments" ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL;
