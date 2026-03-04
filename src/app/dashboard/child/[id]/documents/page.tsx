"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Tesseract from "tesseract.js";

export default function UploadForm({ childId }: { childId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    setStatusText("Initializing AI Scanner...");

    try {
      // 1. THE EYES (Frontend Tesseract OCR)
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            // This gives the user a beautiful live progress percentage!
            setStatusText(`Reading image text... ${Math.round(m.progress * 100)}%`);
          }
        }
      });
      
      const extractedText = result.data.text;
      
      if (!extractedText || !extractedText.trim()) {
        throw new Error("Could not find any clear text in the image. Please try a clearer photo.");
      }

      setStatusText("Text extracted! Sending to Llama 3.3 for clinical analysis...");

      // 2. THE BRAIN (Send text to your new simplified API route)
      const response = await fetch("/api/upload-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: extractedText,
          fileName: file.name,
          childId: childId,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to process document with AI.");
      }

      // 3. SUCCESS! Refresh the page to show the new document.
      setIsUploading(false);
      setStatusText("");
      router.refresh(); // This forces Next.js to fetch the new database entries

    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`Error: ${error.message}`);
      setIsUploading(false);
      setStatusText("");
    }
  };

  return (
    <div className="bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-3xl p-10 text-center mb-12 hover:bg-indigo-50 transition-colors">
      {isUploading ? (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <h3 className="text-lg font-bold text-indigo-900 mb-2">Analyzing Document...</h3>
          <p className="text-indigo-600 font-medium">{statusText}</p>
        </div>
      ) : (
        <div>
          <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Clinical Image</h3>
          <p className="text-slate-500 mb-6 text-sm">
            Select a .png or .jpeg image of a clinical report.
          </p>
          <label className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition cursor-pointer shadow-sm">
            Choose Image
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg" 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}
    </div>
  );
}