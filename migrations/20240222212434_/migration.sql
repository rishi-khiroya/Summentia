/*
  Warnings:

  - Made the column `slides` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "slides" SET NOT NULL,
ALTER COLUMN "slides" SET DEFAULT '';
