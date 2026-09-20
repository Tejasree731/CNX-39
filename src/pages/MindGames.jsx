import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sparkles, Wind, Maximize2, MousePointer2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BreathingCircle from '../components/BreathingCircle';

const GameCard = ({ title, description, icon: Icon, onClick, active }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
      active 
        ? 'border-primary-500 bg-white dark:bg-[#151922] text-gray-900 dark:text-white shadow-[3px_3px_0_0_#0284c7] scale-[1.02]' 
        : 'border-gray-200 dark:border-[#1e2330] hover:border-gray-400 dark:hover:border-neutral-600 bg-white dark:bg-[#11141c] shadow-[3px_3px_0_0_#181b22] dark:shadow-[3px_3px_0_0_rgba(255,255,255,0.06)] hover:translate-x-0.5 hover:translate-y-0.5'
    } active:translate-x-[2px] active:translate-y-[2px] active:shadow-none`}
  >
    <div className={`p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 w-fit mb-3 ${active ? 'bg-primary-500 text-white shadow-[1px_1px_0_0_#0284c7]' : 'bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400'}`}>
      <Icon size={20} />
    </div>
    <h3 className="text-base font-bold mb-1">{title}</h3>
    <p className={`text-xs ${active ? 'text-primary-700 dark:text-primary-300' : 'text-gray-500 dark:text-neutral-400'}`}>{description}</p>
  </button>
);

export default function MindGames() {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState('breath');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn-tactile px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 text-gray-700 dark:text-neutral-300 cursor-pointer"
          >
            <ChevronLeft size={14} /> Dashboard
          </button>
          <span className="text-[10px] font-mono text-emerald-500 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> ZEN ENGINE READY
          </span>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Menu Column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-[#11141c] p-5 rounded-2xl border border-gray-200 dark:border-[#1e2330] shadow-[3px_3px_0_0_#181b22] dark:shadow-[3px_3px_0_0_rgba(255,255,255,0.06)]">
               <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400 block mb-1">
                  Rituals
               </span>
               <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={20} className="text-primary-500" /> Zen Hub
               </h1>
               <p className="text-gray-500 dark:text-neutral-400 text-xs mt-1 leading-relaxed">Cognitive refocusing mini-games designed to ease rapid anxiety.</p>
            </div>

            <GameCard 
              title="Zen Breath" 
              description="Guided 4-7-8 breathing meditation for somatic calm." 
              icon={Wind} 
              active={activeGame === 'breath'}
              onClick={() => setActiveGame('breath')}
            />
            
            <GameCard 
              title="Focus Bloom" 
              description="Interactive visual anchoring to sharpen scattered focus." 
              icon={Sparkles} 
              active={activeGame === 'bloom'}
              onClick={() => setActiveGame('bloom')}
            />
          </div>

          {/* Main Area Column */}
          <div className="lg:col-span-3">
             <AnimatePresence mode="wait">
                {activeGame === 'breath' && (
                  <motion.div 
                    key="breath" 
                    initial={{opacity:0, scale:0.97}} 
                    animate={{opacity:1, scale:1}} 
                    exit={{opacity:0, scale:0.97}}
                    className="bg-white dark:bg-[#11141c] rounded-2xl border border-gray-200 dark:border-[#1e2330] p-8 sm:p-12 shadow-[3px_3px_0_0_#181b22] dark:shadow-[3px_3px_0_0_rgba(255,255,255,0.08)] flex flex-col items-center justify-center min-h-[500px]"
                  >
                     <BreathingCircle />
                     <div className="mt-8 text-center border-t border-gray-100 dark:border-[#1e2330] pt-4 w-full max-w-sm">
                       <p className="text-gray-400 font-mono text-xs">"Inhale tranquility. Exhale urgency."</p>
                     </div>
                  </motion.div>
                )}

                {activeGame === 'bloom' && (
                  <motion.div 
                    key="bloom" 
                    initial={{opacity:0, scale:0.97}} 
                    animate={{opacity:1, scale:1}} 
                    exit={{opacity:0, scale:0.97}}
                    className="bg-white dark:bg-[#11141c] rounded-2xl border border-gray-200 dark:border-[#1e2330] p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px] shadow-[3px_3px_0_0_#181b22] dark:shadow-[3px_3px_0_0_rgba(255,255,255,0.08)]"
                  >
                     <div className="absolute top-8 left-8 opacity-10">
                        <Maximize2 size={80} className="text-primary-500" />
                     </div>
                     <motion.div 
                        whileHover={{ scale: 2.2, rotate: 45 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="w-24 h-24 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-2xl shadow-[4px_4px_0_0_#181b22] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] relative z-10 cursor-pointer border-2 border-white/20"
                     />
                     <div className="mt-16 text-center z-10">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                           <MousePointer2 size={18} className="text-primary-500" />
                           Interactive Expansion
                        </h2>
                        <p className="text-gray-500 dark:text-neutral-400 max-w-sm text-xs leading-relaxed">
                          Hover your cursor and breathe rhythmically with the shape. Let your mind expand outward without holding tension.
                        </p>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
