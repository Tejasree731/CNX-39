import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, Video, User, Star,
  Plus, Search, Filter, ChevronRight, LayoutGrid, List
} from 'lucide-react';
import CalendarHub from '../components/CalendarHub';
import RatingModal from '../components/RatingModal';
import { toast } from 'sonner';

export default function CalendarModule() {
  const [view, setView] = useState('grid');
  const [bookings, setBookings] = useState([]);
  const [personalEvents, setPersonalEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [ratingTarget, setRatingTarget] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00',
    type: 'Meditation',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token) {
       toast.error("Session expired. Please login again.");
       return;
    }
    setUser(storedUser);
    fetchData(token);

    const interval = setInterval(() => fetchData(token), 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async (token) => {
    if (!token || token === 'undefined') {
      setLoading(false);
      return;
    }
    try {
      const [bRes, pRes] = await Promise.all([
        fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/personal-events', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (bRes.status === 401) {
         return;
      }

      if (bRes.ok) setBookings(await bRes.json());
      if (pRes.ok) setPersonalEvents(await pRes.json());
    } catch (err) {
      console.error("Data sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('/api/personal-events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newEvent)
      });
      
      if (res.ok) {
        toast.success("Wellbeing Event Added!");
        setShowModal(false);
        fetchData(token);
        setNewEvent({ title: '', date: new Date().toISOString().split('T')[0], timeSlot: '09:00', type: 'Meditation', notes: '' });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to save event.");
      }
    } catch (err) {
      toast.error("Connection error. Is the server running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allEvents = [
    ...bookings.map(b => ({ ...b, source: 'booking' })),
    ...personalEvents.map(p => ({ ...p, source: 'personal' }))
  ];

  const upcomingSessions = allEvents
    .filter(b => new Date(b.date) >= new Date().setHours(0,0,0,0))
    .sort((a,b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#07050f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow mesh */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-magenta-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header - Advanced Control */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0d0a1a] p-8 rounded-[3rem] shadow-sm border border-[#1e1535] relative overflow-hidden">
           <div className="relative z-10">
              <h1 className="text-3xl font-black bg-gradient-to-r from-violet-200 via-fuchsia-100 to-white bg-clip-text text-transparent italic tracking-tight flex items-center gap-3">
                 <div className="p-2.5 bg-violet-600/20 border border-violet-500/30 text-violet-400 rounded-2xl shadow-inner">
                   <CalendarIcon size={26} />
                 </div>
                 Planning Hub
              </h1>
              <p className="text-[10px] text-violet-400/60 font-black uppercase tracking-[0.2em] mt-2 ml-1">Real-time Session Management</p>
           </div>
           
           <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
              <div className="flex bg-[#130d28] p-1.5 rounded-2xl border border-[#261a45]">
                 <button 
                   onClick={() => setView('grid')}
                   className={`p-2.5 rounded-xl transition-all cursor-pointer ${view === 'grid' ? 'bg-violet-600/30 text-violet-200 shadow-sm border border-violet-500/40' : 'text-violet-400/50 hover:text-violet-200'}`}
                 >
                    <LayoutGrid size={18} />
                 </button>
                 <button 
                   onClick={() => setView('list')}
                   className={`p-2.5 rounded-xl transition-all cursor-pointer ${view === 'list' ? 'bg-violet-600/30 text-violet-200 shadow-sm border border-violet-500/40' : 'text-violet-400/50 hover:text-violet-200'}`}
                 >
                    <List size={18} />
                 </button>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-600 to-magenta-600 hover:from-violet-500 hover:to-magenta-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(124,58,237,0.35)] transition-all ml-auto md:ml-0 cursor-pointer"
              >
                 <Plus size={14} /> New Growth Event
              </button>
           </div>

           <div className="absolute -right-20 -top-20 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
           
           {/* Sidebar: Upcoming & Analytics */}
           <div className="lg:col-span-1 space-y-6">
              
              <div className="bg-[#0d0a1a] rounded-[2.5rem] p-8 border border-[#1e1535] shadow-sm">
                 <h3 className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                    Live Allotment 
                    <span className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse shadow-[0_0_8px_#10c07a]" />
                 </h3>
                 <div className="space-y-4">
                    {upcomingSessions.length > 0 ? upcomingSessions.map((session, i) => (
                      <div key={i} className="group relative flex items-start gap-4 p-4 hover:bg-[#130d28] rounded-2xl transition-all border border-transparent hover:border-[#261a45] active:scale-95 cursor-pointer">
                         <div className="p-2 bg-violet-600/20 text-violet-400 rounded-xl border border-violet-500/30">
                            <Clock size={16} />
                         </div>
                         <div>
                            <p className="text-[11px] font-black text-white uppercase tracking-tighter truncate">
                              {session.source === 'booking' ? (session.therapistId?.name || "Session") : session.title}
                            </p>
                            <p className="text-[9px] text-violet-400/60 font-bold mt-0.5">{new Date(session.date).toLocaleDateString([], {month:'short', day:'numeric'})} • {session.timeSlot}</p>
                         </div>
                         <ChevronRight size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400/40 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    )) : (
                      <p className="text-xs text-violet-400/50 italic text-center py-4">No sessions allotted yet.</p>
                    )}
                 </div>
              </div>

              {/* Status Badge */}
              <div className="bg-gradient-to-br from-violet-950/60 via-[#1a0f35] to-[#0f0a24] rounded-[2.5rem] p-8 text-white shadow-xl border border-violet-500/30 relative overflow-hidden">
                 <div className="flex items-center gap-2 mb-4 text-violet-300">
                    <Video size={16} className="text-magenta-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-violet-300">Connectivity Status</span>
                 </div>
                 <h4 className="text-xl font-black italic mb-2 text-white">Digital Portal Ready</h4>
                 <p className="text-[10px] text-violet-300/70 leading-relaxed font-bold">Your allotted slots are automatically synchronized with our encrypted video rooms.</p>
                 <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-magenta-500/10 rounded-full blur-xl pointer-events-none" />
              </div>
           </div>

           {/* Main Calendar Space */}
           <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                 {view === 'grid' ? (
                   <motion.div 
                     key="grid"
                     initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}}
                     className="h-full"
                   >
                      <CalendarHub events={allEvents} userRole={user?.role} />
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="list"
                     initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}}
                     className="bg-[#0d0a1a] rounded-[3rem] p-8 sm:p-10 border border-[#1e1535] shadow-sm"
                   >
                      <div className="space-y-6">
                         <h2 className="text-xl font-black text-white italic">Full Manifest of Bookings</h2>
                         <div className="space-y-3">
                            {allEvents.map((b, i) => (
                              <div key={i} className="flex items-center justify-between p-6 bg-[#130d28] rounded-3xl border border-[#261a45]">
                                 <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 bg-[#1a1236] rounded-2xl flex items-center justify-center border border-[#2a1d4a] shadow-sm ${b.source === 'booking' ? 'text-violet-400' : 'text-secondary-400'}`}>
                                       {b.source === 'booking' ? <CalendarIcon size={20} /> : <Plus size={20} />}
                                    </div>
                                    <div>
                                       <p className="text-xs font-black text-white uppercase">
                                         {b.source === 'booking' ? b.therapistId?.name : b.title}
                                       </p>
                                       <p className="text-[10px] text-violet-400/60 font-bold">
                                         {new Date(b.date).toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'})} • {b.timeSlot}
                                       </p>
                                    </div>
                                 </div>
                                 {b.source === 'booking' ? (
                                    <div className="flex items-center gap-2">
                                      <button className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-magenta-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:from-violet-500 hover:to-magenta-500 transition-all shadow-sm cursor-pointer">
                                         Join Room
                                      </button>
                                      {new Date(b.date) < new Date() && (
                                        <button
                                          onClick={() => setRatingTarget({ toUserId: b.therapistId?._id, role: b.therapistId?.role || 'therapist', sessionId: b._id, name: b.therapistId?.name })}
                                          className="px-4 py-2.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-300 hover:bg-amber-500 hover:text-gray-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                                        >
                                          <Star size={11} /> Rate
                                        </button>
                                      )}
                                    </div>
                                 ) : (
                                   <span className="text-[9px] font-black uppercase tracking-widest text-secondary-300 px-3 py-1 bg-secondary-500/15 border border-secondary-500/30 rounded-full">Manual Note</span>
                                 )}
                              </div>
                            ))}
                         </div>
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </div>

      {ratingTarget && (
        <RatingModal
          isOpen={!!ratingTarget}
          onClose={() => setRatingTarget(null)}
          toUserId={ratingTarget.toUserId}
          role={ratingTarget.role}
          sessionId={ratingTarget.sessionId}
          name={ratingTarget.name}
        />
      )}

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
               onClick={() => setShowModal(false)}
               className="absolute inset-0 bg-[#07050f]/80 backdrop-blur-md"
             />
             <motion.div 
               initial={{opacity:0, scale:0.95, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.95, y:20}}
               className="relative bg-[#0d0a1a] w-full max-w-md rounded-[3rem] p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(124,58,237,0.2)] border border-[#261a45] overflow-hidden"
             >
                <div className="relative z-10">
                   <h2 className="text-2xl font-black bg-gradient-to-r from-violet-200 to-white bg-clip-text text-transparent italic mb-2 tracking-tight">Manual Entry</h2>
                   <p className="text-[10px] text-violet-400 font-extrabold uppercase tracking-widest mb-8">Personal Wellbeing Milestone</p>

                   <form onSubmit={handleAddEvent} className="space-y-6">
                      <div>
                         <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-1 mb-2 block">Event Title</label>
                         <input 
                           required type="text" placeholder="e.g. Morning Meditation"
                           value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                           className="w-full bg-[#130d28] border border-[#261a45] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-violet-500 transition-all text-white placeholder-violet-400/40"
                         />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-1 mb-2 block">Date</label>
                            <input 
                              required type="date"
                              value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                              className="w-full bg-[#130d28] border border-[#261a45] rounded-2xl px-4 py-4 text-xs focus:outline-none focus:border-violet-500 transition-all text-white"
                            />
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-1 mb-2 block">Time</label>
                            <input 
                              required type="time"
                              value={newEvent.timeSlot} onChange={(e) => setNewEvent({...newEvent, timeSlot: e.target.value})}
                              className="w-full bg-[#130d28] border border-[#261a45] rounded-2xl px-4 py-4 text-xs focus:outline-none focus:border-violet-500 transition-all text-white"
                            />
                         </div>
                      </div>

                      <div>
                         <label className="text-[10px] font-black text-violet-400 uppercase tracking-widest ml-1 mb-2 block">Activity Tone</label>
                         <select 
                           value={newEvent.type} onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                           className="w-full bg-[#130d28] border border-[#261a45] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-violet-500 transition-all text-white"
                         >
                            <option value="Meditation">🧘 Meditation</option>
                            <option value="Study">📚 Deep Study</option>
                            <option value="Social">🤝 Peer Social</option>
                            <option value="Reflection">📝 Self Reflection</option>
                            <option value="Exercise">🏃 Movement</option>
                         </select>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-violet-600 to-magenta-600 hover:from-violet-500 hover:to-magenta-500 text-white font-black py-4 rounded-[2rem] shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all active:scale-[0.98] uppercase tracking-widest text-[11px] disabled:opacity-50 cursor-pointer"
                      >
                         {isSubmitting ? 'Securing Portal Entry...' : 'Secure Entry'}
                      </button>
                   </form>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
