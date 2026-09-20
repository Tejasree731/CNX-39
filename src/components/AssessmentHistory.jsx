import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Zap, Users, ChevronDown, ChevronUp } from 'lucide-react';

const TYPE_META = {
  'GAD-7': { icon: Brain,    color: 'violet', label: 'Anxiety' },
  'PHQ-9': { icon: Sparkles, color: 'jade',   label: 'Depression' },
  'RQ-10': { icon: Zap,      color: 'amber',  label: 'Resilience' },
  'SCS-8': { icon: Users,    color: 'magenta',label: 'Connectedness' },
};

const SEVERITY_BADGE = {
  'None-Minimal':      'bg-secondary-500/15 border border-secondary-500/30 text-secondary-300',
  'Mild':              'bg-amber-500/15 border border-amber-500/30 text-amber-300',
  'Moderate':          'bg-orange-500/15 border border-orange-500/30 text-orange-300',
  'Moderately Severe': 'bg-pink-500/15 border border-pink-500/30 text-pink-300',
  'Severe':            'bg-magenta-500/20 border border-magenta-500/40 text-magenta-300',
  'Fragile':           'bg-pink-500/15 border border-pink-500/30 text-pink-300',
  'Developing':        'bg-amber-500/15 border border-amber-500/30 text-amber-300',
  'Strong':            'bg-violet-500/15 border border-violet-500/30 text-violet-300',
  'Champion':          'bg-secondary-500/15 border border-secondary-500/30 text-secondary-300',
  'Isolated':          'bg-magenta-500/20 border border-magenta-500/40 text-magenta-300',
  'At-Risk':           'bg-orange-500/15 border border-orange-500/30 text-orange-300',
  'Connected':         'bg-violet-500/15 border border-violet-500/30 text-violet-300',
  'Thriving':          'bg-secondary-500/15 border border-secondary-500/30 text-secondary-300',
};

const COLOR = {
  violet:  { bg: 'bg-violet-600/20 border border-violet-500/30', text: 'text-violet-400' },
  jade:    { bg: 'bg-secondary-500/20 border border-secondary-500/30', text: 'text-secondary-400' },
  amber:   { bg: 'bg-amber-500/20 border border-amber-500/30', text: 'text-amber-400' },
  magenta: { bg: 'bg-magenta-500/20 border border-magenta-500/30', text: 'text-magenta-400' },
};

export default function AssessmentHistory({ assessments = [] }) {
  const [expanded, setExpanded] = useState(null);

  if (assessments.length === 0) {
    return (
      <div className="text-center py-12 text-violet-300/40">
        <Brain size={32} className="mx-auto mb-3 opacity-30 text-violet-400" />
        <p className="text-xs font-bold uppercase tracking-widest text-violet-300/60">No assessments yet</p>
        <p className="text-[10px] mt-1 text-violet-400/40">Complete an assessment to see your history here</p>
      </div>
    );
  }

  // Show most recent 10, newest first
  const sorted = [...assessments].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

  return (
    <div className="space-y-3">
      {sorted.map((ass, i) => {
        const meta = TYPE_META[ass.type] || TYPE_META['GAD-7'];
        const Icon = meta.icon;
        const c = COLOR[meta.color];
        const badgeClass = SEVERITY_BADGE[ass.severity] || 'bg-violet-500/10 border border-violet-500/20 text-violet-300';
        const isOpen = expanded === ass._id;
        const date = new Date(ass.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

        return (
          <motion.div
            key={ass._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#0d0a1a] rounded-2xl border border-[#1e1535] hover:border-violet-500/40 transition-all overflow-hidden shadow-sm"
          >
            <button
              onClick={() => setExpanded(isOpen ? null : ass._id)}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-[#13102a] transition-colors"
            >
              <div className={`w-9 h-9 ${c.bg} ${c.text} rounded-xl flex items-center justify-center shrink-0 shadow-inner`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-black text-violet-400/60 uppercase tracking-widest">{ass.type}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${badgeClass}`}>
                    {ass.severity}
                  </span>
                </div>
                <p className="text-xs font-black text-violet-100 truncate">{ass.title}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-black text-white italic leading-none">{ass.totalScore}</p>
                <p className="text-[8px] text-violet-400/60 font-bold mt-0.5">{date}</p>
              </div>
              {isOpen ? <ChevronUp size={14} className="text-violet-400 shrink-0" /> : <ChevronDown size={14} className="text-violet-400/60 shrink-0" />}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-[#1e1535]"
                >
                  <div className="p-4 space-y-3 bg-[#07050f]/60">
                    <p className="text-[11px] text-violet-200/80 font-medium leading-relaxed">
                      {ass.clinicalInterpretation}
                    </p>
                    {ass.aiInsight && (
                      <div className="bg-gradient-to-r from-violet-950/50 to-fuchsia-950/40 rounded-xl p-4 border border-violet-500/30">
                        <p className="text-[8px] font-black text-violet-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <Sparkles size={10} className="text-amber-400" />
                          AI Insight
                        </p>
                        <p className="text-[11px] text-violet-100 italic leading-relaxed">
                          "{ass.aiInsight}"
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
