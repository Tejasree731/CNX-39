import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Video, Sparkles 
} from 'lucide-react';

export default function CalendarHub({ events = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    
    const prevMonthDays = daysInMonth(year, month - 1);
    const fillers = Array.from({ length: firstDay }, (_, i) => ({
      day: prevMonthDays - firstDay + i + 1,
      isCurrentMonth: false
    }));

    const days = Array.from({ length: totalDays }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: true,
      fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
    }));

    return [...fillers, ...days];
  }, [currentDate]);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const handlePrevMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, currentDate.getMonth() + 1));

  const getEventsForDate = (dateStr) => {
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div className="bg-[#0d0a1a] rounded-[3rem] border border-[#1e1535] shadow-[0_12px_40px_rgba(0,0,0,0.6)] p-8 h-full flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-gradient-to-tr from-violet-600 to-magenta-500 text-white rounded-2xl shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <CalendarIcon size={20} />
           </div>
           <div>
              <h2 className="text-xl font-black text-white italic capitalize">{monthName}</h2>
              <p className="text-[10px] text-violet-400/60 font-bold uppercase tracking-widest">{year} Planning Hub</p>
           </div>
        </div>
        <div className="flex gap-2">
           <button onClick={handlePrevMonth} className="p-2.5 hover:bg-[#16102e] rounded-xl text-violet-400 hover:text-white transition-all border border-[#2a1d4a]">
              <ChevronLeft size={18} />
           </button>
           <button onClick={handleNextMonth} className="p-2.5 hover:bg-[#16102e] rounded-xl text-violet-400 hover:text-white transition-all border border-[#2a1d4a]">
              <ChevronRight size={18} />
           </button>
        </div>
      </div>

      {/* Weekdays Label */}
      <div className="grid grid-cols-7 mb-4 relative z-10">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[10px] font-black text-violet-400/40 uppercase tracking-tighter">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 flex-grow gap-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${monthName}-${year}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="col-span-7 grid grid-cols-7 gap-1"
          >
            {monthData.map((d, index) => {
              const dayEvents = d.fullDate ? getEventsForDate(d.fullDate) : [];
              const isToday = d.isCurrentMonth && d.day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
              const hasEvents = dayEvents.length > 0;

              return (
                <button 
                  key={index} 
                  onClick={() => d.fullDate && setSelectedDay(d.fullDate === selectedDay ? null : d.fullDate)}
                  disabled={!d.isCurrentMonth}
                  className={`
                    relative aspect-square flex flex-col items-center justify-center rounded-2xl transition-all group
                    ${!d.isCurrentMonth ? 'opacity-20 cursor-default' : 'hover:bg-[#16102e] cursor-pointer'}
                    ${isToday ? 'bg-gradient-to-tr from-violet-600 to-magenta-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] font-black' : ''}
                    ${selectedDay === d.fullDate && !isToday ? 'ring-2 ring-violet-500 bg-violet-500/20' : ''}
                  `}
                >
                  <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-violet-100'} ${!d.isCurrentMonth ? 'text-violet-400/30' : ''}`}>
                    {d.day}
                  </span>
                  
                  {/* Event Indicators */}
                  {hasEvents && (
                    <div className="mt-1 flex gap-0.5">
                        {dayEvents.map((e, i) => (
                          <div 
                            key={i} 
                            className={`w-1 h-1 rounded-full ${e.source === 'booking' ? 'bg-magenta-400 shadow-[0_0_5px_#ec4899]' : 'bg-secondary-400 shadow-[0_0_5px_#10c07a]'} ${isToday ? 'bg-white' : ''}`}
                          />
                        ))}
                     </div>
                  )}

                  {/* Day Detail Popover */}
                  <AnimatePresence>
                    {selectedDay === d.fullDate && hasEvents && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 z-[100] p-4 bg-[#130d28] rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(124,58,237,0.3)] border border-[#2a1d4a] pointer-events-auto"
                      >
                         <h4 className="text-[10px] font-black text-violet-300 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                           <Sparkles size={12} className="text-amber-400" /> Planned Activities
                         </h4>
                         <div className="space-y-2.5">
                            {dayEvents.map((e, i) => (
                              <div key={i} className={`p-3 rounded-xl border text-left ${e.source === 'booking' ? 'bg-magenta-500/10 border-magenta-500/30' : 'bg-secondary-500/10 border-secondary-500/30'}`}>
                                 <div className="flex justify-between items-start mb-1">
                                    <p className="text-[10px] font-black text-white uppercase truncate">
                                       {e.source === 'booking' ? (e.therapistId?.name || "Therapy Session") : e.title}
                                    </p>
                                    <span className={`text-[8px] font-black uppercase ${e.source === 'booking' ? 'text-magenta-400' : 'text-secondary-400'}`}>{e.timeSlot}</span>
                                 </div>
                                 <div className="flex items-center gap-1.5 text-[9px] text-violet-300/70 font-medium">
                                    {e.source === 'booking' ? <Video size={10} className="text-magenta-400" /> : <Sparkles size={10} className="text-secondary-400" />}
                                    <span className="truncate">{e.source === 'booking' ? 'Secure Video Portal' : (e.type || 'Personal Growth')}</span>
                                 </div>
                              </div>
                            ))}
                         </div>
                         <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#130d28] border-b border-r border-[#2a1d4a] rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Legend Footer */}
      <div className="mt-8 pt-6 border-t border-[#1e1535] flex justify-center gap-6 relative z-10">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-magenta-400 shadow-[0_0_8px_#ec4899]"></div>
            <span className="text-[9px] font-black text-violet-400/70 uppercase tracking-widest italic">Clinical Sessions</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary-400 shadow-[0_0_8px_#10c07a]"></div>
            <span className="text-[9px] font-black text-violet-400/70 uppercase tracking-widest italic">Growth Rituals</span>
         </div>
      </div>

      {/* Decorative Ambient Background */}
      <div className="absolute -top-10 -left-10 opacity-5 pointer-events-none text-violet-500">
         <CalendarIcon size={300} />
      </div>
    </div>
  );
}
