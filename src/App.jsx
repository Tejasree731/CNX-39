import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, Link } from 'react-router-dom';
import { Moon, Sun, HeartPulse, User, LogOut, ChevronDown, ShieldCheck, BrainCircuit, Activity, Calendar as CalendarIcon, Menu, X } from 'lucide-react';
import { Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MentorDashboard from './pages/MentorDashboard';
import TherapistDashboard from './pages/TherapistDashboard';
import MilestoneActivity from './pages/MilestoneActivity';
import Onboarding from './pages/Onboarding';
import Notes from './pages/Notes';
import Community from './pages/Community';
import TherapistProfile from './pages/TherapistProfile';
import Donate from './pages/Donate';
import AdminDashboard from './pages/AdminDashboard';
import MindGames from './pages/MindGames';
import Profile from './pages/Profile';
import CalendarModule from './pages/CalendarModule';
import AssessmentPage from './pages/AssessmentPage';
import MenteeProgress from './pages/MenteeProgress';
import Logo from './components/Logo';
import Chatbot from './components/Chatbot';
import LanguageSelector from './components/LanguageSelector';

const UniversalDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.role === 'mentor') return <MentorDashboard />;
  if (user.role === 'therapist') return <TherapistDashboard />;
  if (user.role === 'admin') return <AdminDashboard />;
  return <Dashboard />;
};

