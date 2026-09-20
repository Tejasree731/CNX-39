import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Brain, Users, ArrowLeft, CheckCircle2, ChevronRight, AlertCircle, ClipboardList, Smile, Frown, Meh, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const BreathingExercise = ({ onComplete }) => {
  const [stage, setStage] = useState('Inhale');
  const [seconds, setSeconds] = useState(4);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (cycle >= 3) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (stage === 'Inhale') { setStage('Hold'); return 7; }
          if (stage === 'Hold') { setStage('Exhale'); return 8; }
          if (stage === 'Exhale') { setStage('Inhale'); setCycle(c => c + 1); return 4; }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, seconds, cycle, onComplete]);

  const getStageColor = () => {
    if (stage === 'Inhale') return 'border-violet-500 shadow-[0_0_30px_rgba(124,58,237,0.5)] text-violet-300';
    if (stage === 'Hold') return 'border-magenta-500 shadow-[0_0_30px_rgba(236,72,153,0.5)] text-magenta-300';
    return 'border-secondary-400 shadow-[0_0_30px_rgba(16,192,122,0.5)] text-secondary-300';
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-12">
      <motion.div
        animate={{ scale: stage === 'Inhale' ? 1.4 : stage === 'Hold' ? 1.4 : 1 }}
        transition={{ duration: stage === 'Inhale' ? 4 : stage === 'Hold' ? 7 : 8, ease: "linear" }}
        className={`w-48 h-48 rounded-full bg-[#130d28] flex items-center justify-center border-4 ${getStageColor()} transition-colors duration-500`}
      >
        <span className="text-4xl font-black">{seconds}s</span>
      </motion.div>
      <div className="text-center">
        <h2 className="text-4xl font-black text-white italic mb-2 tracking-tight">{stage}...</h2>
        <p className="text-violet-400/60 font-bold uppercase tracking-widest text-xs">Cycle {cycle + 1} of 3</p>
      </div>
    </div>
  );
};

