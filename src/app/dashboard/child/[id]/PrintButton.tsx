"use client";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="print:hidden px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-md hover:bg-slate-700 transition flex items-center gap-2 shadow-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download PDF
    </button>
  );
}