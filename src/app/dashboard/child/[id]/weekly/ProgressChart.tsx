"use client";

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function ProgressChart({ checkins }: { checkins: any[] }) {
  // Only show the chart if we have at least one completed check-in with a score
  const completedCheckins = checkins.filter(c => c.progressScore !== null);
  
  if (completedCheckins.length === 0) return null;

  // Format the data for Recharts
  const chartData = completedCheckins.map(checkin => ({
    name: `Wk ${checkin.weekNumber}`,
    Score: checkin.progressScore,
    Focus: checkin.parentObservations?.substring(0, 50) + "..." // Snippet for the tooltip
  }));

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Weekly Progress Trend</h3>
        <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
          AI Calculated (0-10)
        </span>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} 
              dy={10}
            />
            <YAxis 
              domain={[0, 10]} 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 12}} 
            />
            <Tooltip
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
              labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
            />
            <Line
              type="monotone"
              dataKey="Score"
              stroke="#4f46e5"
              strokeWidth={4}
              dot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#4f46e5" }}
              activeDot={{ r: 8, strokeWidth: 0, fill: "#4f46e5" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}