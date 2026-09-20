import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ChevronRight, Calendar } from 'lucide-react';

export default function InfoModal({ isOpen, onClose, title, description, phase = 3 }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#07050f]/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#0d0a1a] rounded-[3rem] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(124,58,237,0.25)] overflow-hidden border border-[#261a45]"
        >
          {/* Header Image/Pattern */}
          <div className="h-32 bg-gradient-to-r from-violet-700 via-fuchsia-700 to-magenta-600 relative flex items-center justify-center overflow-hidden">
            <Sparkles className="text-white/10 w-32 h-32 absolute -right-4 -bottom-4 animate-spin-slow" />
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
               <Sparkles className="text-white w-8 h-8 drop-shadow" />
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-violet-200 via-fuchsia-100 to-white bg-clip-text text-transparent leading-tight">
                {title}
              </h3>
              <button 
                onClick={onClose}
                className="p-2 text-violet-400 hover:text-white hover:bg-[#16102e] rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-violet-200/70 mb-8 text-base sm:text-lg leading-relaxed font-normal">
              {description}
            </p>

            <div className="bg-[#130d28] p-6 rounded-3xl border border-[#2a1d4a] mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-magenta-400" size={18} />
                <span className="text-sm font-bold text-violet-200">Target Launch: Phase {phase}</span>
              </div>
              <p className="text-xs text-violet-400/70 italic leading-relaxed">
                Our team is working hard to bring this feature to life. We prioritize your privacy and safety, ensuring every tool is meticulously designed.
              </p>
            </div>

            <button 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-violet-600 to-magenta-600 hover:from-violet-500 hover:to-magenta-500 text-white font-bold py-4 rounded-full shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              Continue Exploring <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
