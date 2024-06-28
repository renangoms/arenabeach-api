/*
  Warnings:

  - Added the required column `pricePerHour` to the `courts` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `amount` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "courts" ADD COLUMN     "pricePerHour" FLOAT8 NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "amount";
ALTER TABLE "payments" ADD COLUMN     "amount" FLOAT8 NOT NULL;
