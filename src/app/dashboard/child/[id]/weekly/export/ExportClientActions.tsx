"use client";

import Link from "next/link";

export default function ExportClientActions({ childId }: { childId: string }) {
  return (
    <div className="flex justify-between items-center mb-10 print:hidden border-b border-slate-200 pb-6">
      <Link 
        href={`/dashboard/child/${childId}/weekly`} 
        className="text-indigo-600 hover:text-indigo-800 text-sm font-bold transition flex items-center gap-2"
      >
        ← Back to Dashboard
      </Link>
      <button 
        onClick={() => window.print()} 
        className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center gap-2"
      >
        Download/Print PDF
      </button>
    </div>
  );
}