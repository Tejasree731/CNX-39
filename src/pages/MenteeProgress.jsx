import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, AlertCircle, ChevronLeft, Brain, Target,
  Zap, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SEVERITY_BADGE = {
  'None-Minimal':      'bg-secondary-500/20 border border-secondary-500/30 text-secondary-300',
  'Mild':              'bg-amber-500/20 border border-amber-500/30 text-amber-300',
  'Moderate':          'bg-orange-500/20 border border-orange-500/30 text-orange-300',
  'Moderately Severe': 'bg-pink-500/20 border border-pink-500/30 text-pink-300',
  'Severe':            'bg-magenta-500/30 border border-magenta-500/50 text-magenta-300',
  'Fragile':           'bg-pink-500/20 border border-pink-500/30 text-pink-300',
  'Developing':        'bg-amber-500/20 border border-amber-500/30 text-amber-300',
  'Strong':            'bg-violet-500/20 border border-violet-500/30 text-violet-300',
  'Champion':          'bg-secondary-500/20 border border-secondary-500/30 text-secondary-300',
};

const CATEGORY_LABELS = {
  academic_stress:  'Academic Stress',
  social_anxiety:   'Social Anxiety',
  family_conflict:  'Family Conflict',
  grief_loss:       'Grief & Loss',
  identity_crisis:  'Identity',
  substance_risk:   'Substance Risk',
  self_harm_risk:   '⚠ Self-Harm Risk',
  general_wellness: 'General Wellness',
};

