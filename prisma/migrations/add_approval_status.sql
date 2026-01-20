-- AlterTable
ALTER TABLE "User" ADD COLUMN "approvalStatus" TEXT NOT NULL DEFAULT 'APPROVED';

-- Update existing users to be approved
UPDATE "User" SET "approvalStatus" = 'APPROVED';
