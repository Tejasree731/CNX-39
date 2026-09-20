import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ShieldCheck, Clock, Users, ArrowRight, Video, FileText, CheckCircle2 } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import { toast } from 'sonner';

export default function TherapistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservedSlots, setReservedSlots] = useState([]);
  
  // Booking state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [isFree, setIsFree] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ avg: 0, count: 0, distribution: [] });

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const generateSlots = () => {
    return ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    const today = new Date(new Date().setHours(0,0,0,0));
    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(Date.UTC(year, month, d));
        const dateStr = dateObj.toISOString().split('T')[0];
        const isPast = dateObj < today;
        const isSelected = selectedDate === dateStr;
        
        days.push(
            <button
                key={d}
                disabled={isPast}
                onClick={() => { setSelectedDate(dateStr); setSelectedSlot(''); }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                     isSelected ? 'bg-gradient-to-tr from-violet-600 to-magenta-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]' :
                     isPast ? 'text-violet-500/20 cursor-not-allowed' :
                     'text-violet-200 hover:bg-violet-600/20 hover:text-white'
                }`}
            >
                {d}
            </button>
        );
    }
    return days;
  };

  const fetchReserved = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/bookings/availability?therapistId=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setReservedSlots(await res.json());
    } catch (err) {
      console.error("Failed to fetch availability:", err);
    }
  };

  useEffect(() => {
    const fetchTherapistData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [tRes, bRes] = await Promise.all([
          fetch(`/api/community/therapists/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`/api/bookings`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (tRes.ok) {
          setTherapist(await tRes.json());
          fetchReserved();
          
          try {
            const revRes = await fetch(`/api/ratings/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            if (revRes.ok) {
              const revData = await revRes.json();
              setReviews(revData.ratings || []);
              setReviewStats({ avg: revData.avg, count: revData.count, distribution: revData.distribution || [] });
            }
          } catch(e) { console.error('Failed to load reviews', e); }

        } else {
          toast.error("Therapist not found.");
          navigate('/community');
        }

        if (bRes.ok) {
          const bookings = await bRes.json();
          setIsFree(bookings.length === 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapistData();

    const interval = setInterval(fetchReserved, 15000);
    return () => clearInterval(interval);
  }, [id, navigate]);

  const handleBookingConfirm = async (orderId, paymentId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          therapistId: therapist._id,
          date: selectedDate,
          timeSlot: selectedSlot,
          amount: isFree ? 0 : (therapist.hourlyRate || 1000),
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          isFree: isFree
        })
      });
      if (res.ok) {
        toast.success(isFree ? "Free session booked successfully!" : "Session recorded successfully!");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to record booking.");
      }
    } catch (err) {
      toast.error("Network error while recording booking.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07050f] text-violet-400 font-medium">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mr-3" />
        Loading clinical profile...
      </div>
    );
  }

  if (!therapist) return null;

  return (
    <div className="min-h-screen bg-[#07050f] py-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-violet-400 hover:text-white transition-colors mb-6 font-bold text-sm cursor-pointer">
          <ChevronLeft size={16} /> Back to Directory
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-[#0d0a1a] rounded-[3rem] p-8 border border-[#1e1535] shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-24 h-24 shrink-0 bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 text-violet-300 rounded-3xl flex items-center justify-center text-4xl font-black border border-violet-500/30 shadow-[0_0_20px_rgba(124,58,237,0.25)]">
                  {therapist.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-black text-white italic">{therapist.name}</h1>
                    <ShieldCheck className="text-secondary-400" size={20} />
                  </div>
                  <p className="text-violet-400 font-bold mb-3">{therapist.clinicalSpecialization || therapist.specialization || 'Clinical Psychologist'}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-violet-200">
                    <span className="flex items-center gap-1.5 font-bold"><Star size={16} className="text-amber-400" fill="currentColor"/> {therapist.rating || 4.8} / 5.0</span>
                    <span className="flex items-center gap-1.5 font-medium text-violet-300/80"><Clock size={16} className="text-violet-400" /> {therapist.yearsExperience || '5+ years'} exp</span>
                    {therapist.sessionLanguages?.length > 0 && <span className="flex items-center gap-1.5 font-medium text-violet-300/80"><Users size={16} className="text-violet-400" /> {therapist.sessionLanguages.join(', ')}</span>}
                  </div>
                </div>
              </div>

              <hr className="my-6 border-[#1e1535]" />
              
              <h3 className="text-lg font-black text-white italic mb-3 flex items-center gap-2"><FileText size={18} className="text-violet-400"/> Professional Bio</h3>
              <p className="text-sm text-violet-200/80 leading-relaxed font-normal">
                As a highly trained specialist in adolescent psychology, I focus on creating a secure, judgment-free space where young adults feel truly heard. My approach integrates cognitive behavioral strategies with an empathetic understanding of modern pressures—ensuring we don't just talk, but build actionable frameworks for long-term emotional resilience.
              </p>

              <h3 className="text-lg font-black text-white italic mt-8 mb-4">Verified Badges & Certifications</h3>
              <div className="flex flex-wrap gap-3">
                {therapist.badges?.map((b, i) => (
                  <span key={i} className="bg-secondary-500/15 text-secondary-300 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-secondary-500/30 flex items-center gap-2 shadow-sm">
                    <CheckCircle2 size={12} /> {b}
                  </span>
                ))}
              </div>
            </motion.div>
            
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-[#0d0a1a] rounded-[3rem] p-8 border border-[#1e1535] shadow-sm">
                <h3 className="text-lg font-black text-white italic mb-3 flex items-center gap-2"><Video size={18} className="text-violet-400"/> Svasthya Digital Care Guarantee</h3>
                <p className="text-sm text-violet-300/70 mb-5 leading-relaxed">All sessions booked through this platform are fully encrypted, strictly confidential, and conducted via secure 1-on-1 virtual meeting rooms.</p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-[#130d28] border border-[#261a45] p-5 rounded-2xl">
                     <p className="text-xs text-violet-400/60 font-bold uppercase mb-1">Duration</p>
                     <p className="font-black text-white text-lg italic">45 Minutes</p>
                   </div>
                   <div className="bg-[#130d28] border border-[#261a45] p-5 rounded-2xl">
                     <p className="text-xs text-violet-400/60 font-bold uppercase mb-1">Cancellations</p>
                     <p className="font-black text-secondary-400 text-lg italic">Free up to 24h</p>
                   </div>
                </div>
            </motion.div>
            
            {/* Reviews Section */}
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-[#0d0a1a] rounded-[3rem] p-8 border border-[#1e1535] shadow-sm mt-6">
              <h3 className="text-xl font-black text-white italic mb-6 flex items-center gap-2"><Star size={20} className="text-amber-400" fill="currentColor" /> Patient Reviews & Feedback</h3>
              
              {reviewStats.count > 0 ? (
                  <div className="flex flex-col sm:flex-row gap-8 items-center mb-8 bg-[#130d28] p-6 rounded-3xl border border-[#261a45] transition-all">
                      <div className="text-center shrink-0">
                          <div className="text-4xl font-black text-white mb-1">{reviewStats.avg.toFixed(1)}</div>
                          <div className="flex text-amber-400 mb-1 justify-center">
                              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.floor(reviewStats.avg) ? 'currentColor' : 'none'} className={i < Math.floor(reviewStats.avg) ? '' : 'text-[#3a2761]'} />)}
                          </div>
                          <div className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">{reviewStats.count} Reviews</div>
                      </div>
                      
                      <div className="flex-1 space-y-2 w-full">
                          {reviewStats.distribution?.map(dist => (
                              <div key={dist.star} className="flex items-center gap-3 text-xs font-bold text-violet-300">
                                  <span className="w-8 flex gap-1 items-center justify-end">{dist.star} <Star size={10} fill="currentColor" className="text-amber-400"/></span>
                                  <div className="flex-1 h-2 bg-[#07050f] rounded-full overflow-hidden border border-[#261a45]">
                                      <div className="h-full bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" style={{ width: `${(dist.count / reviewStats.count) * 100}%` }} />
                                  </div>
                                  <span className="w-6 text-right text-violet-400/60">{dist.count}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              ) : (
                  <div className="text-center py-8">
                     <p className="text-sm text-violet-400/60 italic font-medium">No reviews submitted for this professional yet.</p>
                  </div>
              )}

              <div className="space-y-3">
                  {reviews.map((r, i) => (
                      <div key={i} className="p-5 bg-[#130d28] rounded-2xl border border-[#261a45]">
                          <div className="flex justify-between items-start mb-2">
                              <div>
                                  <p className="text-sm font-bold text-white">{r.fromUserId?.name || 'Anonymous Patient'}</p>
                                  <p className="text-[10px] text-violet-400/60 font-bold uppercase tracking-wider">{new Date(r.createdAt).toLocaleDateString('en-US', {month: 'short', day:'numeric', year:'numeric'})}</p>
                              </div>
                              <div className="flex text-amber-400">
                                  {[...Array(5)].map((_, idx) => <Star key={idx} size={12} fill={idx < r.stars ? 'currentColor' : 'none'} className={idx < r.stars ? '' : 'text-[#3a2761]'} />)}
                              </div>
                          </div>
                          {r.comment && <p className="text-sm text-violet-200/80 leading-relaxed font-normal">{r.comment}</p>}
                      </div>
                  ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Widget Column */}
          <div className="lg:col-span-1">
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-[#0d0a1a] rounded-[3rem] border border-[#1e1535] shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(124,58,237,0.15)] p-6 sticky top-24">
              <h2 className="text-xl font-black text-white italic mb-6">Book a Session</h2>
              
              {/* Date Selection */}
              <div className="mb-6">
                <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">1. Select Date</p>
                <div className="bg-[#130d28] p-5 rounded-3xl border border-[#261a45] transition-all">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#261a45]">
                    <button 
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} 
                      className="p-1 text-violet-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="font-bold text-sm text-white uppercase tracking-wider">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button 
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} 
                      className="p-1 text-violet-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center mb-3">
                    {['Su','Mo','Tu','We','Th','Fr','Sa'].map(day => <div key={day} className="text-[10px] font-black text-violet-400/50 uppercase tracking-tighter">{day}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-2 place-items-center">
                    {renderCalendar()}
                  </div>
                </div>
              </div>

              {/* Time Selection */}
              <AnimatePresence>
                {selectedDate && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="mb-6">
                    <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">2. Select Time (IST)</p>
                    <div className="grid grid-cols-3 gap-2">
                      {generateSlots().map(slot => {
                        const isReserved = reservedSlots.some(r => r.date === selectedDate && r.timeSlot === slot);
                        return (
                          <button
                            key={slot}
                            onClick={() => !isReserved && setSelectedSlot(slot)}
                            disabled={isReserved}
                            className={`py-2 rounded-xl text-sm font-bold border-2 transition-all relative overflow-hidden cursor-pointer ${
                              isReserved 
                               ? 'bg-[#181028] border-[#181028] text-violet-500/30 cursor-not-allowed opacity-50'
                               : selectedSlot === slot 
                                 ? 'border-violet-400 bg-violet-600/30 text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                                 : 'border-[#261a45] bg-[#130d28] text-violet-300 hover:border-violet-500/40'
                            }`}
                          >
                            {slot}
                            {isReserved && <span className="absolute inset-0 flex items-center justify-center text-[8px] uppercase tracking-tighter mt-4 font-black text-violet-400/40">Reserved</span>}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <hr className="my-5 border-[#1e1535]" />
              
              <div className="flex items-end justify-between mb-5">
                 <div>
                   <p className="text-xs text-violet-400/60 font-bold uppercase mb-1">{isFree ? 'Promotional Offer' : 'Session Cost'}</p>
                   <div className="flex items-baseline gap-2">
                     <p className="text-2xl font-black text-white">
                       {isFree ? 'FREE' : `₹${therapist.hourlyRate || 1000}`}
                     </p>
                     {isFree && <p className="text-xs text-violet-400/40 line-through font-bold">₹{therapist.hourlyRate || 1000}</p>}
                   </div>
                   {isFree && <p className="text-[10px] text-secondary-400 font-bold mt-1 uppercase tracking-tighter">✨ Your first session is on us!</p>}
                 </div>
              </div>

              <button
                onClick={() => setShowPayment(true)}
                disabled={!selectedDate || !selectedSlot}
                className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-magenta-600 hover:from-violet-500 hover:to-magenta-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex justify-center items-center gap-2 cursor-pointer"
              >
                {isFree ? 'Claim Free Session' : 'Continue to Payment'} <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <PaymentModal 
         isOpen={showPayment} 
         onClose={() => setShowPayment(false)} 
         amount={isFree ? 0 : (therapist.hourlyRate || 1000)} 
         therapistName={therapist.name}
         date={selectedDate}
         timeSlot={selectedSlot}
         isFree={isFree}
         onConfirm={(orderId, paymentId) => handleBookingConfirm(orderId, paymentId)} 
      />
    </div>
  );
}
