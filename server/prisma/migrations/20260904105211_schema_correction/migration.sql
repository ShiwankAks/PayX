/*
  Warnings:

  - The values [Sucess] on the enum `OnRampStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OnRampStatus_new" AS ENUM ('Success', 'Failure', 'Processing');
ALTER TABLE "OnRampTransaction" ALTER COLUMN "status" TYPE "OnRampStatus_new" USING ("status"::text::"OnRampStatus_new");
ALTER TYPE "OnRampStatus" RENAME TO "OnRampStatus_old";
ALTER TYPE "OnRampStatus_new" RENAME TO "OnRampStatus";
DROP TYPE "public"."OnRampStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "OnRampTransaction" ADD CONSTRAINT "OnRampTransaction_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "OnRampTransaction_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "username" TEXT NOT NULL;
