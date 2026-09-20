import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function WellbeingChart({ assessments = [] }) {
  const chartData = useMemo(() => {
    if (!assessments || assessments.length === 0) {
      return Array.from({ length: 7 }, (_, i) => ({ name: `Day ${i+1}`, score: 0, type: 'N/A', severity: 'No Data' }));
    }
    return assessments.map(ass => ({
      name: new Date(ass.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      score: ass.totalScore,
      type: ass.type,
      severity: ass.severity
    }));
  }, [assessments]);

  return (
    <div className="w-full h-full min-h-[300px] relative overflow-hidden">
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAuroraScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.45}/>
                <stop offset="60%" stopColor="#ec4899" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a78bfa', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis hide domain={[0, 'dataMax + 5']} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#0d0a1a] p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(124,58,237,0.3)] border border-[#2d1f52]">
                      <p className="text-[10px] font-black text-violet-400/60 uppercase mb-1">{data.name}</p>
                      <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-magenta-400 italic">{data.type}: {data.score}</p>
                      <p className="text-[9px] font-bold text-secondary-400 uppercase mt-0.5">{data.severity}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#7c3aed" 
              strokeWidth={3.5}
              fillOpacity={1} 
              fill="url(#colorAuroraScore)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
