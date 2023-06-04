/*
  Warnings:

  - You are about to drop the column `email` on the `Auth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[login]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Auth_email_key";

-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "email",
ADD COLUMN     "login" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Auth_login_key" ON "Auth"("login");
