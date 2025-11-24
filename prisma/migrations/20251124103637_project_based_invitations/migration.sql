/*
  Warnings:

  - A unique constraint covering the columns `[projectId,email]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/

-- Delete existing invitations (they were team-based, now switching to project-based)
DELETE FROM "Invitation";

-- DropIndex
DROP INDEX "Invitation_teamId_email_key";

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "projectId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Invitation_projectId_idx" ON "Invitation"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_projectId_email_key" ON "Invitation"("projectId", "email");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
