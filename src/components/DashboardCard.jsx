import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardCard({ 
  title, 
  description, 
  icon, 
  isBeta, 
  onClick, 
  delay = 0, 
  trend, 
  trendValue, 
  variant = 'default',
  className = ''
}) {
  const variants = {
    default: 'bg-white dark:bg-[#0d0a1a] border border-violet-100 dark:border-[#1e1535] hover:border-violet-300 dark:hover:border-violet-700',
    primary: 'bg-gradient-to-br from-[#13102a] to-[#1a0d2e] dark:from-[#13102a] dark:to-[#0d0a1a] text-white border-2 border-violet-600/60 shadow-[3px_3px_0_0_#7c3aed] hover:border-violet-400',
    secondary: 'bg-white dark:bg-[#0d0a1a] border border-secondary-500/30 dark:border-secondary-500/40 hover:border-secondary-500/70',
    accent: 'bg-white dark:bg-[#0d0a1a] border border-magenta-500/30 dark:border-pink-500/40 hover:border-pink-500/70'
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className={`group p-6 rounded-2xl transition-all text-left flex flex-col relative overflow-hidden h-full shadow-[3px_3px_0_0_#1a1030] dark:shadow-[3px_3px_0_0_rgba(124,58,237,0.18)] hover:shadow-[1px_1px_0_0_#1a1030] dark:hover:shadow-[1px_1px_0_0_rgba(124,58,237,0.28)] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer ${variants[variant]} ${className}`}
    >
      <div className="flex items-center justify-between w-full mb-4">
        <div className={`p-3 rounded-xl border shadow-[2px_2px_0_0_#1a1030] dark:shadow-[2px_2px_0_0_rgba(124,58,237,0.2)] transition-transform group-hover:scale-105 ${
          variant === 'primary' 
            ? 'bg-violet-600/80 text-white border-violet-500/50' 
            : variant === 'secondary'
            ? 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 border-secondary-200 dark:border-secondary-800/40'
            : variant === 'accent'
            ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800/40'
            : 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800/40'
        }`}>
          {icon}
        </div>

        {isBeta && (
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-fuchsia-300 dark:border-fuchsia-800 text-fuchsia-600 dark:text-fuchsia-300 bg-fuchsia-50 dark:bg-fuchsia-950/40 shadow-[1px_1px_0_0_#a21caf]">
            Phase 3
          </span>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-1 ${
          variant === 'primary' ? 'text-violet-300' : 'text-gray-500 dark:text-violet-400/60'
        }`}>{title}</h3>
        <p className={`text-xl font-bold tracking-tight transition-colors ${
          variant === 'primary' 
            ? 'text-white group-hover:text-violet-200'
            : 'text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-violet-400'
        }`}>
          {description}
        </p>
      </div>

      {trend && (
        <div className={`mt-4 flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border w-fit ${
          trend === 'up' 
            ? 'border-secondary-500/40 bg-secondary-50 text-secondary-700 dark:bg-secondary-950/30 dark:text-secondary-400 shadow-[1px_1px_0_0_#10c07a]' 
            : 'border-rose-500/40 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 shadow-[1px_1px_0_0_#f43f5e]'
        }`}>
          <span>{trend === 'up' ? '▲' : '▼'}</span> {trendValue} Growth
        </div>
      )}

      {/* Subtle aurora glow on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl ${
        variant === 'primary' ? 'bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5' : ''
      }`} />
    </motion.button>
  );
}
