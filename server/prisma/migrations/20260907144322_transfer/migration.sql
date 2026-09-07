/*
  Warnings:

  - Added the required column `status` to the `transfer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('Processing', 'Success', 'Failed');

-- AlterTable
ALTER TABLE "transfer" ADD COLUMN     "status" "TransferStatus" NOT NULL;
