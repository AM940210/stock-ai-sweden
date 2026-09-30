/*
  Warnings:

  - You are about to drop the column `operatigIncome` on the `IncomeStatement` table. All the data in the column will be lost.
  - Added the required column `operatingIncome` to the `IncomeStatement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IncomeStatement" DROP COLUMN "operatigIncome",
ADD COLUMN     "operatingIncome" DOUBLE PRECISION NOT NULL;
