import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  HeartPulse, 
  BrainCircuit, 
  Activity, 
  Users, 
  ArrowRight, 
  UserPlus, 
  EyeOff, 
  Gamepad2, 
  BookOpen, 
  Clock, 
  Flame, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles,
  Lock,
  ChevronRight,
  HelpCircle,
  Award,
  Globe
} from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const { t } = useTranslation();
  const [liveClock, setLiveClock] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLiveClock(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-violet-50 dark:bg-[#07050f] text-gray-800 dark:text-violet-100 transition-colors duration-300">
      
      {/* ─── 1. HERO BENTO SHOWCASE ────────────────────────────────────────────── */}
      <section className="pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Top Ticker Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary-200 dark:border-violet-900/50 bg-primary-50 dark:bg-violet-950/40 text-primary-700 dark:text-violet-400 text-xs font-mono font-bold shadow-[2px_2px_0_0_#6d28d9]">
            <span className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
            <span>SVASTHYA PLATFORM v2.5 ● LIVE</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-gray-500 dark:text-violet-400/60">
            <span className="hidden sm:inline">GLOBAL SAFE HAVEN</span>
            <span className="border-l border-gray-300 dark:border-violet-800 pl-4">LOCAL TIME: {liveClock}</span>
          </div>
        </div>

        {/* Master Bento Grid Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-auto">
          
          {/* Bento Card 1: Main Mission Banner (Hero Anchor) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0d0a1a] p-6 sm:p-10 rounded-2xl border border-violet-100 dark:border-[#1e1535] shadow-[3px_3px_0_0_#1a1030] dark:shadow-[3px_3px_0_0_rgba(124,58,237,0.2)] flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-violet-300 dark:border-violet-700 bg-violet-100 dark:bg-violet-900/30 text-[10px] font-mono font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300 shadow-[1px_1px_0_0_#1a1030]">
                <Sparkles size={12} className="text-primary-500 dark:text-violet-400" /> Safe Space for Youth
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.15]">
                Empathetic Tech for <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-fuchsia-400 to-pink-400">
                  Adolescent Wellbeing.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-gray-600 dark:text-violet-300/70 max-w-xl leading-relaxed">
                An AI-guided sanctuary where youth express emotions without judgment, connect with trained peer mentors, track resilience milestones, and access clinical psychometrics.
              </p>
            </div>

            <div className="pt-8 flex flex-wrap items-center gap-3 relative z-10">
              <Link to="/signup" className="btn-tactile-accent px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
                {t('hero.get_support', 'Get Free Support')} <ArrowRight size={16} />
              </Link>
              <Link to="/#solutions" className="btn-tactile px-5 py-2.5 rounded-xl text-sm font-bold text-gray-800 dark:text-violet-200">
                Explore Modules
              </Link>
              <div className="text-[11px] font-mono text-gray-500 dark:text-violet-400/60 sm:ml-2">
                100% Free & Confidential
              </div>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-fuchsia-500/8 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Bento Card 2: Interactive AI Empathy Preview */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0d0a1a] p-6 rounded-2xl border border-violet-100 dark:border-[#1e1535] shadow-[3px_3px_0_0_#1a1030] dark:shadow-[3px_3px_0_0_rgba(124,58,237,0.2)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white flex items-center justify-center font-bold text-sm shadow-[2px_2px_0_0_#1a1030]">
                    <BrainCircuit size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-tight dark:text-white">Svasthya AI Companion</h3>
                    <p className="text-[10px] font-mono text-secondary-500 dark:text-secondary-400 font-bold">● Active Listening Engine</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border border-primary-300 dark:border-violet-800 bg-primary-50 dark:bg-violet-950/40 text-primary-600 dark:text-violet-400">
                  Gemini 2.5
                </span>
              </div>

              {/* Chat Simulation */}
              <div className="space-y-2.5 my-3">
                <div className="bg-gray-50 dark:bg-[#13102a] p-3 rounded-xl border border-violet-100 dark:border-[#1e1535] text-xs">
                  <p className="font-mono text-[9px] text-gray-400 dark:text-violet-400/60 mb-1 uppercase font-bold">Anonymous Youth</p>
                  <p className="text-gray-700 dark:text-violet-200">"Exam pressure is piling up and I feel constantly on edge..."</p>
                </div>
                <div className="bg-primary-50/70 dark:bg-violet-950/30 p-3 rounded-xl border border-primary-200 dark:border-violet-900/50 text-xs">
                  <p className="font-mono text-[9px] text-primary-600 dark:text-violet-400 mb-1 uppercase font-bold">Svasthya AI Response</p>
                  <p className="text-gray-800 dark:text-violet-200">
                    "It's completely understandable to feel overwhelmed. Let's do a 2-minute 4-7-8 breathing pause to reset your nervous system first."
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('svasthya-open-chat'))}
              className="btn-tactile w-full py-2 rounded-xl text-xs font-bold text-primary-600 dark:text-violet-400 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <MessageCircle size={14} /> Chat Anonymously With AI →
            </button>
          </div>

          {/* Bento Card 3: MAGENTA POP CARD (Daily Check-in) — replaces coral */}
          <div className="lg:col-span-3 bg-gradient-to-br from-[#ec4899] to-[#a855f7] text-white p-5 rounded-2xl border-2 border-[#1a1030] shadow-[3px_3px_0_0_#1a1030] dark:shadow-[3px_3px_0_0_rgba(236,72,153,0.4)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <Flame size={14} /> Mood Vitals
              </span>
              <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border border-white/40 bg-white/20 shadow-[1px_1px_0_0_rgba(0,0,0,0.2)]">
                Daily
              </span>
            </div>

            <div className="flex items-center justify-around my-2">
              <div className="text-center">
                <div className="bg-white/20 border border-white/40 px-3 py-1 rounded-lg font-mono font-black text-lg shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
                  7d
                </div>
                <span className="text-[9px] font-bold uppercase mt-0.5 block opacity-80">Streak</span>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <div className="bg-white/20 border border-white/40 px-3 py-1 rounded-lg font-mono font-black text-lg shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
                  4.8/5
                </div>
                <span className="text-[9px] font-bold uppercase mt-0.5 block opacity-80">Calm Score</span>
              </div>
            </div>

            <p className="text-[10px] font-bold border-t border-white/20 pt-2 flex items-center justify-between">
              <span>Reflective Journal</span>
              <Link to="/notes" className="underline hover:opacity-80 transition-opacity">Open Notes →</Link>
            </p>
          </div>

          {/* Bento Card 4: Psychometric Lab Card */}
          <div className="lg:col-span-3 bg-white dark:bg-[#0d0a1a] p-5 rounded-2xl border border-violet-100 dark:border-[#1e1535] shadow-[3px_3px_0_0_#1a1030] dark:shadow-[3px_3px_0_0_rgba(124,58,237,0.2)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-violet-400/60">Clinical Psychometrics</p>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-secondary-500/40 text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-950/30 font-bold">Standardized</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">GAD-7 & PHQ-9</h3>
              <p className="text-xs text-gray-500 dark:text-violet-300/50 mt-1">
                Validated psychological screeners with automated resilience reporting.
              </p>
            </div>
            <Link to="/assessments" className="btn-tactile w-full py-1.5 rounded-xl text-xs font-bold text-center mt-3 block">
              Take Free Assessment →
            </Link>
          </div>

          {/* Bento Card 5: Zen Hub Mindfulness Mini-Preview */}
          <div className="lg:col-span-3 bg-white dark:bg-[#0d0a1a] p-5 rounded-2xl border border-violet-100 dark:border-[#1e1535] shadow-[3px_3px_0_0_#1a1030] dark:shadow-[3px_3px_0_0_rgba(124,58,237,0.2)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-violet-400/60">Mindfulness Engine</p>
                <Gamepad2 size={16} className="text-primary-500 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Zen Hub Rituals</h3>
              <p className="text-xs text-gray-500 dark:text-violet-300/50 mt-1">
                Interactive breathing visualizer & cognitive refocusing mini-rituals.
              </p>
            </div>
            <Link to="/relax" className="btn-tactile w-full py-1.5 rounded-xl text-xs font-bold text-center mt-3 block">
              Launch Zen Play →
            </Link>
          </div>

          {/* Bento Card 6: Community & Safe Anonymity */}
          <div className="lg:col-span-3 bg-white dark:bg-[#0d0a1a] p-5 rounded-2xl border border-violet-100 dark:border-[#1e1535] shadow-[3px_3px_0_0_#1a1030] dark:shadow-[3px_3px_0_0_rgba(124,58,237,0.2)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-violet-400/60">Zero-Stigma</p>
                <Lock size={14} className="text-secondary-500 dark:text-secondary-400" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Peer Circles</h3>
              <p className="text-xs text-gray-500 dark:text-violet-300/50 mt-1">
                Moderated anonymous forums and 1-on-1 connections with trained peer mentors.
              </p>
            </div>
            <Link to="/community" className="btn-tactile w-full py-1.5 rounded-xl text-xs font-bold text-center mt-3 block">
              Join Communities →
            </Link>
          </div>

        </div>
      </section>

      {/* ─── 2. WHY THIS MATTERS (STATISTICAL BENTO MATRIX) ───────────────────────── */}
      <section id="why-it-matters" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-violet-100 dark:border-[#1e1535]">
        <FadeIn className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-violet-300 dark:border-violet-700 bg-violet-100 dark:bg-violet-900/30 text-[10px] font-mono font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300 mb-3 shadow-[1px_1px_0_0_#1a1030]">
            Evidence-Based Urgency
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {t('navbar.why_it_matters', 'Why Early Intervention Matters')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-violet-300/60 mt-3 leading-relaxed">
            Mental health stigma and fear of judgment continue to prevent youth from seeking timely support.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { stat: '50%', label: 'Of conditions begin before age 14', sub: 'Early intervention changes lifelong trajectory', color: 'text-violet-600 dark:text-violet-400', border: 'border-violet-500/30 dark:border-violet-700/50', bg: 'dark:bg-violet-950/20' },
            { stat: '90%', label: 'Underserved in vulnerable groups', sub: 'Lack of accessible mental healthcare', color: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/30', bg: 'dark:bg-rose-950/10' },
            { stat: '1 in 7', label: 'Adolescents face emotional distress', sub: 'Global WHO mental health index', color: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30', bg: 'dark:bg-amber-950/10' },
            { stat: '100%', label: 'Anonymous & Zero-Trace', sub: 'No real identity required to get help', color: 'text-secondary-600 dark:text-secondary-400', border: 'border-secondary-500/30', bg: 'dark:bg-secondary-950/10' },
          ].map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className={`bg-white dark:bg-[#0d0a1a] ${item.bg} p-6 rounded-2xl border ${item.border} shadow-[3px_3px_0_0_#1a1030] dark:shadow-[3px_3px_0_0_rgba(124,58,237,0.1)] h-full flex flex-col justify-between`}>
                <div className={`text-4xl font-mono font-black ${item.color} mb-2`}>
                  {item.stat}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{item.label}</h3>
                  <p className="text-[11px] text-gray-500 dark:text-violet-300/50 mt-1">{item.sub}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── 3. PLATFORM SOLUTIONS (BENTO SOUNDBOARD) ─────────────────────────────── */}
      <section id="solutions" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-violet-100 dark:border-[#1e1535]">
        <FadeIn className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary-600 dark:text-violet-400 block mb-1">
              Multi-Role Ecosystem
            </span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {t('home.solution_title', 'What This Platform Delivers')}
            </h2>
          </div>
          <div className="text-xs font-mono text-gray-500 dark:text-violet-400/50">
            4 INTEGRATED PATHWAYS
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Youth Wellbeing Hub',
              desc: 'Self-guided assessments, mood tracking, reflective journaling, and real-time planning.',
              icon: <Activity className="text-violet-500" size={24} />,
              tag: 'Personal Journey',
              path: '/dashboard',
              accent: 'violet'
            },
            {
              title: 'Peer Mentorship',
              desc: 'Trained adolescent leaders offering empathetic guidance and community moderation.',
              icon: <Users className="text-secondary-500" size={24} />,
              tag: 'Community',
              path: '/community',
              accent: 'jade'
            },
            {
              title: 'Clinical Tele-Sessions',
              desc: 'Direct connection to licensed therapists with automated availability guards and booking.',
              icon: <HeartPulse className="text-magenta-500 dark:text-pink-400" size={24} />,
              tag: 'Professional',
              path: '/community',
              accent: 'magenta'
            },
            {
              title: 'NGO Oversight & Data',
              desc: 'Aggregated analytics and impact indices enabling partner NGOs to measure youth resilience.',
              icon: <ShieldCheck className="text-amber-500" size={24} />,
              tag: 'Impact Analytics',
              path: '/admin',
              accent: 'amber'
            }
          ].map((card, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="bg-white dark:bg-[#0d0a1a] p-6 rounded-2xl border border-violet-100 dark:border-[#1e1535] shadow-[3px_3px_0_0_#1a1030] dark:shadow-[3px_3px_0_0_rgba(124,58,237,0.15)] hover:shadow-[1px_1px_0_0_#1a1030] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex flex-col justify-between h-full group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl border border-violet-100 dark:border-violet-800/40 bg-violet-50 dark:bg-violet-900/20 shadow-[2px_2px_0_0_#1a1030] dark:shadow-[2px_2px_0_0_rgba(124,58,237,0.2)] group-hover:scale-105 transition-transform">
                      {card.icon}
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-violet-200 dark:border-violet-800/40 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
                      {card.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-violet-300/60 leading-relaxed">{card.desc}</p>
                </div>
                <Link to={card.path} className="mt-6 pt-3 border-t border-violet-100 dark:border-[#1e1535] text-xs font-bold text-primary-600 dark:text-violet-400 flex items-center justify-between group-hover:underline">
                  <span>Enter Module</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── 4. HOW IT WORKS (STEPPED BENTO TIMELINE) ─────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-violet-100 dark:border-[#1e1535]">
        <FadeIn className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary-600 dark:text-violet-400 block mb-1">
            Structured Progression
          </span>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            How The Journey Unfolds
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { step: '01', title: 'Safe Onboarding', desc: 'Join anonymously without sharing identifying details.', color: 'text-violet-500 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/40', border: 'border-violet-500/30 dark:border-violet-700/50' },
            { step: '02', title: 'Daily Self-Care', desc: 'Log reflections and complete guided 2-minute rituals.', color: 'text-fuchsia-500 dark:text-fuchsia-400', bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/30', border: 'border-fuchsia-500/30' },
            { step: '03', title: 'Peer Camaraderie', desc: 'Connect with mentors who understand youth pressures.', color: 'text-secondary-600 dark:text-secondary-400', bg: 'bg-secondary-50 dark:bg-secondary-950/30', border: 'border-secondary-500/30' },
            { step: '04', title: 'Clinical Testing', desc: 'Access clinical GAD-7 and PHQ-9 psychometrics.', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-500/30' },
            { step: '05', title: 'Resilience Growth', desc: 'Watch your emotional strength evolve over time.', color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-950/30', border: 'border-pink-500/30' },
          ].map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.08}>
              <div className="bg-white dark:bg-[#0d0a1a] p-4 rounded-xl border border-violet-100 dark:border-[#1e1535] shadow-[2px_2px_0_0_#1a1030] dark:shadow-[2px_2px_0_0_rgba(124,58,237,0.12)] h-full">
                <span className={`text-xs font-mono font-black ${item.color} border ${item.border} px-2 py-0.5 rounded ${item.bg} inline-block mb-3`}>
                  {item.step}
                </span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-[11px] text-gray-500 dark:text-violet-300/50 leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── 5. FINAL CALL TO ACTION BENTO BOX ───────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#13102a] via-[#1a0d2e] to-[#0d0a1a] dark:from-[#0d0a1a] dark:via-[#13102a] dark:to-[#07050f] text-white p-8 sm:p-12 rounded-3xl border-2 border-violet-800/50 dark:border-[#1e1535] shadow-[4px_4px_0_0_#1a1030] dark:shadow-[4px_4px_0_0_rgba(124,58,237,0.3)] relative overflow-hidden text-center">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-violet-400 border border-violet-500/30 px-3 py-1 rounded-full bg-violet-950/50 inline-block">
              Sanctuary Awaits
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 text-transparent bg-clip-text">
              You Don't Have to Carry It Alone.
            </h2>
            <p className="text-xs sm:text-sm text-violet-300/70 leading-relaxed">
              Step into a judgment-free space designed by youth and clinical mentors to give you the mental clarity and resilience you deserve.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link to="/signup" className="btn-tactile-accent px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white">
                Join Svasthya Free
              </Link>
              <Link to="/donate" className="btn-tactile px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-violet-200 dark:text-violet-200 bg-[#1e1535] border-violet-700">
                Support Our Mission
              </Link>
            </div>
          </div>

          <div className="absolute -top-16 -left-16 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-800/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

    </div>
  );
}
