import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Shield, Award, Edit3, Save, X, 
  Briefcase, Star, Clock, Calendar, CheckCircle2,
  ChevronRight, Camera, Settings, Bell, Lock
} from 'lucide-react';
import { toast } from 'sonner';
import CalendarHub from '../components/CalendarHub';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    clinicalSpecialization: '',
    bio: '',
    hourlyRate: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!storedUser.token || storedUser.token === 'undefined') {
        setLoading(false);
        setUser(null);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${storedUser.token}` }
      });
      const data = await response.json();
      
      const bookingsRes = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${storedUser.token}` }
      });
      const bookingsData = await bookingsRes.json();
      
      if (response.ok) {
        setUser(data);
        setBookings(bookingsData || []);
        setFormData({
          name: data.name || '',
          specialization: data.specialization || '',
          clinicalSpecialization: data.clinicalSpecialization || '',
          bio: data.bio || '',
          hourlyRate: data.hourlyRate || '',
        });
      } else {
        setUser(null);
        if (response.status === 401) {
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      toast.error("Failed to load profile data");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedUser.token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        fetchUserData();
        
        const newUser = { ...storedUser, name: formData.name };
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error("An error occurred during update");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#07050f]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#07050f] text-violet-300/60 font-medium">
      Account not found. Please log in again.
    </div>
  );

  return (
    <div className="min-h-screen bg-[#07050f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-magenta-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Profile Header */}
        <div className="relative mb-8">
          <div className="h-48 w-full bg-gradient-to-r from-violet-700 via-fuchsia-700 to-magenta-600 rounded-[3rem] shadow-[0_15px_40px_rgba(124,58,237,0.3)] overflow-hidden relative border border-white/10">
            <motion.div 
               animate={{ x: [0, 20, 0], y: [0, 10, 0] }} 
               transition={{ duration: 10, repeat: Infinity }}
               className="absolute -top-10 -right-10 w-64 h-64 bg-white/15 rounded-full blur-3xl pointer-events-none" 
            />
          </div>
          
          <div className="absolute -bottom-12 left-8 sm:left-10 flex items-end gap-5 sm:gap-6">
            <div className="relative group">
              <div className="w-28 sm:w-32 h-28 sm:h-32 rounded-[2.2rem] sm:rounded-[2.5rem] bg-[#0d0a1a] border-4 border-[#1e1535] shadow-2xl flex items-center justify-center text-4xl font-black bg-gradient-to-tr from-violet-400 to-magenta-400 bg-clip-text text-transparent italic overflow-hidden">
                {user.name.charAt(0)}
              </div>
              <button className="absolute bottom-1 right-1 p-2 bg-gradient-to-r from-violet-600 to-magenta-600 text-white rounded-xl shadow-lg border-2 border-[#0d0a1a] hover:scale-110 transition-transform cursor-pointer">
                <Camera size={15} />
              </button>
            </div>
            <div className="mb-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 italic">
                {user.name}
                <span className="px-3 py-0.5 bg-white/15 backdrop-blur-md rounded-full text-[10px] uppercase tracking-widest text-violet-100 border border-white/20 font-bold">
                  {user.role}
                </span>
              </h1>
              <p className="text-violet-300/70 font-semibold text-xs sm:text-sm tracking-tight flex items-center gap-2 mt-0.5">
                <Mail size={13} className="text-violet-400" /> {user.email}
              </p>
            </div>
          </div>

          <div className="absolute top-6 sm:top-8 right-6 sm:right-8 flex gap-2">
             <button 
               onClick={() => setIsEditing(!isEditing)}
               className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white rounded-2xl border border-white/20 font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-sm"
             >
               {isEditing ? <X size={14} /> : <Edit3 size={14} />}
               {isEditing ? 'Cancel' : 'Edit Profile'}
             </button>
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mt-20">
          
          {/* Left Column - Stats & Identity */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Achievement Card (Youth Only) */}
            {user.role === 'youth' && (
              <div className="bg-[#0d0a1a] rounded-[2.5rem] p-8 border border-[#1e1535] shadow-sm">
                <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Award size={14} className="text-amber-400" /> Milestones & Growth
                </h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <p className="text-4xl font-black bg-gradient-to-r from-violet-300 to-magenta-400 bg-clip-text text-transparent italic leading-none">Lv.{user.level || 1}</p>
                      <p className="text-[10px] font-black text-violet-400/60 uppercase">{user.xp || 0} XP</p>
                   </div>
                   <div className="h-2 w-full bg-[#130d28] rounded-full overflow-hidden border border-[#261a45]">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${(user.xp % 100) || 20}%` }} 
                        className="h-full bg-gradient-to-r from-violet-500 to-magenta-500 shadow-[0_0_10px_rgba(124,58,237,0.5)]" 
                      />
                   </div>
                   <p className="text-[10px] text-violet-400/60 font-bold text-center">{(100 - (user.xp % 100)) || 80} XP to next level</p>
                </div>
              </div>
            )}

            {/* Tags Card (Youth Only) */}
            {(user.role === 'youth' && user.communityTags?.length > 0) && (
              <div className="bg-[#0d0a1a] rounded-[2.5rem] p-8 border border-[#1e1535] shadow-sm">
                <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-4">Identity Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {user.communityTags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-violet-600/15 text-violet-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-violet-500/30">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Security Quick Actions */}
            <div className="bg-[#0d0a1a] rounded-[2.5rem] p-8 border border-[#1e1535] shadow-sm">
               <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-6 italic">Account Security</h3>
               <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-[#130d28] rounded-2xl border border-[#261a45] hover:border-violet-500/40 transition-all group cursor-pointer">
                     <div className="flex items-center gap-3">
                        <Lock size={16} className="text-violet-400 group-hover:text-magenta-400 transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-violet-200">Change Password</span>
                     </div>
                     <ChevronRight size={14} className="text-violet-400/40" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-[#130d28] rounded-2xl border border-[#261a45] hover:border-violet-500/40 transition-all group cursor-pointer">
                     <div className="flex items-center gap-3">
                        <Bell size={16} className="text-violet-400 group-hover:text-magenta-400 transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-violet-200">Notifications</span>
                     </div>
                     <ChevronRight size={14} className="text-violet-400/40" />
                  </button>
               </div>
            </div>
          </div>

          {/* Right Column - Forms & Bio */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Calendar Bento Card */}
            <CalendarHub events={bookings} userRole={user.role} />

            <div className="bg-[#0d0a1a] rounded-[3rem] p-8 sm:p-10 border border-[#1e1535] shadow-sm min-h-full relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.form 
                    key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onSubmit={handleUpdate} className="space-y-8 relative z-10"
                  >
                    <div className="grid sm:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-4">Full Name</label>
                          <input 
                            type="text" value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-[#130d28] border-2 border-[#261a45] focus:border-violet-500 rounded-3xl px-6 py-4 text-white font-bold outline-none transition-all"
                          />
                       </div>
                       {(user.role === 'mentor' || user.role === 'therapist') && (
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-4">Specialization</label>
                             <input 
                               type="text" value={formData.specialization} 
                               onChange={e => setFormData({...formData, specialization: e.target.value})}
                               className="w-full bg-[#130d28] border-2 border-[#261a45] focus:border-violet-500 rounded-3xl px-6 py-4 text-white font-bold outline-none transition-all"
                             />
                          </div>
                       )}
                    </div>

                    {(user.role === 'therapist') && (
                       <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-4">Clinical Specialization</label>
                             <input 
                               type="text" value={formData.clinicalSpecialization} 
                               onChange={e => setFormData({...formData, clinicalSpecialization: e.target.value})}
                               className="w-full bg-[#130d28] border-2 border-[#261a45] focus:border-violet-500 rounded-3xl px-6 py-4 text-white font-bold outline-none transition-all"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-4">Hourly Rate (₹)</label>
                             <input 
                               type="number" value={formData.hourlyRate} 
                               onChange={e => setFormData({...formData, hourlyRate: e.target.value})}
                               className="w-full bg-[#130d28] border-2 border-[#261a45] focus:border-violet-500 rounded-3xl px-6 py-4 text-white font-bold outline-none transition-all"
                             />
                          </div>
                       </div>
                    )}

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-4">Personal Bio / Statement</label>
                       <textarea 
                         rows={4} value={formData.bio} 
                         onChange={e => setFormData({...formData, bio: e.target.value})}
                         className="w-full bg-[#130d28] border-2 border-[#261a45] focus:border-violet-500 rounded-3xl px-6 py-4 text-white font-medium outline-none transition-all resize-none"
                         placeholder="Tell the community about yourself..."
                       />
                    </div>

                    <button 
                      type="submit"
                      className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-violet-600 to-magenta-600 hover:from-violet-500 hover:to-magenta-500 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all ml-auto hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Save size={14} /> Save Configuration
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-10"
                  >
                    <div>
                       <h2 className="text-2xl font-black text-white mb-4 italic flex items-center gap-2">
                          <Settings size={20} className="text-violet-400" />
                          Profile Blueprint
                       </h2>
                       <div>
                          <p className="text-violet-200/80 font-medium leading-relaxed">
                            {user.bio || "No professional biography has been established yet. Click edit to refine your profile and share your story with the Svasthya community."}
                          </p>
                       </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 border-t border-[#1e1535] pt-8">
                       <div className="space-y-3">
                          <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-2">
                             <Shield size={14} className="text-secondary-400" /> Operational Role
                          </h4>
                          <div className="p-5 bg-[#130d28] rounded-3xl border border-[#261a45]">
                             <p className="text-lg font-black text-white italic capitalize">{user.role}</p>
                             <p className="text-[10px] text-secondary-400 font-bold uppercase tracking-tighter mt-1 flex items-center gap-1">
                               <span className="w-1.5 h-1.5 rounded-full bg-secondary-400"></span> Verified Status
                             </p>
                          </div>
                       </div>

                       {(user.role === 'mentor' || user.role === 'therapist') && (
                          <div className="space-y-3">
                             <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-2">
                                <Briefcase size={14} className="text-magenta-400" /> Practice Focus
                             </h4>
                             <div className="p-5 bg-[#130d28] rounded-3xl border border-[#261a45]">
                                <p className="text-lg font-black text-white italic">{user.clinicalSpecialization || user.specialization || "General Support"}</p>
                                <p className="text-[10px] text-magenta-400 font-bold uppercase tracking-tighter mt-1">Specialized Discipline</p>
                             </div>
                          </div>
                       )}
                    </div>

                    {user.role === 'therapist' && (
                       <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-3">
                             <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-2">
                                <Clock size={14} className="text-secondary-400" /> Temporal Value
                             </h4>
                             <div className="p-5 bg-secondary-500/10 rounded-3xl border border-secondary-500/30">
                                <p className="text-lg font-black text-secondary-300 italic">₹{user.hourlyRate || 1000} / hr</p>
                                <p className="text-[10px] text-secondary-400 font-bold uppercase tracking-tighter mt-1">Standard Clinical Fee</p>
                             </div>
                          </div>
                          <div className="space-y-3">
                             <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-violet-400" /> Experience Level
                             </h4>
                             <div className="p-5 bg-violet-500/10 rounded-3xl border border-violet-500/30">
                                <p className="text-lg font-black text-violet-300 italic">Senior Associate</p>
                                <p className="text-[10px] text-violet-400 font-bold uppercase tracking-tighter mt-1">Validated Professional Tier</p>
                             </div>
                          </div>
                       </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Background Accent Decorative */}
              <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none text-violet-500">
                 <Shield size={300} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
