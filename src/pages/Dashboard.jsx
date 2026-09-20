import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Gamepad2, BrainCircuit, Activity, HeartHandshake, FileQuestion, BookOpen, Sparkles, TrendingUp, Zap, Flame, Clock, ArrowUpRight, Heart, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MilestoneTracker from '../components/MilestoneTracker';
import AnalysisResult from '../components/AnalysisResult';
import WellbeingChart from '../components/WellbeingChart';
import AssessmentHistory from '../components/AssessmentHistory';
import DashboardCard from '../components/DashboardCard';
import InfoModal from '../components/InfoModal';
import { toast } from 'sonner';

export default function Dashboard() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({ isOpen: false, title: '', description: '', phase: 3 });
  const [liveTime, setLiveTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLiveTime(now.toLocaleDateString() + ', ' + now.toLocaleTimeString());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
      fetchData();
      
      const isFirstLoad = !sessionStorage.getItem('dashboard_loaded');
      if (isFirstLoad) {
        const userName = JSON.parse(storedUser)?.name?.split(' ')[0] || 'Friend';
        toast(`Welcome back, ${userName}!`, {
          description: "Your wellbeing journey continues today.",
        });
        sessionStorage.setItem('dashboard_loaded', 'true');
      }
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [mRes, aRes, assRes] = await Promise.all([
        fetch('/api/milestones', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/notes/analysis', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/assessments', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (mRes.ok) setMilestones(await mRes.json());
      if (aRes.ok) setAnalysis(await aRes.json());
      if (assRes.ok) setAssessments(await assRes.json());
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-violet-50 dark:bg-[#07050f] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Bento Hero / Identity Card */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0d0a1a] p-6 sm:p-8 rounded-2xl border border-violet-100 dark:border-[#1e1535] shadow-[3px_3px_0_0_#1a1030] dark:shadow-[3px_3px_0_0_rgba(124,58,237,0.2)] relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-12 h-12 rounded-xl border border-violet-300 dark:border-violet-700 bg-violet-100 dark:bg-violet-900/30 text-primary-600 dark:text-violet-400 flex items-center justify-center font-black text-xl shadow-[2px_2px_0_0_#1a1030] dark:shadow-[2px_2px_0_0_rgba(124,58,237,0.25)]">
                  {user.name ? user.name.charAt(0).toUpperCase() : '🌿'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {user.name || 'Friend'}
                    </h1>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-primary-300 dark:border-violet-700 bg-primary-50 dark:bg-violet-950/40 text-primary-600 dark:text-violet-400">
                      {user.role || 'Youth Member'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-violet-400/60 mt-0.5">
                    {t('dashboard.subtitle_youth', 'A safe, reflective space for your daily emotional wellbeing.')}
                  </p>
                </div>
              </div>

              {/* Tags & Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('svasthya-open-chat'))}
                  className="btn-tactile px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer text-primary-700 dark:text-violet-400"
                >
                  <BrainCircuit size={14} /> Svasthya AI
                </button>
                <button 
                  onClick={() => navigate('/notes')}
                  className="btn-tactile px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer text-gray-700 dark:text-violet-200"
                >
                  <BookOpen size={14} /> Write Reflection
                </button>
                <button 
                  onClick={() => navigate('/calendar')}
                  className="btn-tactile px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer text-gray-700 dark:text-violet-200"
                >
                  <Clock size={14} /> Live Agenda
                </button>

                {user.communityTags?.length > 0 && user.communityTags.slice(0, 2).map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border border-violet-200 dark:border-violet-700 text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20">
                    <Sparkles size={10} /> {tag.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Level & XP Box — aurora styled */}
            <div className="bg-gradient-to-br from-[#13102a] to-[#1e1535] dark:from-[#13102a] dark:to-[#0d0a1a] p-5 rounded-xl text-white border-2 border-violet-600/60 shadow-[3px_3px_0_0_#7c3aed] min-w-[200px] w-full lg:w-auto text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1 text-violet-300">
                <TrendingUp size={16} />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">Resilience Level</span>
              </div>
              <p className="text-3xl font-black font-mono bg-gradient-to-r from-violet-300 to-fuchsia-300 text-transparent bg-clip-text">Level {user.level || 1}</p>
              <div className="w-full bg-[#1e1535] h-1.5 rounded-full mt-3 overflow-hidden border border-violet-800">
                <motion.div initial={{width:0}} animate={{width:`${(user.xp || 0)%100}%`}} className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_0_8px_rgba(124,58,237,0.8)]" />
              </div>
              <span className="text-[9px] font-mono text-violet-400/60 mt-1 block">{(user.xp || 0)%100} / 100 XP to next rank</span>
            </div>
          </div>

          {/* Status Bar Footer inside Hero */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-violet-100 dark:border-[#1e1535] mt-5 pt-3 gap-2 text-[10px] text-gray-500 dark:text-violet-400/50">
            <span className="italic">"Healing is not linear, but every mindful pause counts."</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-secondary-600 dark:text-secondary-400 font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
                MINDFUL FOR NOW
              </div>
              <span className="font-mono text-gray-400 dark:text-violet-400/50">{liveTime}</span>
            </div>
          </div>
          
          {/* Background aurora glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
        </motion.div>

        {/* Vital Mood & Streak Accent Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* MAGENTA AURORA POP CARD */}
          <div className="bg-gradient-to-br from-[#ec4899] to-[#a855f7] text-white p-5 rounded-2xl border-2 border-[#1a1030] shadow-[3px_3px_0_0_#1a1030] dark:shadow-[3px_3px_0_0_rgba(236,72,153,0.4)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[11px]">
                <Flame size={16} /> Daily Vitals
              </div>
              <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border border-white/40 bg-white/20 shadow-[1px_1px_0_0_rgba(0,0,0,0.2)]">Active</span>
            </div>

            <div className="flex items-center justify-around py-1">
              <div className="flex flex-col items-center">
                <div className="bg-white/20 border border-white/40 px-3 py-1.5 rounded-lg font-mono font-black text-lg shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
                  {milestones.filter(m => m.completed).length + 3}d
                </div>
                <span className="text-[10px] font-bold uppercase mt-1 opacity-80">Streak</span>
              </div>
              <div className="w-px h-10 bg-white/30" />
              <div className="flex flex-col items-center">
                <div className="bg-white/20 border border-white/40 px-3 py-1.5 rounded-lg font-mono font-black text-lg shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
                  45m
                </div>
                <span className="text-[10px] font-bold uppercase mt-1 opacity-80">Zen Time</span>
              </div>
            </div>

            <div className="border-t border-white/20 mt-3 pt-2 text-[10px] font-medium flex justify-between items-center">
              <span className="font-bold uppercase tracking-wider opacity-80">Last Check-in</span>
              <button onClick={() => navigate('/notes')} className="font-bold underline hover:opacity-80 transition-opacity cursor-pointer">
                View in Notes →
              </button>
            </div>
          </div>

          {/* Quick Rituals Fast-Bar */}
          <div className="md:col-span-2 bg-white dark:bg-[#0d0a1a] p-5 rounded-2xl border border-violet-100 dark:border-[#1e1535] shadow-[3px_3px_0_0_#1a1030] dark:shadow-[3px_3px_0_0_rgba(124,58,237,0.15)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-violet-400/60">
                Quick Wellbeing Shortcuts
              </p>
              <span className="text-[10px] font-mono text-secondary-500 dark:text-secondary-400 font-bold">● System Ready</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { title: 'Zen Play', icon: <Gamepad2 size={16} />, path: '/relax' },
                { title: 'Psychometric', icon: <FileQuestion size={16} />, path: '/assessments' },
                { title: 'Community', icon: <HeartHandshake size={16} />, path: '/community' },
                { title: 'Calendar', icon: <Clock size={16} />, path: '/calendar' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="btn-tactile p-3 rounded-xl flex items-center gap-2 text-left group cursor-pointer"
                >
                  <div className="text-primary-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-800 dark:text-violet-200 truncate">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-[10px] text-gray-500 dark:text-violet-400/50 mt-3 pt-2 border-t border-violet-100 dark:border-[#1e1535] flex items-center justify-between">
              <span>Looking for professional support?</span>
              <button onClick={() => navigate('/community')} className="text-primary-600 dark:text-violet-400 font-bold hover:underline">
                Find Vetted Mentors →
              </button>
            </p>
          </div>
        </div>

        {/* Milestone & Resilience Chart Grid */}
        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <MilestoneTracker 
              milestones={milestones} 
              onSelect={(id) => navigate(`/milestone/${id}`)} 
            />
          </div>
          <div className="lg:col-span-3">
             <div className="bg-white dark:bg-[#0d0a1a] border border-violet-100 dark:border-[#1e1535] rounded-2xl p-6 sm:p-8 shadow-[3px_3px_0_0_#1a1030] dark:shadow-[3px_3px_0_0_rgba(124,58,237,0.15)] h-full flex flex-col justify-between">
               <div className="flex items-center justify-between mb-6">
                 <div>
                   <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-violet-400/60 mb-1">Resilience Index</h3>
                   <h4 className="text-xl font-bold text-gray-900 dark:text-white">Wellbeing Trajectory</h4>
                 </div>
                 <button 
                   onClick={() => navigate('/assessments')}
                   className="btn-tactile px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider text-primary-700 dark:text-violet-400 cursor-pointer"
                 >
                    New Assessment +
                 </button>
               </div>
               
               <div className="h-[280px] w-full">
                 <WellbeingChart assessments={assessments} />
               </div>

               {/* Assessment History Timeline */}
               {assessments.length > 0 && (
                 <div className="mt-6 pt-6 border-t border-violet-100 dark:border-[#1e1535]">
                   <div className="flex items-center justify-between mb-3">
                     <p className="text-[10px] font-mono font-bold text-gray-500 dark:text-violet-400/60 uppercase tracking-[0.2em]">Recent Assessments</p>
                     <button onClick={() => navigate('/assessments')} className="text-[10px] font-mono font-bold text-primary-500 dark:text-violet-400 uppercase tracking-widest hover:underline cursor-pointer">View All →</button>
                   </div>
                   <AssessmentHistory assessments={assessments} />
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* AI Analysis Overlay */}
        {analysis && (
           <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}}>
              <AnalysisResult analysis={analysis} />
           </motion.div>
        )}

        {/* Soundboard-Styled Wellbeing Toolkit */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-1">
             <div>
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Wellbeing Toolkit</h2>
               <p className="text-[10px] font-mono font-bold text-gray-500 dark:text-violet-400/60 uppercase tracking-[0.2em] mt-0.5">Interactive Rituals & Clinically Vetted Modules</p>
             </div>
             <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 shadow-[1px_1px_0_0_#1a1030]">
               v2.1 Stable
             </span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <DashboardCard 
                title="Zen Play" 
                description="Interactive visual mindfulness & breathing rituals." 
                icon={<Gamepad2 size={22} />} 
                variant="primary"
                onClick={() => navigate('/relax')}
                trend="up"
                trendValue="3 Sessions"
                delay={0.05}
              />
              <DashboardCard 
                title="Svasthya AI" 
                description="Empathetic 1-on-1 therapeutic companion." 
                icon={<BrainCircuit size={22} />} 
                onClick={() => window.dispatchEvent(new CustomEvent('svasthya-open-chat'))}
                delay={0.1}
              />
              <DashboardCard 
                title="Support Directory" 
                description="Find vetted youth mentors & therapists." 
                icon={<HeartHandshake size={22} />} 
                variant="secondary"
                onClick={() => navigate('/community')}
                delay={0.15}
              />
              <DashboardCard 
                title="Daily Journal" 
                description="Private AI-analyzed emotional reflection." 
                icon={<BookOpen size={22} />} 
                onClick={() => navigate('/notes')}
                delay={0.2}
              />
              <DashboardCard 
                title="Psychometric Lab" 
                description="Clinical GAD-7, PHQ-9 & SCS-8 tests." 
                icon={<FileQuestion size={22} />} 
                onClick={() => navigate('/assessments')}
                delay={0.25}
              />
              <DashboardCard 
                title="Wellness Space" 
                description="Peer support circles & shared resilience." 
                icon={<Sparkles size={22} />} 
                variant="accent"
                onClick={() => navigate('/community')}
                delay={0.3}
              />
           </div>
        </div>

        <InfoModal 
          {...modalData} 
          onClose={() => setModalData({ ...modalData, isOpen: false })} 
        />

      </div>
    </div>
  );
}
