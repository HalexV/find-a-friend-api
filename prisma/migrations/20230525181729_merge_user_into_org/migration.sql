/*
  Warnings:

  - You are about to drop the column `user_id` on the `orgs` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `orgs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `orgs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `orgs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orgs" DROP CONSTRAINT "orgs_user_id_fkey";

-- DropIndex
DROP INDEX "orgs_user_id_key";

-- AlterTable
ALTER TABLE "orgs" DROP COLUMN "user_id",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password_hash" TEXT NOT NULL;

-- DropTable
DROP TABLE "users";

-- CreateIndex
CREATE UNIQUE INDEX "orgs_email_key" ON "orgs"("email");
