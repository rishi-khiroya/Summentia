-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "customisation" JSONB DEFAULT {'summaryLevel': 2, 'questions': 'false'};
