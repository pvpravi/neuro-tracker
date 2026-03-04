"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

type ChartData = {
  week: string;
  score: number;
};

export function ProgressChart({ data }: { data: ChartData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
        <p className="text-slate-500 text-sm font-medium">
          Log your first weekly check-in to see the growth chart!
        </p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="week" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            domain={[0, 10]} 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dx={-10}
          />
          <Tooltip
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              backgroundColor: '#ffffff'
            }}
            itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
            labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Line
            type="monotone"
            dataKey="score"
            name="Momentum Score"
            stroke="#4f46e5"
            strokeWidth={4}
            dot={{ r: 5, fill: '#4f46e5', strokeWidth: 2, stroke: '#ffffff' }}
            activeDot={{ r: 8, fill: '#6366f1', strokeWidth: 0 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}