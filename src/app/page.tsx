import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function LandingPage() {
  // Check if user is logged in to show the correct button
  const { userId } = await auth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 sm:p-6 md:p-8">
      <div className="text-center space-y-6 sm:space-y-8 max-w-3xl w-full">
        
        {/* Branding Area */}
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          {/* Logo & Title - Stacks vertically on tiny screens, horizontally on larger ones */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl rotate-3 opacity-20" />
               <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl">🧬</div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
              Special Care
            </h1>
          </div>
          
          {/* Subtitle */}
          <div>
            <p className="text-xs sm:text-sm md:text-base font-bold text-indigo-600 uppercase tracking-[0.2em] sm:tracking-[0.3em]">
              Powered by Medha Labs
            </p>
          </div>
        </div>

        <p className="text-slate-600 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto px-4">
          A neuro-affirming progress tracker designed to celebrate strengths and 
          build intelligent roadmaps for your child&apos;s unique growth journey.
        </p>

        {/* 🔘 Single Smart Action Button */}
        <div className="pt-6 sm:pt-8 w-full px-4 sm:px-0">
          {userId ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 inline-block"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/sign-up"
                className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 inline-block"
              >
                Get Started for Free
              </Link>
              <Link href="/sign-in" className="text-sm font-semibold text-slate-400 hover:text-indigo-600 transition-colors">
                Already have an account? Log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}