"use client";

import { useState } from "react";

interface AlignmentViewProps {
  inferenceData: {
    strengths: string;
    supportNeeds: string;
    proposedOneYearGoal: string;
  };
  childId: string;
  generateShortTermPlan: (childId: string) => Promise<any>;
}

export function AlignmentView({ inferenceData, childId, generateShortTermPlan }: AlignmentViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      await generateShortTermPlan(childId);
      // Handle success, e.g., redirect to the new plan view
    } catch (error) {
      console.error("Error generating short-term plan:", error);
      // Handle error, e.g., show an error message
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-50 p-8 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Inference Report</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-100">
          <h3 className="text-lg font-semibold text-emerald-700 mb-3">Incredible Strengths</h3>
          <p className="text-slate-600 text-sm">{inferenceData.strengths}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">Areas for Support</h3>
          <p className="text-slate-600 text-sm">{inferenceData.supportNeeds}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-700 mb-3">Proposed 1-Year Milestone</h3>
          <p className="text-slate-600 text-sm">{inferenceData.proposedOneYearGoal}</p>
        </div>
      </div>

      <button
        onClick={handleGeneratePlan}
        disabled={isGenerating}
        className={`w-full py-4 rounded-lg text-white text-lg font-semibold transition-colors
          ${isGenerating
            ? "bg-indigo-400 cursor-not-allowed opacity-75"
            : "bg-indigo-600 hover:bg-indigo-700 shadow-md"}`}
      >
        {isGenerating
          ? "Collaborating with Clinical AI... (This takes a few moments)"
          : "I Acknowledge & Generate Action Plan"}
      </button>
    </div>
  );
}