import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, ChevronRight, ChevronLeft, ShieldCheck,
  AlertCircle, Sparkles, Brain, Zap, Users, LayoutGrid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// ── Question Banks ──────────────────────────────────────────────────────────
const INSTRUMENTS = {
  'GAD-7': {
    title: 'Anxiety Assessment',
    label: 'GAD-7',
    subtitle: 'Generalized Anxiety Disorder Scale',
    description: 'Measures how often anxiety, nervousness, and worry have affected you over the last 2 weeks.',
    icon: Brain,
    color: 'violet',
    optionType: 'frequency',
    questions: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it is hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid, as if something awful might happen'
    ]
  },
  'PHQ-9': {
    title: 'Depression Assessment',
    label: 'PHQ-9',
    subtitle: 'Patient Health Questionnaire',
    description: 'Screens for mood and interest patterns that indicate depression over the last 2 weeks.',
    icon: Sparkles,
    color: 'jade',
    optionType: 'frequency',
    questions: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself or that you are a failure',
      'Trouble concentrating on things',
      'Moving or speaking unusually slowly — or being unusually restless',
      'Thoughts that you would be better off dead or of hurting yourself'
    ]
  },
  'RQ-10': {
    title: 'Resilience Quotient',
    label: 'RQ-10',
    subtitle: 'Svasthya Resilience Index',
    description: 'Measures your ability to adapt and recover from challenges. An original Svasthya wellness instrument.',
    icon: Zap,
    color: 'amber',
    optionType: 'agreement',
    questions: [
      'When something goes wrong, I find a way to work through it',
      'I believe setbacks make me stronger in the long run',
      'I have at least one person I can turn to when things get hard',
      'I am able to manage my emotions during stressful situations',
      'I find meaning in difficult experiences',
      'I can identify my own strengths and use them when I need to',
      'I feel confident in my ability to solve problems',
      'I bounce back quickly after disappointments',
      'I am able to stay hopeful even in tough times',
      'I regularly practice something that restores my energy (e.g. exercise, art, rest)'
    ]
  },
  'SCS-8': {
    title: 'Social Connectedness Scale',
    label: 'SCS-8',
    subtitle: 'Svasthya Belonging Index',
    description: 'Measures how seen, valued, and connected you feel in your world. An original Svasthya wellness instrument.',
    icon: Users,
    color: 'magenta',
    optionType: 'likert',
    questions: [
      'I feel like I belong somewhere — at home, school, or with a group',
      'There are people in my life who truly understand me',
      'I feel comfortable asking for help when I need it',
      'I rarely feel invisible or overlooked by those around me',
      'I feel like my presence matters to at least one person',
      'I have people I enjoy spending time with regularly',
      'I feel safe being honest about how I feel with someone I trust',
      'Overall, I feel connected to the world around me'
    ]
  }
};

const FREQUENCY_OPTIONS = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 }
];

const AGREEMENT_OPTIONS = [
  { label: 'Never', value: 0 },
  { label: 'Rarely', value: 1 },
  { label: 'Sometimes', value: 2 },
  { label: 'Always', value: 3 }
];

const LIKERT_OPTIONS = [
  { label: 'Strongly Disagree', value: 1 },
  { label: 'Disagree', value: 2 },
  { label: 'Neutral', value: 3 },
  { label: 'Agree', value: 4 },
  { label: 'Strongly Agree', value: 5 }
];

const COLOR_CLASSES = {
  violet: { 
    bg: 'bg-violet-600/20', 
    text: 'text-violet-400', 
    border: 'border-violet-500/30', 
    selected: 'border-violet-400 bg-violet-600/30 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]' 
  },
  jade: { 
    bg: 'bg-secondary-500/20', 
    text: 'text-secondary-400', 
    border: 'border-secondary-500/30', 
    selected: 'border-secondary-400 bg-secondary-500/30 text-white shadow-[0_0_15px_rgba(16,192,122,0.4)]' 
  },
  amber: { 
    bg: 'bg-amber-500/20', 
    text: 'text-amber-400', 
    border: 'border-amber-500/30', 
    selected: 'border-amber-400 bg-amber-500/30 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
  },
  magenta: { 
    bg: 'bg-magenta-500/20', 
    text: 'text-magenta-400', 
    border: 'border-magenta-500/30', 
    selected: 'border-magenta-400 bg-magenta-500/30 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]' 
  },
};

