"use client";

export default function ExportPdfButton({ childName, documentType }: { childName: string, documentType: string }) {
  const handleExport = () => {
    // Temporarily change the page title so the downloaded PDF has a nice, readable filename
    const originalTitle = document.title;
    document.title = `${childName}_${documentType}_SpecialCare`.replace(/\s+/g, '_');
    
    window.print();
    
    // Restore the original title
    document.title = originalTitle;
  };

  return (
    <button
      onClick={handleExport}
      className="print:hidden inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Generate PDF
    </button>
  );
}