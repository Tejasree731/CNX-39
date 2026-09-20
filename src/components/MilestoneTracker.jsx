import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Circle, Wind, Brain, Users, ClipboardList } from 'lucide-react';

const icons = {
  breathing: <Wind size={20} />,
  meditation: <Brain size={20} />,
  talking_to_friend: <Users size={20} />,
  mood_check: <CheckCircle2 size={20} />,
  anxiety_test: <ClipboardList size={20} />
};

export default function MilestoneTracker({ milestones, onSelect }) {
  const { t } = useTranslation();
  
  const labels = {
    breathing: t('milestones.breathing', 'Breathing Exercise'),
    meditation: t('milestones.meditation', 'Mindful Meditation'),
    talking_to_friend: t('milestones.talking_to_friend', 'Talk to a Friend'),
    mood_check: t('milestones.mood_check', 'Daily Mood Check'),
    anxiety_test: t('milestones.anxiety_test', 'Anxiety Assessment')
  };

  const required = ['breathing', 'meditation', 'talking_to_friend', 'mood_check', 'anxiety_test'];
  const completedCount = milestones.filter(m => m.completed).length;
  const progressPercentage = (completedCount / required.length) * 100;

  return (
    <div className="bg-white dark:bg-[#11141c] p-6 rounded-2xl border border-gray-200 dark:border-[#1e2330] shadow-[3px_3px_0_0_#181b22] dark:shadow-[3px_3px_0_0_rgba(255,255,255,0.06)] flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-neutral-400 mb-1">
              Active Quests
            </p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('milestones.title', 'Wellness Journey')}</h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">{t('milestones.subtitle', 'Complete milestones to unlock mental health analysis.')}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-mono font-black text-primary-600 dark:text-primary-400 border border-primary-500/30 dark:border-primary-500/40 bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1 rounded-lg shadow-[2px_2px_0_0_#0284c7]">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 dark:bg-neutral-800 h-2.5 rounded-full mb-6 overflow-hidden border border-gray-200 dark:border-neutral-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            className="h-full bg-gradient-to-r from-primary-500 via-emerald-400 to-emerald-500"
          />
        </div>

        {/* Milestone List */}
        <div className="space-y-2.5">
          {required.map((id) => {
            const m = milestones.find(item => item.id === id);
            const isCompleted = m?.completed;

            return (
              <button
                key={id}
                onClick={() => !isCompleted && onSelect(id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                  isCompleted 
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 opacity-85' 
                  : 'bg-white dark:bg-[#151922] border-gray-200 dark:border-[#222838] shadow-[2px_2px_0_0_#181b22] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.06)] hover:shadow-[1px_1px_0_0_#181b22] dark:hover:shadow-[1px_1px_0_0_rgba(255,255,255,0.1)] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 ${isCompleted ? 'bg-emerald-500 text-white shadow-[1px_1px_0_0_#059669]' : 'bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400'}`}>
                    {icons[id]}
                  </div>
                  <div className="text-left">
                    <p className={`font-bold text-xs sm:text-sm ${isCompleted ? 'text-emerald-800 dark:text-emerald-300 line-through opacity-80' : 'text-gray-800 dark:text-neutral-200'}`}>
                      {labels[id]}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-neutral-400 font-mono">
                      {isCompleted ? t('milestones.completed', 'Completed') : t('milestones.start_activity', 'Click to start')}
                    </p>
                  </div>
                </div>
                <div>
                  {isCompleted ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-gray-300 dark:text-neutral-600" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
