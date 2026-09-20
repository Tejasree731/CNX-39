import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function RatingModal({ isOpen, onClose, toUserId, role, sessionId = null, name }) {
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
  const displayed = hovered || stars;

  const handleSubmit = async () => {
    if (stars === 0) { toast.error('Please select a star rating.'); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ toUserId, role, stars, comment, sessionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        toast.success(`Thank you! New avg: ${data.newAvg}★`);
        setTimeout(() => { setDone(false); setStars(0); setComment(''); onClose(); }, 2000);
      } else if (res.status === 409) {
        toast.info('You have already rated this session.');
        onClose();
      } else {
        toast.error(data.message || 'Could not submit rating.');
      }
    } catch {
      toast.error('Connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07050f]/80 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-[#0d0a1a] rounded-[3rem] p-10 w-full max-w-md shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(124,58,237,0.25)] border border-[#261a45] relative"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 text-violet-400 hover:text-white rounded-xl hover:bg-[#16102e] transition-all">
              <X size={18} />
            </button>

            {done ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-8">
                <div className="text-6xl mb-4 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]">⭐</div>
                <h3 className="text-2xl font-black text-white italic">Thank You!</h3>
                <p className="text-sm text-violet-300/70 mt-2">Your feedback helps the community grow.</p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <Sparkles size={24} className="text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white italic mb-1">Rate Your Session</h3>
                  <p className="text-xs text-violet-300/70 font-medium">
                    How was your experience with <strong className="text-violet-200">{name || 'your mentor'}</strong>?
                  </p>
                </div>

                {/* Star Picker */}
                <div className="flex justify-center gap-3 mb-3">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setStars(s)}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        size={34}
                        className={`transition-all ${s <= displayed ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'text-[#2a1d4a]'}`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-center text-[10px] font-black text-amber-400 uppercase tracking-widest mb-6 h-4">
                  {displayed ? LABELS[displayed] : ''}
                </p>

                {/* Comment */}
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Share what made this session valuable (optional)..."
                  className="w-full p-4 rounded-2xl border border-[#2a1d4a] bg-[#130d28] text-sm text-violet-100 placeholder-violet-400/40 resize-none outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium mb-6"
                />

                <button
                  onClick={handleSubmit}
                  disabled={submitting || stars === 0}
                  className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-gray-950 font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={14} />
                  {submitting ? 'Submitting...' : 'Submit Rating'}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
