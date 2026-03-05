"use client"
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function WeeklyExportPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const childId = params.id;

  // Fetch the child, their plan, and up to the last 4 completed weeks
  const child = await prisma.child.findUnique({
    where: { id: childId },
    include: {
      oneYearPlan: true,
      weeklyCheckins: {
        where: {
          OR: [
            { aiInference: { not: null } },
            { isSurvivalMode: true }
          ]
        },
        orderBy: { weekNumber: "desc" },
        take: 4, 
      },
    },
  });

  if (!child || !child.oneYearPlan) {
    notFound();
  }

  const recentWeeks = child.weeklyCheckins;

  if (recentWeeks.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Not Enough Data Yet</h2>
        <p className="text-slate-600 mb-6">Complete at least one weekly check-in to generate a clinical update report.</p>
        <Link href={`/dashboard/child/${childId}/weekly`} className="text-indigo-600 font-semibold hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Aggregate successful strategies from the last month
  const successfulStrategies = recentWeeks.flatMap(week => {
    if (week.isSurvivalMode) return [];
    const tasks = (week.weeklyTasks as any[]) || [];
    const completedTasksData = (week.tasksCompleted as any[]) || [];
    
    return completedTasksData
      .filter(tc => tc.completed)
      .map(tc => tasks[tc.taskIndex]?.task)
      .filter(Boolean);
  });

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white min-h-screen">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-before: always;
          }
          .avoid-break {
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Action Bar (Hidden when printing) */}
      <div className="flex justify-between items-center mb-10 no-print border-b border-slate-200 pb-6">
        <Link href={`/dashboard/child/${childId}/weekly`} className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition flex items-center gap-2">
          ← Back to Dashboard
        </Link>
        <button 
          onClick={() => window.print()} 
          className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Download PDF for Therapist
        </button>
      </div>

      {/* Clinical Header */}
      <div className="border-b-2 border-slate-900 pb-6 mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Clinical Progress Update</h1>
        <div className="grid grid-cols-2 gap-4 text-sm text-slate-700 font-medium">
          <div>
            <span className="text-slate-500 mr-2">Patient/Child:</span> {child.name}
          </div>
          <div>
            <span className="text-slate-500 mr-2">Age:</span> {child.age ?? "Not specified"}
          </div>
          <div>
            <span className="text-slate-500 mr-2">Report Date:</span> {new Date().toLocaleDateString()}
          </div>
          <div>
            <span className="text-slate-500 mr-2">Period Covered:</span> Last {recentWeeks.length} Weeks
          </div>
        </div>
      </div>

      {/* Current Focus Area */}
      <div className="mb-10 avoid-break">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Current Home Focus (1-Year Goal)</h2>
        <p className="text-lg text-slate-900 font-medium leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-100">
          "{child.oneYearPlan.publishedGoal}"
        </p>
      </div>

      {/* Successful Strategies Aggregated */}
      <div className="mb-10 avoid-break">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Successful Home Strategies (Last 30 Days)</h2>
        {successfulStrategies.length > 0 ? (
          <ul className="list-disc pl-6 space-y-2 text-slate-800">
            {/* Deduplicate strategies if they repeated across weeks */}
            {Array.from(new Set(successfulStrategies)).map((strategy, i) => (
              <li key={i}>{strategy}</li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 italic">No specific strategies marked as fully completed this period. Focus was on baseline regulation.</p>
        )}
      </div>

      {/* Week by Week Clinical Breakdown */}
      <div className="space-y-8">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Chronological Check-In Log</h2>
        
        {recentWeeks.map((week) => (
          <div key={week.id} className="bg-white border border-slate-200 rounded-xl p-6 avoid-break">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-lg">Week {week.weekNumber}</h3>
              {week.isSurvivalMode ? (
                <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">Low Demand / Rest Week</span>
              ) : (
                <span className="text-sm font-semibold text-slate-600">Momentum Score: {week.progressScore?.toFixed(1) ?? "N/A"}/10</span>
              )}
            </div>

            {week.isSurvivalMode ? (
              <p className="text-slate-600 italic">Caregiver reported a high-stress week. Home demands were paused to focus entirely on safety, co-regulation, and rest.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Caregiver Observations</h4>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap">{week.parentObservations || "None reported."}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Challenges / Barriers</h4>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap">{week.challengesFaced || "None reported."}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
        Generated by SpecialCare powered by Medha Labs. Intended for collaborative use with {child.name}'s clinical and educational team.
      </div>
    </div>
  );
}