export default function MenteeProgress() {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/ratings/mentees/progress', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setMentees(data))
      .catch(() => toast.error('Could not load mentee data.'))
      .finally(() => setLoading(false));
  }, []);

  const crisisCount = mentees.filter(m => m.isCrisisRisk).length;

  return (
    <div className="min-h-screen bg-[#07050f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient mesh */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-magenta-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-violet-700 via-fuchsia-700 to-magenta-600 rounded-[3rem] p-8 sm:p-10 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(124,58,237,0.35)] border border-white/10"
        >
          <button onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-violet-200 hover:text-white mb-6 transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="text-3xl sm:text-4xl font-black italic mb-2 flex items-center gap-3">
            <Users size={28} className="text-white" /> Mentee Progress Hub
          </h1>
          <p className="text-sm text-violet-100/90 font-medium">Phase 4 — Track your youth members' wellbeing over time</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-3 rounded-2xl">
              <p className="text-[9px] font-black uppercase tracking-widest text-violet-200 mb-1">Total Mentees</p>
              <p className="text-xl font-black text-white">{mentees.length}</p>
            </div>
            {crisisCount > 0 && (
              <div className="bg-red-500/25 border border-red-400/40 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <AlertCircle size={18} className="text-red-300" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-red-200 mb-1">Crisis Flagged</p>
                  <p className="text-xl font-black text-white">{crisisCount}</p>
                </div>
              </div>
            )}
          </div>
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </motion.div>

        {/* Crisis Alert */}
        {crisisCount > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-red-950/40 border-2 border-red-500/40 rounded-3xl p-6 flex items-start gap-4 shadow-[0_0_25px_rgba(239,68,68,0.25)]"
          >
            <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-red-300 mb-1">{crisisCount} mentee(s) flagged for crisis risk</p>
              <p className="text-xs text-red-200/80 font-medium leading-relaxed">
                Please reach out to these individuals immediately and follow the Svasthya Safeguarding Protocol. Consider escalating to a clinical therapist.
              </p>
            </div>
          </motion.div>
        )}

        {/* Mentee Cards */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-[#0d0a1a] rounded-3xl border border-[#1e1535] animate-pulse" />
            ))}
          </div>
        ) : mentees.length === 0 ? (
          <div className="bg-[#0d0a1a] rounded-[3rem] p-16 text-center border border-[#1e1535]">
            <Users size={40} className="mx-auto text-violet-400/40 mb-4" />
            <h3 className="text-lg font-black text-white italic mb-2">No Mentees Yet</h3>
            <p className="text-sm text-violet-300/60 font-medium max-w-sm mx-auto">
              Youth who book sessions with you will appear here with their full wellbeing profile.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mentees.map((m, i) => {
              const isOpen = expanded === m._id;
              const sevBadge = m.latestAssessment
                ? SEVERITY_BADGE[m.latestAssessment.severity] || 'bg-violet-500/20 text-violet-300'
                : null;

              return (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`bg-[#0d0a1a] rounded-[2.5rem] border shadow-sm overflow-hidden transition-all ${
                    m.isCrisisRisk
                      ? 'border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                      : 'border-[#1e1535] hover:border-violet-500/40'
                  }`}
                >
                  {/* Card Header */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : m._id)}
                    className="w-full flex items-center gap-5 p-6 text-left hover:bg-[#130d28] transition-colors cursor-pointer"
                  >
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 border ${
                      m.isCrisisRisk
                        ? 'bg-red-500/20 border-red-500/40 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : 'bg-violet-600/20 border-violet-500/30 text-violet-300 shadow-[0_0_10px_rgba(124,58,237,0.2)]'
                    }`}>
                      {m.name?.charAt(0) || '?'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-black text-white truncate">{m.name}</p>
                        {m.isCrisisRisk && (
                          <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/40 text-red-300 text-[8px] font-black uppercase tracking-widest rounded-full flex-shrink-0">
                            ⚠ Crisis Risk
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-violet-400/60 font-bold">
                        {CATEGORY_LABELS[m.primaryCategory] || 'General Wellness'} · Level {m.level} · {m.xp} XP
                      </p>
                    </div>

                    {/* Latest Assessment */}
                    <div className="text-right shrink-0 hidden sm:block">
                      {m.latestAssessment ? (
                        <>
                          <p className="text-xs font-black text-white italic">{m.latestAssessment.type}: {m.latestAssessment.score}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest mt-1 inline-block ${sevBadge}`}>
                            {m.latestAssessment.severity}
                          </span>
                        </>
                      ) : (
                        <p className="text-[10px] text-violet-400/50 font-bold">No assessment</p>
                      )}
                    </div>

                    {/* Milestone Progress */}
                    <div className="shrink-0 hidden md:flex flex-col items-end gap-1 w-28">
                      <p className="text-[9px] font-black text-violet-400/60 uppercase tracking-widest">Milestones</p>
                      <div className="w-full h-1.5 bg-[#130d28] rounded-full overflow-hidden border border-[#261a45]">
                        <motion.div
                          className="h-full bg-gradient-to-r from-violet-500 to-magenta-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${m.milestonePercent}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                      <p className="text-[9px] font-black text-violet-400">{m.milestonePercent}%</p>
                    </div>

                    {isOpen ? <ChevronUp size={16} className="text-violet-400 shrink-0" /> : <ChevronDown size={16} className="text-violet-400/60 shrink-0" />}
                  </button>

                  {/* Expanded Detail */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-[#1e1535]"
                      >
                        <div className="px-6 pb-6 pt-4 grid sm:grid-cols-3 gap-5 bg-[#07050f]/60">
                          {/* Milestone Detail */}
                          <div className="bg-[#130d28] rounded-2xl p-5 border border-[#261a45]">
                            <p className="text-[9px] font-black text-violet-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Target size={12} className="text-secondary-400" /> Milestones
                            </p>
                            <p className="text-2xl font-black text-white italic">{m.completedMilestones}/{m.milestoneCount}</p>
                            <div className="mt-3 h-2 bg-[#07050f] rounded-full overflow-hidden border border-[#261a45]">
                              <div className="h-full bg-gradient-to-r from-violet-500 to-magenta-500 rounded-full transition-all" style={{ width: `${m.milestonePercent}%` }} />
                            </div>
                          </div>

                          {/* XP & Level */}
                          <div className="bg-[#130d28] rounded-2xl p-5 border border-[#261a45]">
                            <p className="text-[9px] font-black text-violet-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Zap size={12} className="text-amber-400" /> Growth
                            </p>
                            <p className="text-2xl font-black text-white italic">{m.xp} XP</p>
                            <p className="text-[10px] text-violet-300/70 font-bold mt-1">Level {m.level} · {m.primaryCategory ? CATEGORY_LABELS[m.primaryCategory] : 'General'}</p>
                          </div>

                          {/* Latest Assessment */}
                          <div className="bg-[#130d28] rounded-2xl p-5 border border-[#261a45]">
                            <p className="text-[9px] font-black text-violet-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Brain size={12} className="text-magenta-400" /> Latest Assessment
                            </p>
                            {m.latestAssessment ? (
                              <>
                                <p className="text-2xl font-black text-white italic">{m.latestAssessment.score}</p>
                                <p className="text-[10px] font-bold text-violet-300/70 mt-1">{m.latestAssessment.type}</p>
                                <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${sevBadge}`}>
                                  {m.latestAssessment.severity}
                                </span>
                              </>
                            ) : (
                              <p className="text-sm text-violet-400/50 italic">Not yet taken</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
