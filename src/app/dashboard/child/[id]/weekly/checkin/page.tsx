import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import OpenAI from "openai";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// 🔥 THE FIX: Server Actions OUTSIDE component
async function submitSurvivalMode(formData: FormData) {
  "use server";
  const childId = formData.get("childId") as string;
  const weekId = formData.get("weekId") as string;
  const weekNumber = parseInt(formData.get("weekNumber") as string, 10);
  const weeklyTasks = JSON.parse(formData.get("weeklyTasks") as string);

  await prisma.weeklyCheckin.update({
    where: { id: weekId },
    data: {
      isSurvivalMode: true,
      aiInference: "Survival mode activated.",
      aiRecommendations: "Zero demands this week.",
      progressScore: null,
    },
  });

  await prisma.weeklyCheckin.create({
    data: { childId, weekNumber: weekNumber + 1, weeklyTasks },
  });

  revalidatePath(`/dashboard/child/${childId}/weekly`);
  redirect(`/dashboard/child/${childId}/weekly`);
}

async function submitCheckin(formData: FormData) {
  "use server";
  const childId = formData.get("childId") as string;
  const weekId = formData.get("weekId") as string;
  const weekNumber = parseInt(formData.get("weekNumber") as string, 10);
  const weeklyTasks = JSON.parse(formData.get("weeklyTasks") as string);

  const dbChild = await prisma.child.findUnique({
    where: { id: childId },
    include: { oneYearPlan: true },
  });
  if (!dbChild) throw new Error("Child not found");

  const tasksCompleted = weeklyTasks.map((_: any, index: number) => ({
    taskIndex: index,
    completed: formData.get(`task_${index}`) === "on",
  }));

  const parentObservations = (formData.get("observations") as string) || "";
  const challengesFaced = (formData.get("challenges") as string) || "";

  const inferencePrompt = `
You are analyzing weekly progress for ${dbChild.name}.
Parent Observations: ${parentObservations}
Challenges: ${challengesFaced}

Format strictly as a JSON object:
{ "inference": "analysis", "recommendations": "adjustments", "progressScore": 7.5 }
`;

  const inferenceResponse = await openai.chat.completions.create({
    model: "meta-llama/llama-3.3-70b-instruct",
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: inferencePrompt }],
  });

  let aiAnalysis = { inference: "", recommendations: "", progressScore: 5.0 };
  try { aiAnalysis = JSON.parse(inferenceResponse.choices[0]?.message?.content || "{}"); } catch(e) {}

  await prisma.weeklyCheckin.update({
    where: { id: weekId },
    data: { 
      tasksCompleted, 
      parentObservations, 
      challengesFaced, 
      aiInference: aiAnalysis.inference,            // <-- Mapped correctly!
      aiRecommendations: aiAnalysis.recommendations, // <-- Mapped correctly!
      progressScore: aiAnalysis.progressScore
    },
  });

  const vaultStrategies = await prisma.clinicalStrategy.findMany();
  const vaultContext = vaultStrategies.map(s => `${s.title} | ${s.domain}`).join('\n');

  const nextWeekPrompt = `
Child Profile:
- Diagnoses: ${dbChild.diagnoses?.join(", ") || "None"}
- Schooling: ${dbChild.schoolingStatus}
- Concerns: ${dbChild.primaryConcerns?.join(", ") || "None"}

MEDHA LABS VAULT:
${vaultContext}

Select 3 strategies from the vault. Return strictly as a JSON array with: "task", "frequency", "duration", "description", "whyItWorks", "resourceSearch".
`;

  const nextWeekResponse = await openai.chat.completions.create({
    model: "meta-llama/llama-3.3-70b-instruct",
    messages: [{ role: "user", content: nextWeekPrompt }],
  });

  let nextWeekTasks = [];
  try {
    const nextMatch = nextWeekResponse.choices[0]?.message?.content?.match(/\[[\s\S]*\]/);
    nextWeekTasks = nextMatch ? JSON.parse(nextMatch[0]) : [];
  } catch (e) {}

  await prisma.weeklyCheckin.create({
    data: { childId, weekNumber: weekNumber + 1, weeklyTasks: nextWeekTasks },
  });

  revalidatePath(`/dashboard/child/${childId}/weekly`);
  redirect(`/dashboard/child/${childId}/weekly`);
}

export default async function WeeklyCheckinPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const childId = params.id;

  const child = await prisma.child.findUnique({
    where: { id: childId },
    include: { oneYearPlan: true, weeklyCheckins: { orderBy: { weekNumber: "desc" }, take: 1 } },
  });

  if (!child) notFound();
  const currentWeek = child.weeklyCheckins[0];
  if (!currentWeek) return (
    <div className="max-w-2xl mx-auto p-12 text-center">
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-10 shadow-sm">
        <div className="mx-auto w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Let's build the Roadmap first!</h2>
        <p className="text-amber-800 mb-8 text-lg">
          Before we can generate weekly tasks for {child.name}, we need to co-design their 1-Year Clinical Roadmap.
        </p>
        <Link 
          href={`/dashboard/child/${childId}/co-design`} 
          className="inline-block px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Go to Co-Design
        </Link>
      </div>
    </div>
  );

  const weeklyTasks = (currentWeek.weeklyTasks as any[]) || [];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Week {currentWeek.weekNumber} Check-In</h1>

      <div className="mb-8 p-6 bg-rose-50 rounded-2xl">
        <h2 className="text-xl font-bold text-rose-900 mb-4">Survival Mode?</h2>
        <form action={submitSurvivalMode}>
          <input type="hidden" name="childId" value={childId} />
          <input type="hidden" name="weekId" value={currentWeek.id} />
          <input type="hidden" name="weekNumber" value={currentWeek.weekNumber} />
          <input type="hidden" name="weeklyTasks" value={JSON.stringify(weeklyTasks)} />
          <button type="submit" className="px-6 py-2 bg-rose-600 text-white rounded-lg">Activate</button>
        </form>
      </div>

      <form action={submitCheckin} className="space-y-8">
        <input type="hidden" name="childId" value={childId} />
        <input type="hidden" name="weekId" value={currentWeek.id} />
        <input type="hidden" name="weekNumber" value={currentWeek.weekNumber} />
        <input type="hidden" name="weeklyTasks" value={JSON.stringify(weeklyTasks)} />

        <div className="bg-white p-8 rounded-2xl border">
          <h2 className="text-2xl font-bold mb-4">Tasks Completed</h2>
          {weeklyTasks.map((t, i) => (
            <label key={i} className="flex gap-4 p-4 border rounded-lg mb-4">
              <input type="checkbox" name={`task_${i}`} className="mt-1 h-5 w-5" />
              <div><div className="font-semibold">{t.task}</div></div>
            </label>
          ))}
        </div>

        <textarea name="observations" rows={4} className="w-full border p-4 rounded-xl" placeholder="Observations" />
        <textarea name="challenges" rows={4} className="w-full border p-4 rounded-xl" placeholder="Challenges" />

        <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">
          Submit Check-In
        </button>
      </form>
    </div>
  );
}