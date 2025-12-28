/*
  Warnings:

  - You are about to drop the `OrderLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderLog" DROP CONSTRAINT "OrderLog_orderId_fkey";

-- DropTable
DROP TABLE "OrderLog";
