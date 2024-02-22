/*
  Warnings:

  - The values [OUTPUT] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('UNPROCESSED', 'SPLIT', 'TRANSCRIBED', 'SUMMARISED', 'COMPLETED');
ALTER TABLE "Project" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Project" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Project" ALTER COLUMN "status" SET DEFAULT 'UNPROCESSED';
COMMIT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "hasSlides" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slides" TEXT,
ADD COLUMN     "video" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "data" DROP NOT NULL;