export default function App() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; // Default to aurora dark theme
  });
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [wellbeingMenuOpen, setWellbeingMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Check auth
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user session");
      }
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden transition-colors duration-300">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center relative">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo />
          </Link>
          
          <nav className="hidden md:flex gap-6 lg:gap-8 text-sm font-medium text-gray-500 dark:text-violet-300/70">
            <Link to="/#why-it-matters" className="hover:text-primary-500 dark:hover:text-violet-300 transition-colors">About</Link>
            <Link to="/#solutions" className="hover:text-primary-500 dark:hover:text-violet-300 transition-colors">Solutions</Link>
            <Link to="/#impact" className="hover:text-primary-500 dark:hover:text-violet-300 transition-colors">Impact</Link>
            
            {user && (
              <div className="relative" onMouseEnter={() => setWellbeingMenuOpen(true)} onMouseLeave={() => setWellbeingMenuOpen(false)}>
                <button className="flex items-center gap-1.5 text-primary-600 dark:text-violet-400 font-semibold hover:opacity-80 transition-opacity">
                  My Journey <ChevronDown size={14} className={`transition-transform ${wellbeingMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {wellbeingMenuOpen && (
                    <motion.div 
                        initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:8}}
                        className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-[#0d0a1a] border border-slate-200 dark:border-[#1e1535] rounded-xl shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-1.5 z-[100]"
                     >
                        <Link to="/dashboard" className="flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-violet-200 hover:bg-slate-50 dark:hover:bg-[#13102a] transition-colors rounded-lg font-semibold">
                          <span>Dashboard</span>
                          <span className="text-[10px] font-mono text-primary-600 dark:text-violet-400">Overview</span>
                        </Link>
                        <Link to="/calendar" className="flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-violet-200 hover:bg-slate-50 dark:hover:bg-[#13102a] transition-colors rounded-lg font-medium">
                          <span>Planning & Agenda</span>
                        </Link>
                        <Link to="/relax" className="flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-violet-200 hover:bg-slate-50 dark:hover:bg-[#13102a] transition-colors rounded-lg font-medium">
                          <span>Zen Hub</span>
                        </Link>
                        <Link to="/assessments" className="flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-violet-200 hover:bg-slate-50 dark:hover:bg-[#13102a] transition-colors rounded-lg font-medium">
                          <span>Psychometric Lab</span>
                          <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded">GAD/PHQ</span>
                        </Link>
                        <Link to="/profile" className="flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-violet-200 hover:bg-slate-50 dark:hover:bg-[#13102a] transition-colors rounded-lg font-medium">
                          <span>Profile & Settings</span>
                        </Link>
                        {user.role === 'admin' && (
                          <>
                            <hr className="my-1 border-slate-100 dark:border-[#1e1535]" />
                            <Link to="/admin" className="flex items-center justify-between px-3 py-2 text-xs text-primary-600 dark:text-violet-400 hover:bg-primary-50 dark:hover:bg-violet-900/20 transition-colors font-bold rounded-lg">
                              <span>Mission Control</span>
                              <ShieldCheck size={14} />
                            </Link>
                          </>
                        )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <Link to="/donate" className="btn-tactile px-3.5 py-1.5 rounded-xl text-xs font-semibold text-primary-600 dark:text-violet-400 flex items-center">
               Support Us
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            
            <button onClick={toggleTheme} className="p-2 rounded-xl border border-slate-200 dark:border-[#1e1535] bg-white dark:bg-[#13102a] shadow-sm hover:border-slate-300 dark:hover:border-violet-500/50 hover:bg-slate-50 dark:hover:bg-[#1a1438] transition-all text-slate-700 dark:text-violet-300 cursor-pointer" aria-label="Toggle Dark Mode">
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-white dark:bg-[#13102a] hover:bg-slate-50 dark:hover:bg-[#1e1535] border border-slate-200 dark:border-[#1e1535] px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <div className="bg-primary-50 dark:bg-violet-900/40 text-primary-600 dark:text-violet-400 p-1 rounded-lg">
                    <User size={14} />
                  </div>
                  <span className="text-xs font-semibold hidden sm:block text-slate-800 dark:text-violet-200">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className="text-slate-400 dark:text-violet-400/60" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-52 bg-white dark:bg-[#0d0a1a] border border-slate-200 dark:border-[#1e1535] rounded-xl shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1e1535] bg-slate-50/80 dark:bg-[#13102a]">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[10px] font-mono font-medium text-slate-500 dark:text-violet-400/70 capitalize mt-0.5">
                          {user.role}
                        </p>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="w-full text-left flex items-center justify-between px-3 py-2 text-xs font-semibold text-primary-600 dark:text-violet-400 hover:bg-primary-50 dark:hover:bg-violet-900/10 rounded-lg transition-colors"
                          >
                            <span>Admin Panel</span>
                            <ShieldCheck size={14} />
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center justify-between px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <span>{t('navbar.logout')}</span>
                          <LogOut size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-tactile hidden sm:block px-3.5 py-1.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-violet-200">
                  {t('navbar.login')}
                </Link>
                <Link to="/signup" className="btn-tactile-accent hidden sm:block px-4 py-1.5 rounded-xl text-xs font-semibold">
                  {t('hero.get_support')}
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-slate-600 dark:text-violet-300 hover:bg-slate-100 dark:hover:bg-[#1e1535] rounded-lg transition-colors ml-1" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-violet-100 dark:border-[#1e1535] bg-white dark:bg-[#0d0a1a] overflow-hidden"
            >
              <div className="px-4 py-4 space-y-5 flex flex-col">
                <Link to="/#why-it-matters" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-violet-200 font-bold hover:text-primary-500 dark:hover:text-violet-400">About Svasthya</Link>
                <Link to="/#solutions" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-violet-200 font-bold hover:text-primary-500 dark:hover:text-violet-400">Solutions</Link>
                
                {user && (
                  <>
                    <hr className="border-violet-100 dark:border-[#1e1535]" />
                    <span className="text-xs font-black text-violet-400/60 tracking-wider uppercase">Your Journey</span>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-violet-200 font-bold hover:text-primary-500 dark:hover:text-violet-400">Dashboard</Link>
                    <Link to="/calendar" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-violet-200 font-bold hover:text-primary-500 dark:hover:text-violet-400">Calendar & Events</Link>
                    <Link to="/relax" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-violet-200 font-bold hover:text-primary-500 dark:hover:text-violet-400">Zen Hub</Link>
                    <Link to="/assessments" onClick={() => setMobileMenuOpen(false)} className="text-gray-600 dark:text-violet-200 font-bold hover:text-primary-500 dark:hover:text-violet-400">Assessments</Link>
                  </>
                )}
                
                <hr className="border-violet-100 dark:border-[#1e1535]" />
                <Link to="/donate" onClick={() => setMobileMenuOpen(false)} className="text-primary-600 dark:text-violet-400 font-bold">Support Our NGOs</Link>
                
                {!user && (
                  <div className="pt-2 flex flex-col gap-3">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center font-bold text-gray-700 dark:text-violet-200 bg-violet-50 dark:bg-[#13102a] py-3 rounded-xl border border-violet-200 dark:border-[#1e1535]">Login</Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-center font-bold text-white bg-primary-600 hover:bg-primary-500 dark:bg-violet-700 dark:hover:bg-violet-600 py-3 rounded-xl shadow-lg shadow-primary-500/20 dark:shadow-violet-700/30">Get Support / Sign up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/assessments" element={<AssessmentPage />} />
          <Route path="/mentor/mentees" element={<MenteeProgress />} />
          <Route path="/dashboard" element={<UniversalDashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/community" element={<Community />} />
          <Route path="/therapists/:id" element={<TherapistProfile />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/relax" element={<MindGames />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendar" element={<CalendarModule />} />
          <Route path="/milestone/:type" element={<MilestoneActivity />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-[#07050f] border-t border-slate-200/80 dark:border-[#1e1535] pt-14 pb-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <Logo className="text-lg" />
              </div>
              <p className="text-slate-500 dark:text-violet-300/50 text-xs leading-relaxed">
                {t('footer.tagline', 'A digitally safe sanctuary for adolescent mental wellbeing, connecting youth to the resilience they need.')}
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-emerald-500/30 text-emerald-700 dark:text-secondary-400 bg-emerald-50 dark:bg-secondary-950/30 text-[10px] font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> SYSTEM ACTIVE
              </div>
            </div>
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-violet-200 mb-3">{t('footer.platform', 'Platform')}</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-violet-300/50">
                <li><Link to="/#why-it-matters" className="hover:text-primary-600 dark:hover:text-violet-400 transition-colors">{t('footer.about', 'About Us')}</Link></li>
                <li><Link to="/#solutions" className="hover:text-primary-600 dark:hover:text-violet-400 transition-colors">{t('footer.resources', 'Resources')}</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary-600 dark:hover:text-violet-400 transition-colors">{t('footer.features', 'Youth Hub')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-violet-200 mb-3">{t('footer.community', 'Community')}</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-violet-300/50">
                <li><Link to="/community" className="hover:text-primary-600 dark:hover:text-violet-400 transition-colors">{t('footer.ngos', 'Peer Circles')}</Link></li>
                <li><Link to="/community" className="hover:text-primary-600 dark:hover:text-violet-400 transition-colors">{t('footer.mentor', 'Find a Mentor')}</Link></li>
                <li><Link to="/relax" className="hover:text-primary-600 dark:hover:text-violet-400 transition-colors">Zen Hub Rituals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-violet-200 mb-3">{t('footer.legal', 'Clinical Safety')}</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-violet-300/50">
                <li><Link to="/#" className="hover:text-primary-600 dark:hover:text-violet-400 transition-colors">Zero-Identity Privacy</Link></li>
                <li><Link to="/#" className="hover:text-primary-600 dark:hover:text-violet-400 transition-colors">Crisis Protocol</Link></li>
                <li><Link to="/donate" className="hover:text-primary-600 dark:hover:text-violet-400 transition-colors">Donate to NGOs</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-200/80 dark:border-[#1e1535] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-400 dark:text-violet-400/40">
            <span>© {new Date().getFullYear()} Svasthya Digital Wellbeing Platform</span>
            <span>ENCRYPTED ● CONFIDENTIAL ● OPEN ACCESS</span>
          </div>
        </div>
      </footer>

      <Chatbot />
      <Toaster position="top-center" richColors />
    </div>
  );
}
