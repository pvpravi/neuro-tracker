import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AssessmentRadarChart } from "@/components/AssessmentRadarChart"; // <-- Added the import!

export default async function ChildProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  // Fetch the child, plus their plan, assessments, and documents
  const child = await prisma.child.findUnique({
    where: { id: params.id },
    include: { 
      documents: { orderBy: { uploadedAt: 'desc' } }, 
      oneYearPlan: true,
      assessments: { orderBy: { createdAt: 'desc' }, take: 1 }
    }
  });

  if (!child) notFound();
  const latestAssessment = child.assessments[0];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-bold mb-6 inline-flex items-center gap-2">
        ← Back to Dashboard
      </Link>

      {/* Main Profile Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900">{child.name}&apos;s Hub</h1>
          <p className="text-slate-500 mt-2 text-lg">Age: {child.age || "Not specified"}</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Notice the Radar button is gone! */}
          <Link href={`/dashboard/child/${child.id}/weekly`} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm transition-colors">
            View Weekly Plan
          </Link>
        </div>
      </div>

      {/* 🌟 1-Year North Star Goal (Elaborated) */}
      {child.oneYearPlan && (
        <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-sm font-bold text-indigo-800 uppercase tracking-widest mb-4">
            1-Year North Star Goal
          </h2>
          <div className="text-lg text-indigo-950 font-medium leading-relaxed whitespace-pre-wrap">
            {child.oneYearPlan.publishedGoal}
          </div>
        </div>
      )}

      {/* 📊 COMBINED VISUAL & NUMBER SCORES */}
      {latestAssessment && (
        <div className="mb-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Developmental Profile Overview</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left side: The Radar Chart */}
            <div className="h-[400px] w-full flex justify-center bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <AssessmentRadarChart assessment={latestAssessment} />
            </div>

            {/* Right side: The Score Grid */}
            <div className="grid grid-cols-2 gap-4">
              <ScoreCard title="Pattern & Logic" score={latestAssessment.patternLogicScore} />
              <ScoreCard title="Spatial & Construct" score={latestAssessment.spatialConstructiveScore} />
              <ScoreCard title="Sensory Reg" score={latestAssessment.sensoryRegulationScore} />
              <ScoreCard title="Repetitive Comfort" score={latestAssessment.repetitiveComfortScore} />
              <ScoreCard title="Task Persistence" score={latestAssessment.taskPersistenceScore} />
              <ScoreCard title="Verbal Expressive" score={latestAssessment.verbalExpressiveScore} />
              <ScoreCard title="Transition Adapt" score={latestAssessment.transitionAdaptabilityScore} />
              <ScoreCard title="Fine Motor" score={latestAssessment.fineMotorScore} />
            </div>
          </div>
        </div>
      )}

      {/* 📂 The File Vault */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Document Vault</h2>
          <Link href={`/dashboard/child/${child.id}/upload`} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors">
            + Upload Document
          </Link>
        </div>

        {child.documents.length === 0 ? (
          <div className="text-center p-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-slate-500 font-medium">No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {child.documents.map(doc => (
              <div key={doc.id} className="p-4 border border-slate-200 rounded-xl bg-white hover:border-indigo-300 transition-colors flex justify-between items-center group">
                <span className="font-semibold text-slate-700">{doc.title}</span>
                <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md">AI Processed</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for the score numbers
function ScoreCard({ title, score }: { title: string, score: number }) {
  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-sm hover:border-indigo-200 transition-colors">
      <div className="text-[10px] text-slate-500 uppercase font-black mb-1 truncate">{title}</div>
      <div className="text-2xl font-black text-indigo-600">{score.toFixed(1)}</div>
    </div>
  );
}