const SEVERITY_COLORS = {
  'None-Minimal': 'text-secondary-300 bg-secondary-500/20 border border-secondary-500/30',
  'Mild': 'text-amber-300 bg-amber-500/20 border border-amber-500/30',
  'Moderate': 'text-orange-300 bg-orange-500/20 border border-orange-500/30',
  'Moderately Severe': 'text-pink-300 bg-pink-500/20 border border-pink-500/30',
  'Severe': 'text-magenta-300 bg-magenta-500/30 border border-magenta-500/50',
  'Fragile': 'text-pink-300 bg-pink-500/20 border border-pink-500/30',
  'Developing': 'text-amber-300 bg-amber-500/20 border border-amber-500/30',
  'Strong': 'text-violet-300 bg-violet-500/20 border border-violet-500/30',
  'Champion': 'text-secondary-300 bg-secondary-500/20 border border-secondary-500/30',
  'Isolated': 'text-magenta-300 bg-magenta-500/30 border border-magenta-500/40',
  'At-Risk': 'text-orange-300 bg-orange-500/20 border border-orange-500/30',
  'Connected': 'text-violet-300 bg-violet-500/20 border border-violet-500/30',
  'Thriving': 'text-secondary-300 bg-secondary-500/20 border border-secondary-500/30',
};