const MeditationActivity = ({ onComplete }) => {
    const [mood, setMood] = useState('');
    const moods = ['Calm', 'Neutral', 'Restless', 'Anxious'];

    return (
        <div className="flex flex-col space-y-8 py-8 items-center text-center">
            <div className="max-w-md bg-[#130d28] p-8 rounded-3xl border border-[#261a45] shadow-inner">
                <Brain className="w-12 h-12 text-violet-400 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-4 italic leading-relaxed">
                  "I am at peace with my world. Everything is unfolding as it should."
                </h3>
                <p className="text-violet-300/70 text-sm leading-relaxed">
                  Close your eyes, take a deep breath, and repeat this affirmation in your head for 60 seconds.
                </p>
            </div>
            
            <div className="w-full max-w-sm">
                <label className="block text-sm font-bold text-violet-300 mb-4">How do you feel after this session?</label>
                <div className="grid grid-cols-2 gap-3">
                    {moods.map(m => (
                        <button 
                            key={m} 
                            onClick={() => setMood(m)}
                            className={`px-4 py-3.5 rounded-2xl border font-bold text-sm transition-all cursor-pointer ${
                              mood === m 
                                ? 'bg-gradient-to-r from-violet-600 to-magenta-600 text-white border-violet-400 shadow-[0_0_15px_rgba(124,58,237,0.4)]' 
                                : 'bg-[#130d28] border-[#261a45] text-violet-300/70 hover:border-violet-500/40 hover:text-white'
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                disabled={!mood}
                onClick={() => onComplete({ mood: mood.toLowerCase() })}
                className="bg-gradient-to-r from-violet-600 to-magenta-600 hover:from-violet-500 hover:to-magenta-500 disabled:opacity-50 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center gap-2 cursor-pointer text-sm"
            >
                Complete Meditation <ChevronRight size={18} />
            </button>
        </div>
    );
};

const TalkToFriend = ({ onComplete }) => {
    const [thought, setThought] = useState('');

    return (
        <div className="flex flex-col space-y-8 py-8 items-center text-center">
            <div className="max-w-md bg-[#130d28] p-8 rounded-3xl border border-[#261a45]">
                <Users className="w-12 h-12 text-magenta-400 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white italic mb-2">Reach Out</h3>
                <p className="text-violet-300/70 text-sm leading-relaxed">
                  Connection is a powerful tool for wellbeing. Think of one friend or family member you trust. What's one thing you'd like to share with them right now?
                </p>
            </div>
            
            <textarea 
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="Write your thought here... (it stays strictly private)"
                className="w-full max-w-md bg-[#130d28] border border-[#261a45] text-violet-100 placeholder-violet-400/40 rounded-2xl p-4 min-h-[120px] focus:border-violet-500 outline-none transition-all text-sm font-medium"
            />

            <button 
                disabled={!thought.trim()}
                onClick={() => onComplete({ thought: thought })}
                className="bg-gradient-to-r from-violet-600 to-magenta-600 hover:from-violet-500 hover:to-magenta-500 disabled:opacity-50 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center gap-2 cursor-pointer text-sm"
            >
                I've reflected on this <ChevronRight size={18} />
            </button>
        </div>
    );
};

const MoodCheck = ({ onComplete }) => {
    const [sleep, setSleep] = useState('');
    const [energy, setEnergy] = useState('');

    const options = [
        { label: 'Poor', value: 'poor', icon: <Frown className="text-red-400" /> },
        { label: 'Fair', value: 'fair', icon: <Meh className="text-amber-400" /> },
        { label: 'Good', value: 'good', icon: <Smile className="text-secondary-400" /> }
    ];

    return (
        <div className="flex flex-col space-y-8 py-8 items-center">
            <div className="text-center max-w-md">
                <h3 className="text-2xl font-black text-white italic mb-2">How's your foundation?</h3>
                <p className="text-violet-300/60 text-sm">Checking in on your sleep and energy levels helps us understand your baseline.</p>
            </div>

            <div className="w-full max-w-sm space-y-6">
                <div>
                    <label className="block text-sm font-bold text-violet-300 mb-3 text-center sm:text-left">How did you sleep last night?</label>
                    <div className="grid grid-cols-3 gap-3">
                        {options.map(opt => (
                            <button 
                                key={opt.value} 
                                onClick={() => setSleep(opt.value)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all cursor-pointer ${
                                  sleep === opt.value 
                                    ? 'bg-violet-600/25 border-violet-400 text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]' 
                                    : 'bg-[#130d28] border-[#261a45] text-violet-300/70 hover:border-violet-500/40'
                                }`}
                            >
                                {opt.icon}
                                <span className="text-xs font-bold">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-violet-300 mb-3 text-center sm:text-left">What is your energy level right now?</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[{ label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'high' }].map(opt => (
                            <button 
                                key={opt.value} 
                                onClick={() => setEnergy(opt.value)}
                                className={`p-4 rounded-2xl border font-bold text-sm transition-all cursor-pointer ${
                                  energy === opt.value 
                                    ? 'bg-violet-600/25 border-violet-400 text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]' 
                                    : 'bg-[#130d28] border-[#261a45] text-violet-300/70 hover:border-violet-500/40'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button 
                disabled={!sleep || !energy}
                onClick={() => onComplete({ sleep, energy })}
                className="bg-gradient-to-r from-violet-600 to-magenta-600 hover:from-violet-500 hover:to-magenta-500 disabled:opacity-50 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center gap-2 mt-4 cursor-pointer text-sm"
            >
                Submit Check-in <ChevronRight size={18} />
            </button>
        </div>
    );
};

const AnxietyTest = ({ onComplete }) => {
    const [q1, setQ1] = useState(null);
    const [q2, setQ2] = useState(null);

    const scores = [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 }
    ];

    return (
        <div className="flex flex-col space-y-10 py-8 items-center">
            <div className="text-center max-w-md">
                <ClipboardList className="w-12 h-12 text-violet-400 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-white italic mb-2">Anxiety Assessment</h3>
                <p className="text-violet-300/70 italic text-sm">Over the last 2 weeks, how often have you been bothered by the following problems?</p>
            </div>

            <div className="w-full max-w-lg space-y-6">
                <div className="bg-[#130d28] p-6 rounded-3xl border border-[#261a45]">
                    <p className="font-bold text-violet-100 mb-4 text-sm">1. Feeling nervous, anxious, or on edge?</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {scores.map(s => (
                            <button 
                                key={s.value} 
                                onClick={() => setQ1(s.value)}
                                className={`p-3 rounded-xl border text-[10px] font-bold leading-tight transition-all cursor-pointer ${
                                  q1 === s.value 
                                    ? 'bg-gradient-to-r from-violet-600 to-magenta-600 text-white border-violet-400 shadow-sm' 
                                    : 'bg-[#0d0a1a] text-violet-300/70 border-[#261a45] hover:border-violet-500/40'
                                }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-[#130d28] p-6 rounded-3xl border border-[#261a45]">
                    <p className="font-bold text-violet-100 mb-4 text-sm">2. Not being able to stop or control worrying?</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {scores.map(s => (
                            <button 
                                key={s.value} 
                                onClick={() => setQ2(s.value)}
                                className={`p-3 rounded-xl border text-[10px] font-bold leading-tight transition-all cursor-pointer ${
                                  q2 === s.value 
                                    ? 'bg-gradient-to-r from-violet-600 to-magenta-600 text-white border-violet-400 shadow-sm' 
                                    : 'bg-[#0d0a1a] text-violet-300/70 border-[#261a45] hover:border-violet-500/40'
                                }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button 
                disabled={q1 === null || q2 === null}
                onClick={() => onComplete({ q1, q2 })}
                className="bg-gradient-to-r from-violet-600 to-magenta-600 hover:from-violet-500 hover:to-magenta-500 disabled:opacity-50 text-white px-10 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center gap-2 mt-4 cursor-pointer text-sm"
            >
                Submit Assessment <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default function MilestoneActivity() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleComplete = async (data = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/milestones/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: type, data })
      });
      
      const result = await res.json();

      if (res.ok) {
        setCompleted(true);
        toast.success(`Milestone completed! +${result.xpGained} XP`);
        
        if (result.leveledUp) {
          toast.success(`LEVEL UP! You are now Level ${result.level}`, {
            description: "Your wellbeing journey is reaching new heights!",
            duration: 5000,
          });
        }

        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          storedUser.xp = result.xp;
          storedUser.level = result.level;
          localStorage.setItem('user', JSON.stringify(storedUser));
        }
      }
    } catch (error) {
      toast.error("Failed to save progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07050f] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-magenta-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-violet-400 hover:text-white transition-colors mb-8 group font-bold text-sm cursor-pointer"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>

        <div className="bg-[#0d0a1a] rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(124,58,237,0.15)] border border-[#1e1535] p-8 sm:p-12 overflow-hidden relative">
          
          <AnimatePresence mode="wait">
            {!completed ? (
              <motion.div
                key="activity"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {type === 'breathing' && <BreathingExercise onComplete={handleComplete} />}
                {type === 'meditation' && <MeditationActivity onComplete={handleComplete} />}
                {type === 'talking_to_friend' && <TalkToFriend onComplete={handleComplete} />}
                {type === 'mood_check' && <MoodCheck onComplete={handleComplete} />}
                {type === 'anxiety_test' && <AnxietyTest onComplete={handleComplete} />}
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-secondary-500/20 text-secondary-400 border border-secondary-500/40 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,192,122,0.4)]">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-violet-200 to-white bg-clip-text text-transparent italic mb-3">Well Done!</h2>
                <p className="text-violet-300/70 mb-10 max-w-sm mx-auto text-base leading-relaxed font-medium">
                  You've successfully completed this milestone. Your progress has been securely updated.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-magenta-600 hover:from-violet-500 hover:to-magenta-500 text-white px-10 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm uppercase tracking-widest"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && (
            <div className="absolute inset-0 bg-[#07050f]/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(124,58,237,0.5)]"></div>
                <p className="font-bold text-violet-300">Saving Progress...</p>
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        {!completed && (
            <div className="mt-8 flex gap-4 bg-[#130d28] p-6 rounded-3xl border border-[#261a45]">
                <AlertCircle className="text-violet-400 shrink-0 mt-0.5" size={20} />
                <div>
                    <p className="text-sm font-black text-violet-300 mb-1">Quick Tip</p>
                    <p className="text-xs text-violet-300/70 italic leading-relaxed">
                        {type === 'breathing' ? "If you feel lightheaded, pause and breathe normally. It's okay to start slow." : 
                         type === 'meditation' ? "If your mind wanders, gently bring your focus back to the affirmation without judgment." : 
                         type === 'talking_to_friend' ? "Talking to a friend doesn't always have to be about 'serious' things. Sometimes just sharing a laugh is the best support." :
                         type === 'mood_check' ? "Be honest with yourself. Tracking physical health metrics like sleep is key to identifying emotional patterns." :
                         "These questions are part of a standard screening tool (GAD-2). They help us understand your baseline worry levels."}
                    </p>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
