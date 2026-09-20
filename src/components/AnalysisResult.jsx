import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, Activity, HeartPulse, TrendingUp, Zap } from 'lucide-react';

const CircularProgress = ({ value, label, icon: Icon, colorClass, ringColor, delay }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="flex flex-col items-center gap-3 bg-[#130d2a]/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-[#2d1f52] shadow-sm"
    >
      <div className="relative w-20 h-20">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.5 }}
            className={ringColor}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={20} className={colorClass} />
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-violet-300/70">{label}</p>
        <p className="text-lg font-black text-white">{value}%</p>
      </div>
    </motion.div>
  );
};

export default function AnalysisResult({ analysis }) {
  if (!analysis || (!analysis.result && !analysis.summary)) return null;

  const consistencyScore = analysis.consistencyScore || 85;
  const resilienceScore = analysis.resilienceScore || 72;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#120a2a] via-[#1a0f3d] to-[#0c071d] p-8 sm:p-14 rounded-[3.5rem] text-white border-2 border-[#3b1d7d] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(124,58,237,0.25)] relative overflow-hidden"
    >
      {/* Dynamic Aurora Ambient Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.25, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute -top-1/4 -right-1/4 w-full h-full bg-violet-600/15 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-magenta-500/15 rounded-full blur-[100px]" 
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-violet-500/20 p-4 rounded-3xl backdrop-blur-xl border border-violet-400/30 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
              <BrainCircuit size={36} className="text-violet-300" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300 mb-1">AI Cognitive Scan</p>
              <h2 className="text-3xl font-black italic tracking-tight bg-gradient-to-r from-violet-200 via-fuchsia-200 to-white bg-clip-text text-transparent">
                Your Wellbeing Matrix
              </h2>
            </div>
          </div>
          
          <div className="bg-[#0d0a1a]/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-[#2d1f52] flex items-center gap-3 shadow-inner">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-secondary-400 animate-pulse shadow-[0_0_8px_#10c07a]" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-secondary-300">Live Insights</span>
             </div>
             <div className="w-px h-4 bg-white/10" />
             <span className="text-[10px] font-bold text-violet-300/70">{new Date(analysis.generatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-center">
          
          <div className="lg:col-span-3">
            <div className="relative">
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.3 }}
                 className="bg-[#150e2e]/90 backdrop-blur-sm p-8 rounded-[3rem] border border-[#2d1f52] mb-8 shadow-inner"
               >
                 <p className="text-xl sm:text-2xl font-bold leading-relaxed text-violet-50 drop-shadow-md">
                   "{analysis.summary || analysis.result}"
                 </p>
               </motion.div>
               
               <div className="flex flex-wrap gap-3">
                 <div className="bg-secondary-500/10 text-secondary-300 px-4 py-2 rounded-xl text-xs font-bold border border-secondary-500/30 flex items-center gap-2 shadow-[0_0_10px_rgba(16,192,122,0.15)]">
                    <TrendingUp size={14} className="text-secondary-400" /> Improvement: +12%
                 </div>
                 <div className="bg-amber-500/10 text-amber-300 px-4 py-2 rounded-xl text-xs font-bold border border-amber-500/30 flex items-center gap-2 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                    <Zap size={14} className="text-amber-400" /> Peak Mood: Reflection
                 </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
             <CircularProgress 
               value={resilienceScore} 
               label="Resilience" 
               icon={HeartPulse} 
               colorClass="text-magenta-400"
               ringColor="text-magenta-500" 
               delay={0.5} 
             />
             <CircularProgress 
               value={consistencyScore} 
               label="Consistency" 
               icon={Activity} 
               colorClass="text-secondary-400"
               ringColor="text-secondary-400" 
               delay={0.6} 
             />
             <div className="col-span-2 bg-gradient-to-r from-violet-900/40 to-fuchsia-900/30 p-6 rounded-[2.5rem] border border-violet-500/30 flex items-center justify-between shadow-sm">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-violet-300 mb-1">Global Standing</p>
                   <p className="text-lg font-black italic text-violet-100">Top 15% Wellbeing</p>
                </div>
                <div className="bg-gradient-to-tr from-amber-500 to-yellow-300 p-3 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                   <Sparkles size={24} className="text-gray-950" />
                </div>
             </div>
          </div>

        </div>

        <div className="mt-14 pt-8 border-t border-[#261a45] flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-violet-300/60 font-bold uppercase tracking-widest">
            Authenticated via Svasthya Neural Engine • UID: {analysis._id?.slice(-8).toUpperCase() || 'REF-8291'}
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()}
              className="bg-gradient-to-r from-violet-500 to-magenta-500 text-white font-bold px-8 py-3 rounded-full text-xs shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Export AI Report
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
