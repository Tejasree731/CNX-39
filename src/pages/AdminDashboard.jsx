import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, HeartPulse, CreditCard, Calendar, ArrowRight, Search, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [sRes, uRes, sesRes] = await Promise.all([
          fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/sessions', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (sRes.ok) setStats(await sRes.json());
        if (uRes.ok) setUsers(await uRes.json());
        if (sesRes.ok) setSessions(await sesRes.json());
      } catch (err) {
        toast.error("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#07050f] text-violet-400 font-black italic tracking-widest animate-pulse">
      VERIFYING MISSION CONTROL...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#07050f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Aurora mesh background */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-magenta-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-violet-200 via-fuchsia-200 to-white bg-clip-text text-transparent flex items-center gap-3 italic tracking-tight">
              <ShieldCheck className="text-secondary-400" size={36} /> Mission Control
            </h1>
            <p className="text-violet-400/60 font-bold uppercase tracking-widest text-[10px] mt-1 italic">Platform-wide systems overview</p>
          </div>
          <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400/50" size={16} />
                <input 
                  type="text" 
                  placeholder="Query system users..." 
                  className="bg-[#0d0a1a] border border-[#261a45] rounded-2xl pl-10 pr-4 py-3 text-xs font-bold text-white placeholder-violet-400/40 focus:border-violet-500 outline-none w-64 shadow-sm transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
          </div>
        </div>

        {/* Bento Grid Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard 
              title="Total Youth" 
              description={`${stats?.totalYouth || 0}`} 
              icon={<Users size={24} />} 
              trend="up"
              trendValue="12%"
              delay={0.1}
            />
            <DashboardCard 
              title="Certified Peers" 
              description={`${stats?.totalMentors || 0}`} 
              icon={<UserCheck size={24} />} 
              variant="secondary"
              delay={0.2}
            />
            <DashboardCard 
              title="Clinicians" 
              description={`${stats?.totalTherapists || 0}`} 
              icon={<HeartPulse size={24} />} 
              delay={0.3}
            />
            <DashboardCard 
              title="Impact Donations" 
              description={`₹${(stats?.donationRevenue || 0).toLocaleString()}`} 
              icon={<HeartPulse size={24} className="text-magenta-400" />} 
              variant="accent"
              trend="up"
              trendValue="₹5,200"
              delay={0.4}
            />
            <DashboardCard 
              title="Total Platform Cashflow" 
              description={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} 
              icon={<CreditCard size={24} />} 
              variant="primary"
              className="lg:col-span-2"
              delay={0.5}
            />
            <div className="lg:col-span-2 bg-[#0d0a1a] border border-secondary-500/30 rounded-[2.5rem] p-8 flex items-center justify-between overflow-hidden relative group shadow-[0_0_25px_rgba(16,192,122,0.15)]">
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-secondary-400 animate-pulse shadow-[0_0_8px_#10c07a]"></span>
                    <p className="text-xs font-black uppercase tracking-widest text-secondary-400">System Health</p>
                  </div>
                  <h3 className="text-3xl font-black text-white italic">Operational (100%)</h3>
               </div>
               <div className="flex gap-1.5 items-end h-10 relative z-10">
                  {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.6 + (i * 0.1), repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
                      className="w-2 bg-gradient-to-t from-secondary-500 to-teal-300 rounded-full shadow-[0_0_6px_rgba(16,192,122,0.5)]"
                    />
                  ))}
               </div>
               <Activity className="absolute -right-4 -bottom-4 text-secondary-500/10 group-hover:scale-110 transition-transform pointer-events-none" size={160} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="bg-[#0d0a1a] rounded-[2.5rem] border border-[#1e1535] shadow-sm overflow-hidden">
          <div className="flex border-b border-[#1e1535] bg-[#090614]">
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-10 py-5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 cursor-pointer ${activeTab === 'users' ? 'border-violet-500 text-violet-300 bg-violet-600/10' : 'border-transparent text-violet-400/50 hover:text-violet-200'}`}
            >
              User Repository
            </button>
            <button 
              onClick={() => setActiveTab('sessions')}
              className={`px-10 py-5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 cursor-pointer ${activeTab === 'sessions' ? 'border-violet-500 text-violet-300 bg-violet-600/10' : 'border-transparent text-violet-400/50 hover:text-violet-200'}`}
            >
              System Events
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'users' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* YOUTH COLUMN */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between border-b border-[#1e1535] pb-4">
                      <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_6px_#7c3aed]"></span>
                         Youth Repository ({filteredUsers.filter(u => u.role === 'youth').length})
                      </h3>
                   </div>
                   <div className="space-y-3">
                      {filteredUsers.filter(u => u.role === 'youth').map(user => (
                        <div key={user._id} className="p-4 bg-[#130d28] rounded-2xl border border-[#261a45] hover:border-violet-500/40 transition-all group">
                           <div className="flex justify-between items-start">
                              <div>
                                 <p className="text-sm font-black text-white mb-0.5">{user.name}</p>
                                 <p className="text-[10px] text-violet-400/60 font-bold tracking-tight">{user.email}</p>
                              </div>
                              <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border ${user.onboardingComplete ? 'bg-secondary-500/15 border-secondary-500/30 text-secondary-300' : 'bg-amber-500/15 border-amber-500/30 text-amber-300'}`}>
                                 {user.onboardingComplete ? 'Active' : 'Pending'}
                              </span>
                           </div>
                        </div>
                      ))}
                      {filteredUsers.filter(u => u.role === 'youth').length === 0 && <p className="text-[10px] text-violet-400/40 italic">No youth profiles found.</p>}
                   </div>
                </div>

                {/* MENTOR COLUMN */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between border-b border-[#1e1535] pb-4">
                      <h3 className="text-[10px] font-black text-magenta-400 uppercase tracking-widest flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-magenta-500 shadow-[0_0_6px_#ec4899]"></span>
                         Certified Peers ({filteredUsers.filter(u => u.role === 'mentor').length})
                      </h3>
                   </div>
                   <div className="space-y-3">
                      {filteredUsers.filter(u => u.role === 'mentor').map(user => (
                        <div key={user._id} className="p-4 bg-[#130d28] rounded-2xl border border-[#261a45] hover:border-magenta-500/40 transition-all group">
                           <div className="flex justify-between items-start mb-2">
                              <div>
                                 <p className="text-sm font-black text-white mb-0.5">{user.name}</p>
                                 <p className="text-[10px] text-violet-400/60 font-bold tracking-tight">{user.email}</p>
                              </div>
                              <UserCheck size={14} className="text-magenta-400" />
                           </div>
                           <p className="text-[10px] font-bold text-magenta-300 bg-magenta-500/15 border border-magenta-500/30 w-fit px-2 py-0.5 rounded-md">
                              {user.specialization || 'General Mentor'}
                           </p>
                        </div>
                      ))}
                      {filteredUsers.filter(u => u.role === 'mentor').length === 0 && <p className="text-[10px] text-violet-400/40 italic">No mentors found.</p>}
                   </div>
                </div>

                {/* THERAPIST COLUMN */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between border-b border-[#1e1535] pb-4">
                      <h3 className="text-[10px] font-black text-secondary-400 uppercase tracking-widest flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-secondary-500 shadow-[0_0_6px_#10c07a]"></span>
                         Clinical Partners ({filteredUsers.filter(u => u.role === 'therapist').length})
                      </h3>
                   </div>
                   <div className="space-y-3">
                      {filteredUsers.filter(u => u.role === 'therapist').map(user => (
                        <div key={user._id} className="p-4 bg-[#130d28] rounded-2xl border border-[#261a45] hover:border-secondary-500/40 transition-all group">
                           <div className="flex justify-between items-start mb-2">
                              <div>
                                 <p className="text-sm font-black text-white mb-0.5">{user.name}</p>
                                 <p className="text-[10px] text-violet-400/60 font-bold tracking-tight">{user.email}</p>
                              </div>
                              <HeartPulse size={14} className="text-secondary-400" />
                           </div>
                           <div className="flex gap-2">
                              <span className="text-[9px] font-bold text-secondary-300 bg-secondary-500/15 border border-secondary-500/30 px-2 py-0.5 rounded-md">
                                 {user.clinicalSpecialization || user.specialization || 'Clinician'}
                              </span>
                              <span className="text-[9px] font-black text-violet-300/70 border border-[#261a45] px-2 py-0.5 rounded-md">
                                 ₹{user.hourlyRate || 1000}/hr
                              </span>
                           </div>
                        </div>
                      ))}
                      {filteredUsers.filter(u => u.role === 'therapist').length === 0 && <p className="text-[10px] text-violet-400/40 italic">No therapists found.</p>}
                   </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-violet-400/60 uppercase tracking-widest border-b border-[#1e1535]">
                      <th className="pb-5 px-4 font-black">Subject</th>
                      <th className="pb-5 px-4 font-black">Practitioner</th>
                      <th className="pb-5 px-4 font-black">Temporal Signature</th>
                      <th className="pb-5 px-4 font-black">Tier</th>
                      <th className="pb-5 px-4 text-right font-black">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1535]">
                    {sessions.map(session => (
                      <tr key={session._id} className="hover:bg-[#130d28]/70 transition-colors">
                        <td className="py-5 px-4 font-black text-white italic">
                          {session.userId?.name || '---'}
                        </td>
                        <td className="py-5 px-4 font-black text-violet-300 tracking-tight">
                          {session.therapistId?.name || '---'}
                        </td>
                        <td className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-violet-400/60">
                           {session.date} • {session.timeSlot}
                        </td>
                        <td className="py-5 px-4">
                           <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${session.isFree ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'bg-secondary-500/20 text-secondary-300 border border-secondary-500/30'}`}>
                             {session.isFree ? 'PROMO' : 'STANDARD'}
                           </span>
                        </td>
                        <td className="py-5 px-4 text-right">
                           <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-secondary-400">
                             <CheckCircle2 size={12} /> {session.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
