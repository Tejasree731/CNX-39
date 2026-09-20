import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi | हिन्दी' },
  { code: 'te', name: 'Telugu | తెలుగు' }
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#13102a] hover:bg-[#1c153d] border border-[#2a1d4a] hover:border-violet-500/50 transition-all text-xs font-semibold text-violet-200 shadow-sm"
      >
        <Languages size={14} className="text-violet-400" />
        <span>{currentLanguage.name.split('|')[0].trim()}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-[#0d0a1a] border border-[#261a45] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(124,58,237,0.2)] z-50 overflow-hidden"
            >
              <div className="p-2 space-y-1">
                {languages.map((lng) => (
                  <button
                    key={lng.code}
                    onClick={() => changeLanguage(lng.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                      i18n.language === lng.code
                        ? 'bg-violet-600/20 border border-violet-500/40 text-violet-200 font-bold shadow-sm'
                        : 'text-violet-300/70 hover:bg-[#16102e] hover:text-white'
                    }`}
                  >
                    <span>{lng.name}</span>
                    {i18n.language === lng.code && <Check size={14} className="text-violet-400" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
