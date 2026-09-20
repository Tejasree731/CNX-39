import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2, HeartPulse, Phone, AlertTriangle, Sparkles } from 'lucide-react';

// ─── Question Definitions ────────────────────────────────────────────────────

const YOUTH_QUESTIONS = [
  {
    id: 'q1',
    type: 'multi',
    question: "What are you going through right now? (Select all that apply)",
    subtitle: "This helps us match you with the right peer community. There are no wrong answers.",
    options: [
      { label: "Exam / academic pressure", value: "exam_pressure" },
      { label: "Social isolation or loneliness", value: "isolation" },
      { label: "Peer pressure or bullying", value: "peer_pressure" },
      { label: "Family conflict at home", value: "family" },
      { label: "Grief or loss of someone close", value: "grief" },
      { label: "Confusion about my identity or future", value: "identity" },
      { label: "Substance use (mine or someone else's)", value: "substance" },
      { label: "Thoughts of hurting myself", value: "self_harm" },
      { label: "Just looking to improve my mental health", value: "general" },
    ],
  },
  {
    id: 'q2',
    type: 'scale',
    question: "How often do you feel overwhelmed in a typical week?",
    subtitle: "Be honest — this is a safe space.",
    options: [
      { label: "Rarely (1–2 days)", value: "rarely" },
      { label: "Sometimes (3–4 days)", value: "sometimes" },
      { label: "Very often (5–6 days)", value: "often" },
      { label: "Every single day", value: "every_day" },
    ],
  },
  {
    id: 'q3',
    type: 'single',
    question: "Where does most of your stress come from?",
    subtitle: "Pick the biggest source right now.",
    options: [
      { label: "🏫 School / College", value: "school" },
      { label: "🏠 Home / Family", value: "home" },
      { label: "👥 Friends / Social life", value: "social" },
      { label: "💭 My own thoughts", value: "thoughts" },
      { label: "📱 Social media", value: "social_media" },
      { label: "💸 Financial pressure", value: "financial" },
    ],
  },
  {
    id: 'q4',
    type: 'single',
    question: "Have you been able to talk to anyone about how you're feeling?",
    subtitle: "No judgment — many people haven't.",
    options: [
      { label: "Yes, I have a trusted person", value: "yes_trusted" },
      { label: "A little bit, but not fully", value: "partial" },
      { label: "No, I keep it to myself", value: "no" },
      { label: "I don't feel safe talking to anyone", value: "unsafe" },
    ],
  },
  {
    id: 'q5',
    type: 'single',
    question: "What kind of support would help you the most?",
    subtitle: "We'll personalise your dashboard based on this.",
    options: [
      { label: "🤝 Peer community (people like me)", value: "peer_community" },
      { label: "🧠 AI companion / journaling", value: "ai_support" },
      { label: "🎯 Structured activities & exercises", value: "activities" },
      { label: "👨‍⚕️ Professional therapist guidance", value: "therapist" },
      { label: "📚 Learning resources & self-help", value: "resources" },
    ],
  },
];

const MENTOR_QUESTIONS = [
  {
    id: 'q1',
    type: 'single',
    question: "What personal challenge have you successfully navigated?",
    subtitle: "Your lived experience is your superpower as a mentor.",
    options: [
      { label: "🏆 Academic burnout / failure", value: "academic_recovery" },
      { label: "👥 Social isolation / confidence", value: "social_rebuilding" },
      { label: "🏠 Difficult family environment", value: "family_survivor" },
      { label: "💔 Grief and loss", value: "grief_navigator" },
      { label: "🌈 Identity struggles", value: "identity_journey" },
      { label: "🚫 Substance use recovery", value: "substance_recovery" },
    ],
  },
  {
    id: 'q2',
    type: 'single',
    question: "How long ago did your recovery or transformation begin?",
    subtitle: "This helps us understand your perspective.",
    options: [
      { label: "Less than 1 year ago", value: "recent" },
      { label: "1–3 years ago", value: "moderate" },
      { label: "3+ years ago", value: "established" },
    ],
  },
  {
    id: 'q3',
    type: 'single',
    question: "How many hours per week can you dedicate to mentoring?",
    subtitle: "Even 1–2 hours makes a huge difference.",
    options: [
      { label: "1–2 hours / week", value: "1-2" },
      { label: "3–5 hours / week", value: "3-5" },
      { label: "5+ hours / week", value: "5+" },
    ],
  },
];

