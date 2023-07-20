-- CreateEnum
CREATE TYPE "GuestEntranceMode" AS ENUM ('NoVehicle', 'Vehicle', 'Unknown');

-- AlterTable
ALTER TABLE "GatePass" ADD COLUMN     "entranceMode" "GuestEntranceMode" DEFAULT 'Unknown',
ADD COLUMN     "guestName" TEXT;
