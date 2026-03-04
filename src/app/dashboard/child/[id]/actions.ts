"use server"; // <-- THIS MUST BE LINE 1

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateAIProfile(formData: FormData) {
  const childId = formData.get("childId") as string;

  const child = await prisma.child.findUnique({
    where: { id: childId },
    include: {
      assessments: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!child || !child.assessments[0]) {
    throw new Error("No assessment data found to analyze.");
  }

  const assessment = child.assessments[0];

  const prompt = `
    Analyze the following neuro-developmental data for ${child.name} (Age: ${child.age}):
    - Pattern & Logic: ${assessment.patternLogicScore}%
    - Sensory Regulation: ${assessment.sensoryRegulationScore}%
    - Verbal Expressive: ${assessment.verbalExpressiveScore}%
    - Fine Motor: ${assessment.fineMotorScore}%

    Provide a professional, neuro-affirming 'Special Care's Clinical Report'. 
    Focus on strengths and provide 3 actionable strategies for educators.
  `;

  const msg = await anthropic.messages.create({
    // This is the specific identifier for the Haiku model
    model: "claude-opus-4-6",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const reportText = msg.content[0].type === 'text' ? msg.content[0].text : "";

  await prisma.assessment.update({
    where: { id: assessment.id },
    data: { specialCareReport: reportText },
  });

  revalidatePath(`/dashboard/child/${childId}`);
}

// Fixed: This is now outside of the other function
export async function deleteChild(formData: FormData) {
  const childId = formData.get("childId") as string;

  await prisma.child.delete({
    where: { id: childId },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}