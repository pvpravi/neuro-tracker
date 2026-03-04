/*
  Warnings:

  - Added the required column `updatedAt` to the `WeeklyCheckin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekNumber` to the `WeeklyCheckin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "specialCareReport" TEXT;

-- AlterTable
ALTER TABLE "OneYearPlan" ADD COLUMN     "publishedGoal" TEXT;

-- AlterTable
ALTER TABLE "WeeklyCheckin" ADD COLUMN     "aiInference" TEXT,
ADD COLUMN     "aiRecommendations" TEXT,
ADD COLUMN     "challengesFaced" TEXT,
ADD COLUMN     "parentObservations" TEXT,
ADD COLUMN     "progressScore" DOUBLE PRECISION,
ADD COLUMN     "tasksCompleted" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "weekNumber" INTEGER NOT NULL,
ADD COLUMN     "weeklyTasks" JSONB;
