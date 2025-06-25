/*
  Warnings:

  - You are about to drop the column `timestamp` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `date` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empName` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventType` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "timestamp",
DROP COLUMN "type",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "empName" TEXT NOT NULL,
ADD COLUMN     "eventType" TEXT NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL;
