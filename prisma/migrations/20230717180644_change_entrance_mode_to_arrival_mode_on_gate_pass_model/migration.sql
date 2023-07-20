/*
  Warnings:

  - You are about to drop the column `entranceMode` on the `GatePass` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GuestArrivalMode" AS ENUM ('NoVehicle', 'Vehicle', 'Unknown');

-- AlterTable
ALTER TABLE "GatePass" DROP COLUMN "entranceMode",
ADD COLUMN     "arrivalMode" "GuestArrivalMode" DEFAULT 'Unknown';

-- DropEnum
DROP TYPE "GuestEntranceMode";
