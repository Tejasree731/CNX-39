import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Calendar, MessageSquare, Award, TrendingUp,
  ShieldCheck, HeartHandshake, BookOpen, Sparkles,
  Brain, Target, ChevronRight, Zap, Star,
  ClipboardCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const TIPS = [
  "Check in with your mentee's mood before jumping into goals.",
  "Active listening is more powerful than advice.",
  "Celebrate small wins — they build long-term momentum.",
  "Refer to a therapist if a mentee shows signs of clinical depression.",
  "Share one personal struggle to build authentic trust.",
];

export default function MentorDashboard() {
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipIndex] = useState(Math.floor(Math.random() * TIPS.length));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    Promise.all([
      fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
    ]).then(async ([bRes]) => {
      if (bRes.ok) setBookings(await bRes.json());
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const upcomingCount = bookings.filter(b => new Date(b.date) >= new Date()).length;
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const STAT_CARDS = [
    { label: 'Scheduled Sessions', value: upcomingCount, icon: Calendar, color: 'violet', suffix: 'upcoming' },
    { label: 'Impact Score', value: '92%', icon: Target, color: 'jade', suffix: 'peer effectiveness' },
    { label: 'Avg Mentee Rating', value: '4.9', icon: Star, color: 'amber', suffix: '/ 5.0' },
    { label: 'Community Posts', value: '—', icon: MessageSquare, color: 'magenta', suffix: 'community' },
  ];

  const COLOR = {
    violet:  'bg-violet-600/20 text-violet-400 border border-violet-500/30',
    jade:    'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30',
    amber:   'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    magenta: 'bg-magenta-500/20 text-magenta-400 border border-magenta-500/30',
  };

  return (
    <div className="min-h-screen bg-[#07050f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow mesh */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-magenta-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-violet-700 via-fuchsia-700 to-magenta-600 rounded-[3rem] p-8 sm:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_20px_50px_rgba(124,58,237,0.3)] relative overflow-hidden border border-white/10"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-200 mb-3">{today}</p>
            <h1 className="text-3xl sm:text-4xl font-black italic tracking-tight mb-2 flex items-center gap-3">
              {user.name?.split(' ')[0] || 'Mentor'} <Award size={32} className="text-amber-300" />
            </h1>
            <p className="text-sm text-violet-100/90 font-medium max-w-md">
              Your guidance is actively shaping the wellbeing of Hyderabad's youth.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <div className="bg-white/15 border border-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-violet-200 mb-1">Role</p>
              <p className="text-sm font-black capitalize text-white">{user.role || 'Mentor'}</p>
            </div>
            <div className="bg-white/15 border border-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-violet-200 mb-1">Status</p>
              <p className="text-sm font-black flex items-center gap-1.5 text-white">
                <span className="w-2 h-2 rounded-full bg-secondary-400 inline-block shadow-[0_0_8px_#10c07a]" /> Active
              </p>
            </div>
          </div>
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </motion.div>

        {/* ── Daily Mentor Tip ── */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-500/10 border border-amber-500/25 rounded-3xl px-7 py-5 flex items-start gap-4 shadow-sm"
        >
          <Sparkles size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[9px] font-black text-amber-400 uppercase tracking-[0.2em] mb-1">Daily Mentor Insight</p>
            <p className="text-sm text-amber-200/90 font-semibold italic">"{TIPS[tipIndex]}"</p>
          </div>
        </motion.div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STAT_CARDS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-[#0d0a1a] p-6 rounded-[2rem] border border-[#1e1535] hover:border-violet-500/40 shadow-sm transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${COLOR[s.color]}`}>
                  <Icon size={18} />
                </div>
                <p className="text-[9px] font-black text-violet-400/60 uppercase tracking-widest mb-1">{s.label}</p>
                <h3 className="text-2xl font-black text-white italic">{loading ? '…' : s.value}</h3>
                <p className="text-[9px] text-violet-400/50 font-semibold mt-1 uppercase tracking-widest">{s.suffix}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Main Layout ── */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left: Upcoming Sessions ── */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#0d0a1a] rounded-[3rem] p-8 border border-[#1e1535] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[9px] font-black text-violet-400/60 uppercase tracking-[0.2em] mb-1">Live Schedule</p>
                  <h2 className="text-xl font-black text-white italic">Upcoming Sessions</h2>
                </div>
                <button
                  onClick={() => navigate('/calendar')}
                  className="text-[9px] font-black text-secondary-400 uppercase tracking-widest flex items-center gap-1 hover:underline cursor-pointer"
                >
                  Planning Hub <ChevronRight size={12} />
                </button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1,2].map(i => <div key={i} className="h-16 bg-[#130d28] rounded-2xl animate-pulse" />)}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12 text-violet-400/40">
                  <Calendar size={32} className="mx-auto mb-3 opacity-30 text-violet-400" />
                  <p className="text-xs font-bold uppercase tracking-widest">No upcoming sessions</p>
                  <p className="text-[10px] mt-1">Sessions booked by youth will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map(ses => (
                    <div key={ses._id} className="flex items-center gap-4 p-4 bg-[#130d28] rounded-2xl border border-[#261a45] hover:border-violet-500/40 transition-all">
                      <div className="w-10 h-10 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center font-black text-violet-300">
                        {ses.userId?.name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-white truncate">{ses.userId?.name || 'Youth Member'}</p>
                        <p className="text-[10px] text-violet-400/60 font-bold">{ses.date} · {ses.timeSlot}</p>
                      </div>
                      <span className="px-3 py-1 bg-secondary-500/15 border border-secondary-500/30 text-secondary-300 text-[9px] font-black uppercase tracking-widest rounded-full">
                        {ses.status || 'Confirmed'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Mentor Toolkit ── */}
            <div>
              <div className="flex items-center justify-between mb-5 px-1">
                <h2 className="text-xl font-black text-white italic">Mentor Toolkit</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  {
                    title: 'Planning Hub',
                    desc: 'Manage your mentorship schedule and personal growth events.',
                    icon: Calendar,
                    color: 'violet',
                    action: () => navigate('/calendar'),
                  },
                  {
                    title: 'Community Forum',
                    desc: 'Connect with mentees and fellow mentors in the peer network.',
                    icon: HeartHandshake,
                    color: 'magenta',
                    action: () => navigate('/community'),
                  },
                  {
                    title: 'Wellbeing Journal',
                    desc: 'Maintain reflective notes on your mentorship experiences.',
                    icon: BookOpen,
                    color: 'jade',
                    action: () => navigate('/notes'),
                  },
                  {
                    title: 'Psychometric Lab',
                    desc: 'Access GAD-7, PHQ-9, RQ-10, and SCS-8 assessments for self-check.',
                    icon: ClipboardCheck,
                    color: 'amber',
                    action: () => navigate('/assessments'),
                  },
                  {
                    title: 'Mentee Progress',
                    desc: 'View wellness milestones and growth patterns for your assigned youth.',
                    icon: TrendingUp,
                    color: 'violet',
                    action: () => navigate('/mentor/mentees'),
                  },
                  {
                    title: 'Ethics & Guidelines',
                    desc: 'Professional conduct and safeguarding resources for peer mentors.',
                    icon: ShieldCheck,
                    color: 'magenta',
                    action: () => toast.info('Ethics portal being finalized.'),
                  },
                ].map((card, i) => {
                  const Icon = card.icon;
                  const c = COLOR[card.color];
                  return (
                    <motion.button
                      key={card.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      whileHover={{ y: -3 }}
                      onClick={card.action}
                      className="bg-[#0d0a1a] p-7 rounded-[2rem] border border-[#1e1535] hover:border-violet-500/40 shadow-sm text-left flex flex-col gap-3 relative overflow-hidden group cursor-pointer transition-all"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white italic mb-1">{card.title}</h3>
                        <p className="text-[10px] text-violet-300/60 font-medium leading-relaxed">{card.desc}</p>
                      </div>
                      <ChevronRight size={14} className="text-violet-400/40 group-hover:text-violet-200 transition-colors absolute right-5 top-1/2 -translate-y-1/2" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right: Sidebar ── */}
          <div className="space-y-6">
            {/* Impact Pulse */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-violet-900/70 via-[#190f33] to-[#0c071d] border border-violet-500/30 rounded-[3rem] p-8 text-white text-center shadow-[0_15px_40px_rgba(124,58,237,0.25)] relative overflow-hidden"
            >
              <Zap size={32} className="mx-auto mb-3 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              <h2 className="text-5xl font-black italic mb-1 bg-gradient-to-r from-violet-200 to-white bg-clip-text text-transparent">92%</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">Peer Effectiveness<br />Index</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-[#130d28] border border-[#261a45] rounded-2xl p-3">
                  <p className="text-lg font-black text-white">{bookings.length}</p>
                  <p className="text-[8px] uppercase font-black text-violet-400/60 tracking-widest">Sessions</p>
                </div>
                <div className="bg-[#130d28] border border-[#261a45] rounded-2xl p-3">
                  <p className="text-lg font-black text-amber-400">4.9★</p>
                  <p className="text-[8px] uppercase font-black text-violet-400/60 tracking-widest">Rating</p>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
            </motion.div>

            {/* Quick Actions */}
            <div className="bg-[#0d0a1a] rounded-[2.5rem] p-7 border border-[#1e1535] shadow-sm">
              <p className="text-[9px] font-black text-violet-400 uppercase tracking-[0.2em] mb-4">Quick Actions</p>
              <div className="space-y-2">
                {[
                  { label: 'View Full Calendar', icon: Calendar, action: () => navigate('/calendar') },
                  { label: 'Message Mentees', icon: MessageSquare, action: () => navigate('/community') },
                  { label: 'Take Assessment', icon: Brain, action: () => navigate('/assessments') },
                  { label: 'My Profile', icon: Users, action: () => navigate('/profile') },
                  { label: 'Mentee Progress', icon: TrendingUp, action: () => navigate('/mentor/mentees') },
                ].map(q => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.label}
                      onClick={q.action}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-[#130d28] transition-all group cursor-pointer"
                    >
                      <Icon size={15} className="text-violet-400/60 group-hover:text-violet-300 transition-colors" />
                      <span className="text-xs font-bold text-violet-300/80 group-hover:text-white transition-colors">{q.label}</span>
                      <ChevronRight size={12} className="ml-auto text-violet-400/40 group-hover:text-violet-300 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Wellbeing Prompt */}
            <div className="bg-secondary-500/10 border border-secondary-500/25 rounded-3xl p-6 shadow-sm">
              <p className="text-[9px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-2">Mentor Self-Care</p>
              <p className="text-xs text-secondary-200/80 font-medium leading-relaxed mb-4">
                You can't pour from an empty cup. Check your own wellbeing with a quick assessment today.
              </p>
              <button
                onClick={() => navigate('/assessments')}
                className="w-full bg-gradient-to-r from-secondary-600 to-teal-600 hover:from-secondary-500 hover:to-teal-500 text-white font-black py-3 rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(16,192,122,0.3)] cursor-pointer"
              >
                Take Wellness Check
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
