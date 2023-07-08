-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('RESIDENT', 'ADMIN', 'SECURITY');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdById" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'RESIDENT',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "canCreatePasses" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GatePass" (
    "id" TEXT NOT NULL,
    "generatedByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "allowMultipleUses" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GatePass_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GatePass_id_key" ON "GatePass"("id");

-- AddForeignKey
ALTER TABLE "GatePass" ADD CONSTRAINT "GatePass_generatedByUserId_fkey" FOREIGN KEY ("generatedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