const THERAPIST_QUESTIONS = [
  {
    id: 'q1',
    type: 'single',
    question: "What is your primary clinical focus?",
    subtitle: "Select the domain where you have the most experience.",
    options: [
      { label: "🧠 CBT & Anxiety Disorders", value: "cbt_anxiety" },
      { label: "🌧️ Adolescent Depression & Mood Disorders", value: "adolescent_depression" },
      { label: "🩹 Trauma-Informed Care & PTSD", value: "trauma_ptsd" },
      { label: "👨‍👩‍👧 Family Systems & Relational Therapy", value: "family_systems" },
      { label: "🌈 LGBTQ+ Affirmative Therapy", value: "lgbtq_affirmative" },
      { label: "🧘 Mindfulness & Somatic Approaches", value: "mindfulness_somatic" },
    ],
  },
  {
    id: 'q2',
    type: 'single',
    question: "What is your typical session format preference?",
    subtitle: "You can adjust this anytime in your settings.",
    options: [
      { label: "📹 Video sessions only", value: "video_only" },
      { label: "💬 Chat / text-based only", value: "chat_only" },
      { label: "🔄 Both video and chat", value: "both" },
    ],
  },
];

const ADMIN_QUESTIONS = [
  {
    id: 'q1',
    type: 'single',
    question: "Which administrative domain do you primarily oversee?",
    subtitle: "This tailors your Mission Control dashboard view.",
    options: [
      { label: "🛡️ Safety, Moderation & Crisis Response", value: "safety" },
      { label: "👥 Community Growth & Peer Matching", value: "growth" },
      { label: "👨‍⚕️ Clinical Operations & Therapist Network", value: "clinical" },
      { label: "📊 Overall Platform Governance", value: "governance" },
    ],
  },
  {
    id: 'q2',
    type: 'single',
    question: "Confirm your access level for Mission Control.",
    subtitle: "Acknowledgment of administrative responsibility.",
    options: [
      { label: "✅ I confirm my role as System Admin", value: "confirmed" },
    ],
  },
];

const COMMUNITY_LABELS = {
  academic_stress: { label: "Academic Stress Community", color: "bg-violet-600/20 text-violet-300 border border-violet-500/30", emoji: "📚" },
  social_anxiety: { label: "Social Confidence Community", color: "bg-fuchsia-600/20 text-fuchsia-300 border border-fuchsia-500/30", emoji: "💬" },
  family_conflict: { label: "Family Support Community", color: "bg-amber-500/20 text-amber-300 border border-amber-500/30", emoji: "🏠" },
  grief_loss: { label: "Grief & Healing Community", color: "bg-magenta-500/20 text-magenta-300 border border-magenta-500/30", emoji: "💗" },
  identity_crisis: { label: "Identity & Purpose Community", color: "bg-violet-500/20 text-violet-300 border border-violet-500/30", emoji: "🌈" },
  substance_risk: { label: "Wellbeing & Recovery Community", color: "bg-secondary-500/20 text-secondary-300 border border-secondary-500/30", emoji: "🌿" },
  self_harm_risk: { label: "Crisis Support (Private)", color: "bg-red-500/20 text-red-300 border border-red-500/30", emoji: "🆘" },
  general_wellness: { label: "General Wellness Community", color: "bg-secondary-500/20 text-secondary-300 border border-secondary-500/30", emoji: "💚" },
};

