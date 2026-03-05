import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  // Fetch user and their children
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      children: {
        include: {
          oneYearPlan: true,
          weeklyCheckins: {
            orderBy: { weekStartDate: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const children = dbUser?.children ?? [];

  // 🛡️ 1. Privacy Redirect for Parents (Direct access for 1 child)
  if (children.length === 1) {
    redirect(`/dashboard/child/${children[0].id}`);
  }

  // 🏠 2. Parent "First Start" View (0 children)
  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-100">
          <div className="text-6xl mb-6">👋</div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">Welcome</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Let&apos;s start by creating your child&apos;s neuro-affirming profile to build their first roadmap.
          </p>
          <Link 
            href="/dashboard/add-child" 
            className="block w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            Create Child Profile
          </Link>
          <p className="mt-8 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            Powered by Medha Labs
          </p>
        </div>
      </div>
    );
  }

  // 👨‍⚕️ 3. Provider View (Multiple children)
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col">
      <div className="max-w-6xl mx-auto space-y-8 w-full flex-grow">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Provider Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              Active Patient Roster & Developmental Tracking
            </p>
          </div>
          <Link
            href="/dashboard/add-child"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all active:scale-95"
          >
            + Add New Patient
          </Link>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {children.map((child) => {
                  const weeksCompleted = child.weeklyCheckins.length;
                  const progress = Math.min(weeksCompleted / 52, 1);
                  const hasPlan = !!child.oneYearPlan;

                  return (
                    <tr key={child.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 py-5">
                        <Link href={`/dashboard/child/${child.id}`} className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {child.name}
                        </Link>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-slate-600">
                        {child.age ? `${child.age}y` : '—'}
                      </td>
                      <td className="px-6 py-5">
                        {hasPlan ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100">ACTIVE</span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-100">PENDING INTAKE</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress * 100}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-500">{weeksCompleted}/52</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-4">
                          <Link 
                            href={`/dashboard/child/${child.id}/weekly`} 
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-4"
                          >
                            Plan
                          </Link>
                          <Link 
                            href={`/dashboard/child/${child.id}`} 
                            className="text-xs font-bold text-slate-400 hover:text-slate-900"
                          >
                            Vault
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ⚖️ Legal & Clinical Footer */}
      <footer className="max-w-6xl mx-auto w-full mt-12 pt-8 border-t border-slate-200 pb-8 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-4">
          © {new Date().getFullYear()} Special Care by Medha Labs
        </p>
        <p className="text-[10px] text-slate-400 leading-relaxed max-w-4xl mx-auto px-4">
          <strong>Clinical Disclaimer:</strong> Special Care is an assistive organizational tool and does not provide medical or diagnostic advice. 
          All AI-generated roadmaps and developmental insights are for informational purposes only and must be reviewed by a licensed healthcare professional 
          before implementation. We do not guarantee the clinical accuracy of data extracted from uploaded documents.
        </p>
      </footer>
    </div>
  );
}