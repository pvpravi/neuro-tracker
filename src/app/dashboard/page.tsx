import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/");

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

  // 🛡️ Privacy Redirect for Parents (1 child only)
  if (children.length === 1) {
    redirect(`/dashboard/child/${children[0].id}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Provider Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">
              Active Patient Roster & Developmental Tracking
            </p>
          </div>
          <Link
            href="/dashboard/add-child"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
          >
            + Add New Patient
          </Link>
        </div>

        {children.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-dashed border-slate-200 text-center">
            <h2 className="text-lg font-semibold text-slate-800">No patients found</h2>
            <Link href="/dashboard/add-child" className="text-indigo-600 hover:underline mt-2 inline-block">
              Add your first patient profile
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Patient Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Age</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Progress</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {children.map((child) => {
                  const weeksCompleted = child.weeklyCheckins.length;
                  const progress = Math.min(weeksCompleted / 52, 1);
                  const hasPlan = !!child.oneYearPlan;

                  return (
                    <tr key={child.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/child/${child.id}`} className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {child.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {child.age ? `${child.age}y` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {hasPlan ? (
                          <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">ACTIVE</span>
                        ) : (
                          <span className="px-2 py-1 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">PENDING INTAKE</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${progress * 100}%` }} />
                          </div>
                          <span className="text-xs text-slate-500">{weeksCompleted}/52</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <Link 
                            href={`/dashboard/child/${child.id}/weekly`} 
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            Plan
                          </Link>
                          <Link 
                            href={`/dashboard/child/${child.id}`} 
                            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
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
        )}
      </div>
    </div>
  );
}