function OptionCard({ option, selected, onClick, multi }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 font-medium text-sm cursor-pointer ${
        selected
          ? 'border-violet-400 bg-violet-600/25 text-white shadow-[0_0_15px_rgba(124,58,237,0.35)]'
          : 'border-[#261a45] bg-[#130d28] text-violet-200 hover:border-violet-500/50 hover:text-white'
      }`}
    >
      <div className={`w-5 h-5 rounded-${multi ? 'md' : 'full'} border-2 flex items-center justify-center shrink-0 transition-all ${
        selected ? 'border-violet-400 bg-violet-500 shadow-[0_0_8px_#7c3aed]' : 'border-[#3a2761]'
      }`}>
        {selected && <div className={`${multi ? 'w-2 h-2' : 'w-2 h-2 rounded-full'} bg-white`} />}
      </div>
      <span>{option.label}</span>
    </button>
  );
}

function CrisisBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-950/40 border-2 border-red-500/40 rounded-3xl p-6 mb-6 shadow-[0_0_25px_rgba(239,68,68,0.25)]"
    >
      <div className="flex items-start gap-4">
        <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-2xl">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h3 className="text-red-300 font-bold text-lg mb-1">You are not alone</h3>
          <p className="text-red-200/80 text-sm leading-relaxed mb-4">
            It takes real courage to share what you're going through. We're connecting you directly with a professional support path, and a trained therapist will be available for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:9152987821"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-lg shadow-red-600/30"
            >
              <Phone size={16} /> iCall India: 9152987821
            </a>
            <a
              href="tel:1800599019"
              className="flex items-center gap-2 bg-[#160808] border border-red-500/50 text-red-300 px-5 py-2.5 rounded-full text-sm font-bold transition-colors hover:bg-red-900/30"
            >
              <Phone size={16} /> Vandrevala: 1800-599-0019
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const role = storedUser.role || 'youth';

  const questions =
    role === 'mentor' ? MENTOR_QUESTIONS :
    role === 'therapist' ? THERAPIST_QUESTIONS :
    role === 'admin' ? ADMIN_QUESTIONS :
    YOUTH_QUESTIONS;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCrisis, setIsCrisis] = useState(false);

  const totalSteps = questions.length;
  const isIntro = step === 0;
  const isResult = step === totalSteps + 1;
  const currentQ = questions[step - 1];

  const handleSelect = (qId, value, multi) => {
    if (multi) {
      const prev = answers[qId] || [];
      const updated = prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value];
      setAnswers({ ...answers, [qId]: updated });
    } else {
      setAnswers({ ...answers, [qId]: value });
    }
  };

  const canProceed = () => {
    if (isIntro) return true;
    const ans = answers[currentQ?.id];
    return Array.isArray(ans) ? ans.length > 0 : !!ans;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setIsCrisis(data.isCrisisRisk || false);
        setStep(totalSteps + 1);
      }
    } catch (err) {
      console.error(err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (step === totalSteps) {
      handleSubmit();
    } else {
      setStep(s => s + 1);
    }
  };

  const progress = isResult ? 100 : Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-[#07050f] flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Aurora mesh background */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-magenta-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">

        {/* Header */}
        {!isResult && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <HeartPulse className="text-magenta-400 w-6 h-6" />
              <span className="bg-gradient-to-r from-violet-300 to-magenta-300 bg-clip-text text-transparent font-bold text-sm uppercase tracking-wider">
                Svasthya Onboarding
              </span>
            </div>
            {!isIntro && (
              <>
                <p className="text-xs text-violet-400/60 mb-2 font-medium">Step {step} of {totalSteps}</p>
                <div className="w-full bg-[#130d28] h-2 rounded-full overflow-hidden border border-[#261a45]">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-magenta-500 shadow-[0_0_10px_rgba(124,58,237,0.5)] rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -25 }}
          transition={{ duration: 0.3 }}
          className="bg-[#0d0a1a] rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(124,58,237,0.15)] border border-[#1e1535] p-8 sm:p-10"
        >

          {/* ── INTRO ── */}
          {isIntro && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border border-violet-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                <HeartPulse className="w-10 h-10 text-magenta-400" />
              </div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-violet-200 via-fuchsia-100 to-white bg-clip-text text-transparent mb-3 italic">
                Welcome, {storedUser.name?.split(' ')[0] || 'Friend'} 👋
              </h1>
              <p className="text-violet-200/70 text-base leading-relaxed mb-8 max-w-md mx-auto">
                {role === 'youth'
                  ? "We have a few quick questions to understand what you're going through and connect you to the right community and support. This will take about 2 minutes."
                  : role === 'mentor'
                  ? "We'd love to understand your journey so we can match you with the youth who'll benefit most from your experience."
                  : role === 'therapist'
                  ? "Tell us about your clinical background so we can connect you with youth who need your expertise."
                  : "Welcome to the Svasthya Management Console. Let's set up your administrative profile to get you started."}
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-violet-300/80 mb-8">
                <span className="flex items-center gap-1.5 bg-[#130d28] px-4 py-2 rounded-full border border-[#261a45]">🔒 Completely private</span>
                <span className="flex items-center gap-1.5 bg-[#130d28] px-4 py-2 rounded-full border border-[#261a45]">⏱ ~2 minutes</span>
                <span className="flex items-center gap-1.5 bg-[#130d28] px-4 py-2 rounded-full border border-[#261a45]">✏️ {totalSteps} questions</span>
              </div>
            </div>
          )}

          {/* ── QUESTION ── */}
          {!isIntro && !isResult && currentQ && (
            <div>
              {role === 'youth' && (answers.q1 || []).includes('self_harm') && <CrisisBanner />}

              <h2 className="text-xl sm:text-2xl font-black text-white italic mb-2">{currentQ.question}</h2>
              {currentQ.subtitle && <p className="text-violet-300/70 text-sm mb-6 font-medium">{currentQ.subtitle}</p>}

              <div className="space-y-3">
                {currentQ.options.map(opt => {
                  const isMulti = currentQ.type === 'multi';
                  const selected = isMulti
                    ? (answers[currentQ.id] || []).includes(opt.value)
                    : answers[currentQ.id] === opt.value;
                  return (
                    <OptionCard
                      key={opt.value}
                      option={opt}
                      selected={selected}
                      multi={isMulti}
                      onClick={() => handleSelect(currentQ.id, opt.value, isMulti)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {isResult && result && (
            <div className="text-center">
              {isCrisis ? (
                <>
                  <div className="w-20 h-20 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                    <AlertTriangle className="w-10 h-10 text-red-400" />
                  </div>
                  <h2 className="text-2xl font-black text-white italic mb-3">We're here with you</h2>
                  <p className="text-violet-200/80 mb-6 leading-relaxed">
                    Your safety matters most. We've flagged your profile for priority therapist support. In the meantime, please reach out to a crisis helpline.
                  </p>
                  <CrisisBanner />
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-secondary-500/20 border border-secondary-500/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(16,192,122,0.4)]">
                    <CheckCircle2 className="w-10 h-10 text-secondary-400" />
                  </div>
                  <h2 className="text-3xl font-black text-white italic mb-2">You're all set! 🎉</h2>
                  {role === 'youth' && result.communityTags?.length > 0 && (
                    <>
                      <p className="text-violet-300/70 mb-6 font-medium">We've matched you with these communities:</p>
                      <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {result.communityTags.slice(0, 4).map(tag => {
                          const comm = COMMUNITY_LABELS[tag] || { label: tag, color: 'bg-violet-600/20 text-violet-300 border border-violet-500/30', emoji: '💚' };
                          return (
                            <span key={tag} className={`${comm.color} px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm`}>
                              {comm.emoji} {comm.label}
                            </span>
                          );
                        })}
                      </div>
                    </>
                  )}
                  {role !== 'youth' && (
                    <p className="text-violet-300/70 mb-8 font-medium">Your profile is set up. Head to your dashboard to get started.</p>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── Navigation ── */}
          <div className={`flex mt-8 ${step > 0 && !isResult ? 'justify-between' : 'justify-center'}`}>
            {step > 0 && !isResult && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-[#261a45] text-violet-300 hover:text-white hover:bg-[#130d28] font-bold text-sm transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}

            {!isResult ? (
              <button
                onClick={next}
                disabled={!canProceed() || loading}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-magenta-600 hover:from-violet-500 hover:to-magenta-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
              >
                {loading ? 'Saving...' : step === totalSteps ? 'Finish & See My Communities' : 'Continue'}
                {!loading && <ArrowRight size={16} />}
              </button>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-magenta-600 hover:from-violet-500 hover:to-magenta-500 text-white px-10 py-3.5 rounded-full font-bold text-sm shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
              >
                Go to My Dashboard <ArrowRight size={16} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
