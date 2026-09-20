import React from 'react';

export default function Logo({ className = "text-2xl", variant = "primary" }) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'white':
        return 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]';
      case 'dark':
        return 'text-gray-900';
      case 'aurora':
      default:
        return 'bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(124,58,237,0.4)]';
    }
  };

  return (
    <div className={`flex items-center gap-1.5 font-black tracking-tight ${className}`}>
      <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-violet-500 to-magenta-400 shadow-[0_0_8px_rgba(236,72,153,0.8)] animate-pulse inline-block"></span>
      <span className={`font-['Yatra_One'] italic lowercase tracking-tight ${getVariantStyles()}`}>svasthya</span>
    </div>
  );
}
