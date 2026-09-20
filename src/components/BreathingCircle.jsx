import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BreathingCircle() {
  const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale
  const [count, setCount] = useState(4);

  useEffect(() => {
    let timer;
    if (count > 0) {
      timer = setTimeout(() => setCount(count - 1), 1000);
    } else {
      if (phase === 'Inhale') {
        setPhase('Hold');
        setCount(4);
      } else if (phase === 'Hold') {
        setPhase('Exhale');
        setCount(4);
      } else {
        setPhase('Inhale');
        setCount(4);
      }
    }
    return () => clearTimeout(timer);
  }, [count, phase]);

  const getPhaseColors = () => {
    switch (phase) {
      case 'Inhale':
        return {
          glow: 'rgba(124, 58, 237, 0.45)',
          gradient: 'from-violet-600 via-purple-600 to-indigo-600',
          indicator: 'bg-violet-500 shadow-[0_0_10px_#7c3aed]',
          badge: 'text-violet-300 border-violet-500/30 bg-violet-500/10'
        };
      case 'Hold':
        return {
          glow: 'rgba(236, 72, 153, 0.5)',
          gradient: 'from-fuchsia-600 via-pink-600 to-magenta-600',
          indicator: 'bg-magenta-500 shadow-[0_0_10px_#ec4899]',
          badge: 'text-pink-300 border-pink-500/30 bg-pink-500/10'
        };
      case 'Exhale':
      default:
        return {
          glow: 'rgba(16, 192, 122, 0.45)',
          gradient: 'from-teal-600 via-secondary-500 to-emerald-600',
          indicator: 'bg-secondary-400 shadow-[0_0_10px_#10c07a]',
          badge: 'text-secondary-300 border-secondary-500/30 bg-secondary-500/10'
        };
    }
  };

  const colors = getPhaseColors();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#0d0a1a] rounded-[3rem] border border-[#1e1535] shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(124,58,237,0.15)] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-violet-500/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer Glow */}
        <motion.div
          animate={{ 
            scale: phase === 'Inhale' ? 1.6 : phase === 'Hold' ? 1.6 : 1,
            opacity: phase === 'Inhale' ? 0.6 : phase === 'Hold' ? 0.7 : 0.2
          }}
          transition={{ duration: phase === 'Hold' ? 0 : 4, ease: "easeInOut" }}
          style={{ backgroundColor: colors.glow }}
          className="absolute w-44 h-44 rounded-full blur-3xl transition-colors duration-700"
        />

        {/* The Circle */}
        <motion.div
          animate={{ 
            scale: phase === 'Inhale' ? 1.4 : phase === 'Hold' ? 1.4 : 1,
          }}
          transition={{ duration: phase === 'Hold' ? 0 : 4, ease: "easeInOut" }}
          className={`w-32 h-32 bg-gradient-to-br ${colors.gradient} rounded-full shadow-[0_0_30px_rgba(0,0,0,0.6)] flex items-center justify-center z-10 border border-white/20 transition-all duration-700`}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white font-black text-lg tracking-wider uppercase drop-shadow-md"
            >
              {phase}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="mt-8 text-center relative z-20">
        <p className="text-5xl font-black bg-gradient-to-r from-violet-300 via-fuchsia-200 to-white bg-clip-text text-transparent mb-1">
          {count}
        </p>
        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all duration-500 ${colors.badge}`}>
          Seconds remaining
        </span>
      </div>
      
      <div className="mt-6 flex gap-2 items-center">
        {['Inhale', 'Hold', 'Exhale'].map((p) => (
          <div 
            key={p} 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              phase === p ? `${colors.indicator} w-6` : 'bg-[#1e1535] w-2'
            }`} 
          />
        ))}
      </div>
    </div>
  );
}
