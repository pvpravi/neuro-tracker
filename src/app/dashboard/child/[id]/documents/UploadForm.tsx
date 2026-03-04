"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadForm({ childId }: { childId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUploading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/upload-document", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload document");
      }

      // Success! Clear the form and refresh the page to show the new document
      (e.target as HTMLFormElement).reset();
      router.refresh();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl border-2 border-dashed border-indigo-200 p-10 text-center mb-12 hover:bg-indigo-50 transition-colors">
      <div className="mx-auto w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
        {isUploading ? (
          <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {isUploading ? "AI is analyzing document..." : "Upload a New Document"}
      </h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">
        {isUploading 
          ? "This usually takes 10-15 seconds. Please don't close this page." 
          : "We accept PDFs, PNGs, and JPEGs. You can even upload a quick photo from your phone."}
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-semibold">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <input type="hidden" name="childId" value={childId} />
        
        <input 
          type="file" 
          name="document" 
          accept="application/pdf, image/png, image/jpeg, image/jpg"
          required
          disabled={isUploading}
          className="block w-full max-w-xs text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer disabled:opacity-50"
        />
        <button 
          type="submit"
          disabled={isUploading}
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isUploading ? "Extracting..." : "Extract Insights"}
        </button>
      </form>
    </div>
  );
}