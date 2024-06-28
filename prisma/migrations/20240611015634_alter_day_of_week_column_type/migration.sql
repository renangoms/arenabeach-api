/*
  Warnings:

  - Changed the type of `day_of_week` on the `schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "day_of_week" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "day_of_week";
ALTER TABLE "schedules" ADD COLUMN     "day_of_week" "day_of_week" NOT NULL;
