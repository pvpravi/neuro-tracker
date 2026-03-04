import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// 🔥 THE FIX: Server Actions are now OUTSIDE the component!
async function generateOneYearPlan(formData: FormData) {
  "use server";
  const childId = formData.get("childId") as string;
  const parentPriority = (formData.get("parentPriority") as string) || "";

  const dbChild = await prisma.child.findUnique({
    where: { id: childId },
    include: {
      assessments: { orderBy: { createdAt: "desc" }, take: 1 },
      oneYearPlan: true,
    },
  });

  if (!dbChild) throw new Error("Child not found");
  const latestAssessment = dbChild.assessments[0] || null;
  if (!latestAssessment) throw new Error("No assessment found for this child.");

  const questionnaireJson =
    typeof latestAssessment.questionnaireData === "object" && latestAssessment.questionnaireData !== null
      ? JSON.stringify(latestAssessment.questionnaireData)
      : String(latestAssessment.questionnaireData ?? "");

  const ageGroup = latestAssessment.ageGroup ?? "unspecified";

  const clinicalContext = `
  - Formal Diagnoses: ${dbChild.diagnoses?.length ? dbChild.diagnoses.join(", ") : "None reported"}
  - Schooling Setting: ${dbChild.schoolingStatus?.replace("_", " ")}
  - Primary Clinical Concerns: ${dbChild.primaryConcerns?.length ? dbChild.primaryConcerns.join(", ") : "None reported"}
  `;

  const prompt = `
You are a neuro-affirming pediatric multidisciplinary clinician.

Child: ${dbChild.name}
Age: ${dbChild.age ?? "unspecified"}
Age Channel: ${ageGroup}

CLINICAL PROFILE: ${clinicalContext}

Intake assessment:
${questionnaireJson}

Caregiver priorities:
${parentPriority || "Not explicitly specified."}

CRITICAL CLINICAL RULES:
1. If the child has an IEP, 504 Plan, or is in General Ed, you MUST include school-based accommodation strategies.
2. If the child has ADHD, you MUST include Executive Functioning scaffolds.
3. If ARFID or Diet concerns are flagged, focus strictly on zero-pressure food exploration.
4. If Intellectual Disability (ID) is flagged, prioritize functional communication (AAC) and ADLs.
5. If Anxiety or OCD is flagged, prioritize nervous system regulation over compliance.

Using only strengths-based, respectful, neuro-affirming language:
Create a **1-year roadmap** formatted as clean Markdown with these sections:

## Overview & Strengths
- 3–5 bullet points highlighting strengths.
- 2–3 sentences explaining the overall focus.

## Milestone 1 – Sensory Regulation
- 1 clear goal.
- 4–6 weekly-practical strategies.

## Milestone 2 – Communication & Connection
- 1 clear goal.
- 4–6 strategies.

## Milestone 3 – Learning & Education
- 1 clear goal.
- 3–5 suggestions.

## Milestone 4 – Diet, Feeding & Daily Living
- 1 clear goal.
- 3–5 gentle ideas.

## Reassurance for Caregivers
- A short, warm paragraph.

IMPORTANT: Also extract a single, concise goal statement (1-2 sentences) that summarizes the main focus for the year.
`;

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  let response;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      response = await openai.chat.completions.create({
        model: "meta-llama/llama-3.3-70b-instruct",
        messages: [{ role: "user", content: prompt }],
      });
      break;
    } catch (error: any) {
      if (error.status === 429 && attempt < maxRetries) {
        await delay(attempt * 2500);
      } else {
        throw new Error("High traffic. Please try again.");
      }
    }
  }

  const roadmapText = response?.choices[0]?.message?.content || "{}";
  const goalMatch = roadmapText.match(/overall focus for the next 12 months[:\.]?\s*([^#]+)/i);
  const publishedGoal = goalMatch
    ? goalMatch[1].trim().split('\n')[0].trim()
    : `Support ${dbChild.name}'s development through neuro-affirming strategies.`;

  await prisma.oneYearPlan.upsert({
    where: { childId },
    update: {
      proposedGoal: publishedGoal,
      userFeedback: parentPriority || dbChild.oneYearPlan?.userFeedback || null,
      isApproved: false,
      hiddenAiPlan: roadmapText,
      publishedGoal: publishedGoal,
    },
    create: {
      childId,
      proposedGoal: publishedGoal,
      userFeedback: parentPriority || null,
      isApproved: false,
      hiddenAiPlan: roadmapText,
      publishedGoal: publishedGoal,
    },
  });

  revalidatePath(`/dashboard/child/${childId}/co-design`);
  redirect(`/dashboard/child/${childId}/co-design`);
}

async function acknowledgeGoal(formData: FormData) {
  "use server";
  const childId = formData.get("childId") as string;
  const isAligned = formData.get("isAligned") === "true";

  if (!isAligned) {
    await prisma.oneYearPlan.update({
      where: { childId },
      data: { publishedGoal: null, isApproved: false },
    });
    revalidatePath(`/dashboard/child/${childId}/co-design`);
    return;
  }

  await prisma.oneYearPlan.update({
    where: { childId },
    data: { isApproved: true },
  });

  const dbChild = await prisma.child.findUnique({
    where: { id: childId },
    include: { oneYearPlan: true },
  });

  if (!dbChild?.oneYearPlan?.hiddenAiPlan) {
    throw new Error("Cannot generate tasks without a roadmap.");
  }

  const weeklyPrompt = `
Based on this 1-year roadmap for ${dbChild.name}:
${dbChild.oneYearPlan.hiddenAiPlan}

Generate Week 1 activities as a JSON array. Each object must have:
- "task": string
- "frequency": string
- "duration": string
- "description": string
- "whyItWorks": string
- "resourceSearch": string

Return ONLY valid JSON array.
`;

  const weeklyResponse = await openai.chat.completions.create({
    model: "meta-llama/llama-3.3-70b-instruct",
    messages: [{ role: "user", content: weeklyPrompt }],
  });

  const weeklyText = weeklyResponse.choices[0]?.message?.content || "[]";
  let weeklyTasks = [];
  try {
    const jsonMatch = weeklyText.match(/\[[\s\S]*\]/);
    weeklyTasks = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch (e) {
    weeklyTasks = [];
  }

  await prisma.weeklyCheckin.create({
    data: { childId, weekNumber: 1, weeklyTasks },
  });

  revalidatePath(`/dashboard/child/${childId}/co-design`);
  revalidatePath(`/dashboard/child/${childId}/weekly`);
  redirect(`/dashboard/child/${childId}/weekly`);
}


export default async function CoDesignPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const childId = params.id;

  const child = await prisma.child.findUnique({
    where: { id: childId },
    include: { oneYearPlan: true },
  });

  if (!child) return <div>Child not found.</div>;

  const showAcknowledgment = child.oneYearPlan?.publishedGoal && !child.oneYearPlan.isApproved;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Co-Design the 1-Year Roadmap</h1>
        <p className="text-lg text-slate-600">We use your intake data to build a comprehensive plan.</p>
      </div>

      {showAcknowledgment ? (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">Your North Star for the Year</h2>
          <p className="text-xl text-slate-800 italic mb-8">"{child.oneYearPlan.publishedGoal}"</p>
          
          <div className="flex flex-col gap-4 max-w-xl mx-auto">
            <form action={acknowledgeGoal}>
              <input type="hidden" name="childId" value={childId} />
              <input type="hidden" name="isAligned" value="true" />
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl">
                ✓ Yes, I'm Aligned - Start Week 1
              </button>
            </form>
            <form action={acknowledgeGoal}>
              <input type="hidden" name="childId" value={childId} />
              <input type="hidden" name="isAligned" value="false" />
              <button type="submit" className="w-full text-slate-500 font-semibold py-3 border rounded-xl">
                ✗ Not quite right, let me adjust
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 max-w-2xl mx-auto">
          <form action={generateOneYearPlan} className="space-y-6">
            <input type="hidden" name="childId" value={childId} />
            <textarea
              name="parentPriority"
              rows={6}
              className="w-full rounded-2xl border px-5 py-4"
              placeholder="What matters most right now?"
            />
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl">
              Generate 1-Year Goal
            </button>
          </form>
        </div>
      )}
    </div>
  );
}