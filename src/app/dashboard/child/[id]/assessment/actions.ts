"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { assessmentQuestionsByAge, DOMAINS } from "@/lib/assessment-data";

export async function processAssessment(childId: string, selectedAge: string, answers: Record<number, number>, formData: FormData) {
  const domainTotals: Record<string, { sum: number; count: number }> = {};
  const activeQuestions = assessmentQuestionsByAge[selectedAge] || [];

  // Collect answers by domain
  activeQuestions.forEach((q) => {
    if (answers[q.id] !== undefined) {
      if (!domainTotals[q.domain]) domainTotals[q.domain] = { sum: 0, count: 0 };
      domainTotals[q.domain].sum += answers[q.id];
      domainTotals[q.domain].count += 1;
    }
  });

  // Deterministic scoring engine: 
  // Each question is 0-4, 5 questions per domain = max 20 per domain
  // Normalize to 0-10 scale: (sum / 20) * 10 = sum / 2
  const calculateScore = (domainKey: string): number => {
    const data = domainTotals[domainKey];
    if (!data || data.count === 0) return 0;
    // Max possible sum is 20 (5 questions × 4 points each)
    // Normalize to 0-10 scale
    return Number((data.sum / 2).toFixed(2));
  };

  await prisma.assessment.create({
    data: {
      childId: childId,
      ageGroup: selectedAge,
      questionnaireData: answers,
      
      // 8 Core Domains (0-10 scale)
      patternLogicScore: calculateScore(DOMAINS.PATTERN_LOGIC),
      spatialConstructiveScore: calculateScore(DOMAINS.SPATIAL_CONSTRUCTIVE),
      sensoryRegulationScore: calculateScore(DOMAINS.SENSORY_REGULATION),
      repetitiveComfortScore: calculateScore(DOMAINS.REPETITIVE_COMFORT),
      taskPersistenceScore: calculateScore(DOMAINS.TASK_PERSISTENCE),
      verbalExpressiveScore: calculateScore(DOMAINS.VERBAL_EXPRESSIVE),
      transitionAdaptabilityScore: calculateScore(DOMAINS.TRANSITION_ADAPTABILITY),
      fineMotorScore: calculateScore(DOMAINS.FINE_MOTOR),
      
      // Optional supplementary fields
      glpCommunication: formData.get("glpCommunication") as string || null,
      socialEngagement: formData.get("socialEngagement") as string || null,
      learningModality: formData.get("learningModality") as string || null,
      motorFatigue: formData.get("motorFatigue") as string || null,
      readingProcessing: formData.get("readingProcessing") as string || null,
      routineDistress: formData.get("routineDistress") as string || null,
      dietaryProfile: formData.get("dietaryProfile") as string || null,
    }
  });

  redirect(`/dashboard/child/${childId}`);
}
