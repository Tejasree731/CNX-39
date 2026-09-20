import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, UserCheck, Stethoscope, Video, FileText,
  Settings, ShieldCheck, Activity, ChevronRight, Brain,
  ClipboardCheck, Bell, Users, BookOpen,
  Sparkles, HeartHandshake, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function TherapistDashboard() {
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setSessions(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const upcoming = sessions.filter(s => new Date(s.date) >= new Date());
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const COLOR = {
    violet:  'bg-violet-600/20 text-violet-400 border border-violet-500/30',
    jade:    'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30',
    amber:   'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    magenta: 'bg-magenta-500/20 text-magenta-400 border border-magenta-500/30',
  };

  const TOOLS = [
    { title: 'Planning Hub', desc: 'Real-time session management and slot availability.', icon: Calendar, color: 'violet', action: () => navigate('/calendar') },
    { title: 'Clinical Assessments', desc: 'View patient GAD-7, PHQ-9, RQ-10 and SCS-8 scores.', icon: ClipboardCheck, color: 'jade', action: () => navigate('/assessments') },
    { title: 'Patient Journal Notes', desc: 'Access AI-analyzed reflective notes from your patients.', icon: BookOpen, color: 'amber', action: () => navigate('/notes') },
    { title: 'Community Network', desc: 'Professional peer forum and mentorship coordination.', icon: HeartHandshake, color: 'magenta', action: () => navigate('/community') },
    { title: 'Clinical Case Records', desc: 'Detailed session history and milestone tracking per patient.', icon: FileText, color: 'violet', action: () => toast.info('Case records — Phase 4 roadmap.') },
    { title: 'Profile & Settings', desc: 'Update your specialization, photo, and availability hours.', icon: Settings, color: 'jade', action: () => navigate('/profile') },
  ];

  return (
    <div className="min-h-screen bg-[#07050f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-secondary-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-800 via-secondary-700 to-violet-900 rounded-[3rem] p-8 sm:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_20px_50px_rgba(16,192,122,0.25)] relative overflow-hidden border border-white/10"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-200/90 mb-3">{today}</p>
            <h1 className="text-3xl sm:text-4xl font-black italic tracking-tight mb-2 flex items-center gap-3">
              Dr. {user.name?.split(' ')[0] || 'Therapist'} <Stethoscope size={32} className="text-white/80" />
            </h1>
            <p className="text-sm text-violet-100/90 font-medium max-w-md">
              Specialization: <strong className="text-white">{user.clinicalSpecialization || 'Adolescent Psychology'}</strong>
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <div className="bg-white/15 border border-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl flex items-center gap-2">
              <ShieldCheck size={16} className="text-secondary-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Verified Expert</span>
            </div>
            <div className="bg-white/15 border border-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl text-center">
              <p className="text-[9px] font-black text-violet-200 uppercase tracking-widest mb-0.5">Patients</p>
              <p className="text-lg font-black text-white">{loading ? '…' : sessions.length}</p>
            </div>
          </div>
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </motion.div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Total Patients', value: sessions.length, icon: UserCheck, color: 'jade' },
            { label: 'Upcoming Sessions', value: upcoming.length, icon: Calendar, color: 'violet' },
            { label: 'Session Completion', value: '98%', icon: Activity, color: 'amber' },
            { label: 'Avg Rating', value: '4.9★', icon: Sparkles, color: 'magenta' },
          ].map((s, i) => {
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
              </motion.div>
            );
          })}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Sessions + Toolkit ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Upcoming Sessions */}
            <div className="bg-[#0d0a1a] rounded-[3rem] p-8 border border-[#1e1535] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[9px] font-black text-violet-400/60 uppercase tracking-[0.2em] mb-1">Real-Time View</p>
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
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-[#130d28] rounded-2xl animate-pulse" />)}
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-12 text-violet-400/40">
                  <Calendar size={32} className="mx-auto mb-3 opacity-30 text-violet-400" />
                  <p className="text-xs font-bold uppercase tracking-widest">No scheduled sessions</p>
                  <p className="text-[10px] mt-1">Session bookings from youth will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.slice(0, 6).map(ses => (
                    <div key={ses._id} className="flex items-center gap-4 p-4 bg-[#130d28] rounded-2xl border border-[#261a45] hover:border-secondary-500/40 transition-all">
                      <div className="w-10 h-10 bg-secondary-500/15 border border-secondary-500/30 rounded-xl flex items-center justify-center font-black text-secondary-300">
                        {ses.userId?.name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-white truncate">{ses.userId?.name || 'Youth Member'}</p>
                        <p className="text-[10px] text-violet-400/60 font-bold">{ses.date} · {ses.timeSlot}</p>
                      </div>
                      <button className="bg-gradient-to-r from-violet-600 to-magenta-600 text-white px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-1.5 hover:from-violet-500 hover:to-magenta-500 transition-all shadow-[0_0_12px_rgba(124,58,237,0.3)] cursor-pointer">
                        <Video size={12} /> Join
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Crisis Alert Banner */}
            <div className="bg-red-950/40 border border-red-500/30 rounded-3xl px-7 py-5 flex items-start gap-4 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] font-black text-red-400 uppercase tracking-[0.2em] mb-1">Clinical Safeguarding</p>
                <p className="text-xs text-red-200/80 font-medium leading-relaxed">
                  If any patient indicates a PHQ-9 score ≥ 15 or expresses self-harm ideation, escalate per the Svasthya Crisis Protocol immediately.
                </p>
              </div>
            </div>

            {/* Practice Toolkit */}
            <div>
              <div className="flex items-center justify-between mb-5 px-1">
                <h2 className="text-xl font-black text-white italic">Practice Toolkit</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {TOOLS.map((card, i) => {
                  const Icon = card.icon;
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
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${COLOR[card.color]}`}>
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

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            {/* Clinical Impact */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-teal-800 via-secondary-800 to-violet-900 rounded-[3rem] p-8 text-white text-center shadow-[0_15px_40px_rgba(16,192,122,0.2)] border border-white/10 relative overflow-hidden"
            >
              <Stethoscope size={32} className="mx-auto mb-3 opacity-60 text-secondary-200" />
              <h2 className="text-5xl font-black italic mb-1">{loading ? '…' : sessions.length}</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 text-violet-200">Total Svasthya<br />Patients</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                  <p className="text-lg font-black">{upcoming.length}</p>
                  <p className="text-[8px] uppercase font-black opacity-70 tracking-widest">Upcoming</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                  <p className="text-lg font-black">98%</p>
                  <p className="text-[8px] uppercase font-black opacity-70 tracking-widest">Completion</p>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            </motion.div>

            {/* Patient Analytics */}
            <div className="bg-[#0d0a1a] rounded-[2.5rem] p-7 border border-[#1e1535] shadow-sm">
              <p className="text-[9px] font-black text-violet-400 uppercase tracking-[0.2em] mb-5">Patient Analytics</p>
              <div className="space-y-5">
                {[
                  { label: 'Session Completion', value: 98, color: 'bg-secondary-400' },
                  { label: 'Avg Satisfaction', value: 98, color: 'bg-violet-500' },
                  { label: 'Crisis Escalations', value: 4, color: 'bg-red-400' },
                  { label: 'Recovery Trend', value: 87, color: 'bg-amber-400' },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold text-violet-300/70">{m.label}</span>
                      <span className="text-[10px] font-black text-white">{m.value}%</span>
                    </div>
                    <div className="h-1.5 bg-[#130d28] rounded-full overflow-hidden border border-[#261a45]">
                      <motion.div
                        className={`h-full ${m.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${m.value}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#0d0a1a] rounded-[2.5rem] p-7 border border-[#1e1535] shadow-sm">
              <p className="text-[9px] font-black text-violet-400 uppercase tracking-[0.2em] mb-4">Quick Actions</p>
              <div className="space-y-2">
                {[
                  { label: 'View Calendar', icon: Calendar, action: () => navigate('/calendar') },
                  { label: 'Psychometric Lab', icon: Brain, action: () => navigate('/assessments') },
                  { label: 'Community Forum', icon: Users, action: () => navigate('/community') },
                  { label: 'My Profile', icon: Settings, action: () => navigate('/profile') },
                  { label: 'Notifications', icon: Bell, action: () => toast.info('Notifications panel coming soon.') },
                ].map(q => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.label}
                      onClick={q.action}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left hover:bg-[#130d28] transition-all group cursor-pointer"
                    >
                      <Icon size={15} className="text-violet-400/60 group-hover:text-secondary-400 transition-colors" />
                      <span className="text-xs font-bold text-violet-300/70 group-hover:text-white transition-colors">{q.label}</span>
                      <ChevronRight size={12} className="ml-auto text-violet-400/40 group-hover:text-secondary-400 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