// ── Main Component ──────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const [mode, setMode] = useState('home'); // 'home' | 'single' | 'comprehensive'
  const [activeType, setActiveType] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const COMP_SEQUENCE = ['GAD-7', 'PHQ-9', 'RQ-10', 'SCS-8'];
  const [compIndex, setCompIndex] = useState(0);
  const [compResults, setCompResults] = useState([]);
  const navigate = useNavigate();

  const instrument = activeType ? INSTRUMENTS[activeType] : null;
  const questions = instrument?.questions || [];
  const options = instrument?.optionType === 'likert' ? LIKERT_OPTIONS : instrument?.optionType === 'agreement' ? AGREEMENT_OPTIONS : FREQUENCY_OPTIONS;
  const colors = instrument ? COLOR_CLASSES[instrument.color] : COLOR_CLASSES.violet;

  const startSingle = (type) => {
    setMode('single');
    setActiveType(type);
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  const startComprehensive = () => {
    setMode('comprehensive');
    setCompIndex(0);
    setActiveType(COMP_SEQUENCE[0]);
    setStep(0);
    setAnswers([]);
    setResult(null);
    setCompResults([]);
  };

  const handleSelect = (val) => {
    const newAnswers = [...answers];
    newAnswers[step] = val;
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 260);
    }
  };

  const submitAssessment = async (type, answersToSubmit) => {
    const token = localStorage.getItem('token');
    if (!token) { toast.error('Session expired. Please log in.'); return null; }

    const inst = INSTRUMENTS[type];
    const res = await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ type, title: inst.title, answers: answersToSubmit })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Submission failed');
    return data;
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      if (mode === 'single') {
        const data = await submitAssessment(activeType, answers);
        setResult(data);
        toast.success('Assessment complete!');
      } else {
        const data = await submitAssessment(activeType, answers);
        const newResults = [...compResults, data];
        setCompResults(newResults);

        if (compIndex < COMP_SEQUENCE.length - 1) {
          const nextIdx = compIndex + 1;
          setCompIndex(nextIdx);
          setActiveType(COMP_SEQUENCE[nextIdx]);
          setStep(0);
          setAnswers([]);
          toast.success(`${activeType} complete! Starting ${COMP_SEQUENCE[nextIdx]}...`);
        } else {
          setResult({ comprehensive: true, results: newResults });
          toast.success('Full Wellness Report complete!');
        }
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Result Screen ───────────────────────────────────────────────────────
  if (result) {
    if (result.comprehensive) {
      return <ComprehensiveResult results={result.results} onBack={() => { setMode('home'); setResult(null); }} navigate={navigate} />;
    }
    return <SingleResult result={result} instrument={instrument} questions={questions} colors={colors} onBack={() => { setMode('home'); setResult(null); setActiveType(null); }} navigate={navigate} />;
  }

  // ── Home Screen ─────────────────────────────────────────────────────────
  if (mode === 'home') {
    return (
      <div className="min-h-screen bg-[#07050f] py-16 px-4 relative overflow-hidden">
        {/* Aurora Mesh background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-magenta-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-violet-200 via-fuchsia-200 to-white bg-clip-text text-transparent italic tracking-tight mb-3">
              Wellbeing Assessments
            </h1>
            <p className="text-xs text-violet-400 font-bold uppercase tracking-widest">
              Clinical & Svasthya-Original Psychometric Instruments
            </p>
          </div>

          {/* Comprehensive CTA */}
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            onClick={startComprehensive}
            className="w-full mb-10 p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-r from-violet-700 via-fuchsia-700 to-magenta-600 text-white text-left flex items-center justify-between shadow-[0_0_35px_rgba(124,58,237,0.35)] relative overflow-hidden group cursor-pointer border border-white/10"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/15 rounded-xl backdrop-blur-md">
                  <LayoutGrid size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-200">Recommended Protocol</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black italic mb-1">Full Wellness Report</h2>
              <p className="text-sm text-violet-100/80 font-medium max-w-xl">Complete all 4 assessments in one streamlined flow. Generates an AI neural insight letter.</p>
            </div>
            <ChevronRight size={32} className="shrink-0 text-white/70 group-hover:translate-x-1 group-hover:text-white transition-all" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          </motion.button>

          {/* Individual Instrument Cards */}
          <p className="text-[10px] font-black text-violet-400/60 uppercase tracking-[0.2em] mb-5">Or choose individually</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Object.entries(INSTRUMENTS).map(([key, inst]) => {
              const Icon = inst.icon;
              const c = COLOR_CLASSES[inst.color];
              return (
                <motion.button
                  key={key}
                  whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}
                  onClick={() => startSingle(key)}
                  className="bg-[#0d0a1a] p-8 rounded-[2rem] border border-[#1e1535] hover:border-violet-500/40 shadow-sm text-left flex flex-col justify-between relative overflow-hidden group transition-all cursor-pointer"
                >
                  <div>
                    <div className={`p-3.5 ${c.bg} ${c.text} rounded-2xl w-fit border ${c.border} mb-4 shadow-inner`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-violet-400/60 uppercase tracking-[0.2em] mb-1">{key}</p>
                      <h3 className="text-lg font-black text-white italic leading-tight">{inst.title}</h3>
                      <p className="text-[11px] text-violet-300/60 font-medium mt-2 leading-relaxed">{inst.description.split('.')[0]}.</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-[9px] font-black ${c.text} uppercase tracking-widest mt-6`}>
                    {inst.questions.length} questions <ChevronRight size={12} />
                  </div>
                  <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${c.bg} rounded-full blur-2xl opacity-30 group-hover:opacity-80 transition-opacity`} />
                </motion.button>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div className="mt-10 p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-start gap-4">
            <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-amber-200/80 font-medium leading-relaxed">
              GAD-7 and PHQ-9 are validated clinical screening tools. RQ-10 and SCS-8 are original Svasthya Wellness Instruments inspired by established research. None of these replace a formal clinical diagnosis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Question Screen ─────────────────────────────────────────────────────
  const totalSteps = mode === 'comprehensive' 
    ? COMP_SEQUENCE.reduce((t, k) => t + INSTRUMENTS[k].questions.length, 0)
    : questions.length;
  const completedSteps = mode === 'comprehensive'
    ? COMP_SEQUENCE.slice(0, compIndex).reduce((t, k) => t + INSTRUMENTS[k].questions.length, 0) + step
    : step;

  return (
    <div className="min-h-screen bg-[#07050f] py-16 px-4 relative overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => { setMode('home'); setActiveType(null); setResult(null); }}
            className="text-[10px] font-black text-violet-400/70 uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft size={14} /> Exit
          </button>
          <div className="text-center">
            <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${colors.text}`}>{activeType}</p>
            {mode === 'comprehensive' && (
              <p className="text-[9px] text-violet-400/60 font-bold">Assessment {compIndex + 1} of {COMP_SEQUENCE.length}</p>
            )}
          </div>
          <span className="text-[10px] font-black text-violet-400 tabular-nums">
            {step + 1} / {questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-[#130d28] rounded-full overflow-hidden mb-8 border border-[#261a45]">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-magenta-500 shadow-[0_0_10px_rgba(124,58,237,0.5)]"
            animate={{ width: `${((completedSteps + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeType}-${step}`}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0d0a1a] rounded-[3rem] p-8 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(124,58,237,0.15)] border border-[#1e1535] mb-8"
          >
            <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${colors.text} mb-4`}>
              {instrument?.subtitle}
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-white italic leading-snug mb-10">
              {questions[step]}
            </h2>

            <div className={`grid gap-3 ${options.length === 5 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {options.map((opt) => {
                const isSelected = answers[step] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`p-4 rounded-2xl border-2 text-sm font-bold text-left transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? colors.selected 
                        : 'border-[#261a45] bg-[#130d28] text-violet-200/80 hover:border-violet-500/40 hover:text-white'
                    }`}
                  >
                    <span className={`text-[9px] font-black block uppercase tracking-widest mb-0.5 ${isSelected ? 'text-white' : 'text-violet-400/50'}`}>
                      {opt.value}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            disabled={step === 0}
            onClick={() => setStep(s => s - 1)}
            className="p-4 text-violet-400/40 hover:text-violet-300 disabled:opacity-0 transition-all cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>

          {step === questions.length - 1 && answers[step] !== undefined && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleFinish}
              disabled={submitting}
              className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-magenta-600 hover:from-violet-500 hover:to-magenta-500 text-white font-black px-10 py-4 rounded-2xl shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all uppercase tracking-widest text-[10px] disabled:opacity-60 cursor-pointer"
            >
              {submitting
                ? 'Generating Insight...'
                : mode === 'comprehensive' && compIndex < COMP_SEQUENCE.length - 1
                  ? `Next: ${COMP_SEQUENCE[compIndex + 1]} →`
                  : 'Finish & Get Insight'}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Single Result Component ─────────────────────────────────────────────────
function SingleResult({ result, instrument, questions, colors, onBack, navigate }) {
  const Icon = instrument?.icon || ShieldCheck;
  const maxScore = questions.length * (instrument?.optionType === 'likert' ? 5 : 3);
  const pct = Math.round((result.totalScore / maxScore) * 100);
  const sevColor = SEVERITY_COLORS[result.severity] || 'text-violet-300 bg-violet-500/20';

  return (
    <div className="min-h-screen bg-[#07050f] py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-[#0d0a1a] rounded-[3rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(124,58,237,0.2)] border border-[#261a45] mb-6">
          <div className={`w-16 h-16 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center mb-6 border ${colors.border} shadow-[0_0_20px_rgba(124,58,237,0.3)]`}>
            <Icon size={28} />
          </div>

          <p className="text-[9px] font-black text-violet-400/60 uppercase tracking-[0.2em] mb-2">{result.type} Result</p>
          <h2 className="text-3xl font-black text-white italic mb-6">{result.title}</h2>

          {/* Score Bar */}
          <div className="bg-[#130d28] rounded-2xl p-6 mb-6 border border-[#2a1d4a]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black text-violet-300/70 uppercase tracking-widest">Clinical Score</span>
              <span className="text-3xl font-black text-white italic">{result.totalScore}</span>
            </div>
            <div className="h-2 bg-[#07050f] rounded-full overflow-hidden mb-4 border border-[#261a45]">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-magenta-400 shadow-[0_0_10px_rgba(124,58,237,0.6)]"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${sevColor}`}>
              {result.severity}
            </span>
          </div>

          {/* Clinical Interpretation */}
          <p className="text-sm text-violet-200/80 font-medium leading-relaxed mb-6">
            {result.clinicalInterpretation}
          </p>

          {/* AI Insight */}
          {result.aiInsight && (
            <div className="bg-gradient-to-br from-violet-950/40 to-magenta-950/30 border border-violet-500/30 rounded-3xl p-6 mb-6">
              <p className="text-[9px] font-black text-violet-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <Sparkles size={12} className="text-amber-400" /> AI Insight Letter
              </p>
              <p className="text-sm text-violet-100 leading-relaxed italic font-medium">
                "{result.aiInsight}"
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-violet-600 to-magenta-600 text-white font-black py-4 rounded-2xl hover:from-violet-500 hover:to-magenta-500 transition-all uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(124,58,237,0.4)] cursor-pointer"
          >
            Dashboard
          </button>
          <button
            onClick={onBack}
            className="bg-[#130d28] text-violet-200 font-black py-4 rounded-2xl hover:bg-[#1a1236] transition-all uppercase text-[10px] tracking-widest border border-[#2a1d4a] cursor-pointer"
          >
            Try Another
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Comprehensive Report ────────────────────────────────────────────────────
function ComprehensiveResult({ results, onBack, navigate }) {
  return (
    <div className="min-h-screen bg-[#07050f] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-violet-200 to-white bg-clip-text text-transparent italic mb-2">
            Full Wellness Report
          </h2>
          <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">Your complete Svasthya wellbeing profile</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          {results.map((r, i) => {
            const inst = INSTRUMENTS[r.type];
            const Icon = inst?.icon || ShieldCheck;
            const c = COLOR_CLASSES[inst?.color || 'violet'];
            const sevColor = SEVERITY_COLORS[r.severity] || 'text-violet-300 bg-violet-500/20';

            return (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0d0a1a] rounded-[2rem] p-7 border border-[#1e1535] shadow-sm"
              >
                <div className={`w-10 h-10 ${c.bg} ${c.text} rounded-xl flex items-center justify-center mb-4 border ${c.border}`}>
                  <Icon size={18} />
                </div>
                <p className="text-[9px] font-black text-violet-400/60 uppercase tracking-[0.2em] mb-1">{r.type}</p>
                <h4 className="text-base font-black text-white italic mb-3">{r.title}</h4>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${sevColor}`}>
                    {r.severity}
                  </span>
                  <span className="text-2xl font-black text-white italic">{r.totalScore}</span>
                </div>
                {r.aiInsight && (
                  <p className="text-[11px] text-violet-300/70 leading-relaxed italic border-t border-[#1e1535] pt-3">
                    "{r.aiInsight.slice(0, 120)}..."
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-violet-600 to-magenta-600 text-white font-black py-4 rounded-2xl hover:from-violet-500 hover:to-magenta-500 transition-all uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(124,58,237,0.4)] cursor-pointer"
          >
            View Dashboard
          </button>
          <button
            onClick={onBack}
            className="bg-[#130d28] text-violet-200 font-black py-4 rounded-2xl hover:bg-[#1a1236] transition-all uppercase text-[10px] tracking-widest border border-[#2a1d4a] cursor-pointer"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    </div>
  );
}
