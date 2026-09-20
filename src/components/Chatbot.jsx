import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, BrainCircuit, Sparkles } from 'lucide-react';

const BotMessage = ({ text }) => (
  <div className="flex gap-2.5 w-full items-start">
    <div className="bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border border-violet-500/30 text-violet-300 p-2 rounded-xl h-8 w-8 flex-shrink-0 flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.2)]">
      <BrainCircuit size={16} />
    </div>
    <div className="bg-[#15102a] dark:bg-[#15102a] border border-[#261a45] text-violet-100 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm max-w-[85%] leading-relaxed shadow-sm">
      {text}
    </div>
  </div>
);

const UserMessage = ({ text }) => (
  <div className="flex justify-end w-full">
    <div className="bg-gradient-to-r from-violet-600 to-magenta-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm max-w-[85%] leading-relaxed shadow-[0_4px_16px_rgba(124,58,237,0.3)] font-medium">
      {text}
    </div>
  </div>
);

export default function Chatbot() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: t('chatbot.greeting', 'Hi there! I am your Svasthya Companion. I can provide grounding exercises, stress-relief tips, or just be here to chat. How are you feeling right now?') }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    setMessages([{ type: 'bot', text: t('chatbot.greeting', 'Hi there! I am your Svasthya Companion. I can provide grounding exercises, stress-relief tips, or just be here to chat. How are you feeling right now?') }]);
  }, [i18n.language, t]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('svasthya-open-chat', handleOpenChat);
    return () => window.removeEventListener('svasthya-open-chat', handleOpenChat);
  }, []);

  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const newMessages = [...messages, { type: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages
        .slice(1)
        .map(m => ({
          role: m.type === 'bot' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText, 
          history,
          language: i18n.language
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { type: 'bot', text: data.text }]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { type: 'bot', text: err.message || "I'm having a little trouble connecting right now. Please try again soon!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-14 h-14 bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-500 text-white rounded-full shadow-[0_0_25px_rgba(124,58,237,0.5)] hover:shadow-[0_0_35px_rgba(236,72,153,0.7)] ring-2 ring-violet-400/40 flex items-center justify-center z-50 transition-all cursor-pointer"
        aria-label="Open Svasthya AI Companion"
      >
        <MessageCircle size={26} className="drop-shadow" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-[370px] max-w-[calc(100vw-32px)] h-[520px] max-h-[calc(100vh-100px)] bg-[#0d0a1a]/95 backdrop-blur-xl border border-[#2a1d4a] rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.8),0_0_30px_rgba(124,58,237,0.25)] z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-700 via-fuchsia-700 to-magenta-600 p-4 flex justify-between items-center text-white shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm border border-white/20">
                  <BrainCircuit size={20} className="text-violet-100" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-white tracking-wide">Svasthya Companion</h3>
                    <Sparkles size={13} className="text-amber-300" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 animate-pulse"></span>
                    <p className="text-[10px] text-violet-200/90 font-medium">Free 24/7 AI Tips & Support</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white/80 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#07050f] scrollbar-bento">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  key={i}
                >
                  {msg.type === 'bot' ? <BotMessage text={msg.text} /> : <UserMessage text={msg.text} />}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5 w-full items-start">
                  <div className="bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 border border-violet-500/30 text-violet-300 p-2 rounded-xl h-8 w-8 flex-shrink-0 flex items-center justify-center">
                    <BrainCircuit size={16} className="animate-pulse" />
                  </div>
                  <div className="bg-[#15102a] border border-[#261a45] text-violet-400 px-4 py-3 rounded-2xl rounded-tl-sm text-xs flex gap-1.5 items-center">
                    <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-magenta-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-[#1e1535] bg-[#0d0a1a] shrink-0">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type how you feel..."
                  className="w-full bg-[#15102a] border border-[#2a1d4a] rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-violet-500 text-violet-100 placeholder-violet-400/40 transition-colors shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-1.5 p-2 bg-gradient-to-r from-violet-600 to-magenta-600 text-white rounded-full hover:from-violet-500 hover:to-magenta-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
