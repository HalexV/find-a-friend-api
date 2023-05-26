/*
  Warnings:

  - You are about to drop the `AdoptionRequirements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AdoptionRequirementsToPet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdoptionRequirements" DROP CONSTRAINT "AdoptionRequirements_org_id_fkey";

-- DropForeignKey
ALTER TABLE "_AdoptionRequirementsToPet" DROP CONSTRAINT "_AdoptionRequirementsToPet_A_fkey";

-- DropForeignKey
ALTER TABLE "_AdoptionRequirementsToPet" DROP CONSTRAINT "_AdoptionRequirementsToPet_B_fkey";

-- DropTable
DROP TABLE "AdoptionRequirements";

-- DropTable
DROP TABLE "_AdoptionRequirementsToPet";

-- CreateTable
CREATE TABLE "adoption_requirements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "org_id" TEXT NOT NULL,

    CONSTRAINT "adoption_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AdoptionRequirementToPet" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AdoptionRequirementToPet_AB_unique" ON "_AdoptionRequirementToPet"("A", "B");

-- CreateIndex
CREATE INDEX "_AdoptionRequirementToPet_B_index" ON "_AdoptionRequirementToPet"("B");

-- AddForeignKey
ALTER TABLE "adoption_requirements" ADD CONSTRAINT "adoption_requirements_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "orgs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdoptionRequirementToPet" ADD CONSTRAINT "_AdoptionRequirementToPet_A_fkey" FOREIGN KEY ("A") REFERENCES "adoption_requirements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdoptionRequirementToPet" ADD CONSTRAINT "_AdoptionRequirementToPet_B_fkey" FOREIGN KEY ("B") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
