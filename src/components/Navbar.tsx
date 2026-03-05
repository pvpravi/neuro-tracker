import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Branding */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <span className="text-2xl">🧬</span>
          <span className="font-black text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">
            Special Care
          </span>
        </Link>

        {/* User Actions */}
        <div className="flex items-center gap-6">
          <Link 
            href="/dashboard" 
            className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Dashboard
          </Link>
          
          {/* Clerk User Button - Handles Logout & Profile */}
          <div className="border-l pl-6 border-slate-200">
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 border-2 border-indigo-100 hover:border-indigo-500 transition-all"
                }
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}