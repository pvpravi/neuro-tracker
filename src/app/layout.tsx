import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Special Care | Neuro-Affirming Progress Tracker",
  description: "Celebrate strengths and build intelligent roadmaps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider shadowChain={true}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div className="flex flex-col min-h-screen bg-white">
            {/* The Logout Button & Menu */}
            <Navbar /> 

            {/* Main Page Content */}
            <main className="flex-grow">
              {children}
            </main>

            {/* ⚖️ Unified Legal & Clinical Footer */}
            <footer className="py-12 border-t border-slate-100 bg-slate-50/50">
              <div className="max-w-6xl mx-auto px-6 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-4">
                  © {new Date().getFullYear()} Special Care by Medha Labs
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed max-w-4xl mx-auto">
                  <strong>Clinical Disclaimer:</strong> Special Care is an assistive organizational tool and does not provide medical or diagnostic advice. 
                  All AI-generated roadmaps and developmental insights are for informational purposes only and must be reviewed by a licensed healthcare professional 
                  before implementation.
                </p>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}