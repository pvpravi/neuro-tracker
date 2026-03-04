-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "patternLogicScore" INTEGER NOT NULL,
    "sensoryRegulationScore" INTEGER NOT NULL,
    "verbalExpressiveScore" INTEGER NOT NULL,
    "fineMotorScore" INTEGER NOT NULL,
    "ageGroup" TEXT,
    "questionnaireData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DietaryProfile" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "allergies" TEXT,
    "sensoryAversions" TEXT,
    "currentDiet" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DietaryProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationProfile" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "setting" TEXT,
    "hasIEP" BOOLEAN NOT NULL DEFAULT false,
    "learningStyle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OneYearPlan" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "proposedGoal" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "userFeedback" TEXT,
    "hiddenAiPlan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OneYearPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyCheckin" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "weekStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "progressNotes" TEXT,
    "dietAdherence" TEXT,
    "moodRating" INTEGER,
    "aiWeeklyStrategy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyCheckin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "DietaryProfile_childId_key" ON "DietaryProfile"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "EducationProfile_childId_key" ON "EducationProfile"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "OneYearPlan_childId_key" ON "OneYearPlan"("childId");

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DietaryProfile" ADD CONSTRAINT "DietaryProfile_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationProfile" ADD CONSTRAINT "EducationProfile_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OneYearPlan" ADD CONSTRAINT "OneYearPlan_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyCheckin" ADD CONSTRAINT "WeeklyCheckin_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
