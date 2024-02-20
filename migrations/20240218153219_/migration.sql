/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `transcript` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Project` table. All the data in the column will be lost.
  - Made the column `date` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('UNPROCESSED', 'SPLIT', 'TRANSCRIBED', 'SUMMARISED', 'OUTPUT', 'COMPLETED');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "audioUrl",
DROP COLUMN "summary",
DROP COLUMN "transcript",
DROP COLUMN "videoUrl",
ADD COLUMN     "data" JSONB NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'UNPROCESSED',
ADD COLUMN     "waiting" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "date" SET NOT NULL;
