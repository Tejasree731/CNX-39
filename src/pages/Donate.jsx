import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShieldCheck, Sparkles, Plus } from 'lucide-react';
import { toast } from 'sonner';
import PaymentModal from '../components/PaymentModal';

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [showPayment, setShowPayment] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [customVal, setCustomVal] = useState('');

  const impactPoints = [
    { amount: 500, label: "Fund a Counseling Session", icon: "🤝", description: "Provide a 45-minute professional therapy session for a youth in crisis." },
    { amount: 1500, label: "Community Safe-Space", icon: "🌍", description: "Keep the servers running and moderate the support groups for a month." },
    { amount: 3000, label: "Digital Resilience Kit", icon: "🎒", description: "Develop and translate wellbeing activities into 5 more regional languages." },
  ];

  const handleDonate = () => {
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-[#07050f] py-12 sm:py-20 relative overflow-hidden">
      {/* Aurora mesh background */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-magenta-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
           <motion.div initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} className="bg-magenta-500/20 text-magenta-400 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-magenta-500/30 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
             <Heart size={30} fill="currentColor" />
           </motion.div>
           <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-violet-200 via-fuchsia-200 to-white bg-clip-text text-transparent tracking-tight italic">
             Support Our Mission
           </h1>
           <p className="text-base sm:text-lg text-violet-200/70 max-w-2xl mx-auto leading-relaxed font-medium">
             Svasthya is built to ensure no adolescent ever feels alone in their mental health journey. Your contribution directly funds crisis support and server costs.
           </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
           
          <div className="space-y-6">
            {impactPoints.map((point, i) => (
               <motion.div 
                  key={i} 
                  initial={{opacity:0, x: -20}} 
                  animate={{opacity:1, x:0}} 
                  transition={{delay: i * 0.1}}
                  className="bg-[#0d0a1a] p-8 rounded-[2.5rem] border border-[#1e1535] hover:border-violet-500/40 shadow-sm transition-all group flex items-start gap-6"
               >
                  <div className="text-4xl shrink-0 group-hover:scale-110 transition-transform">
                     {point.icon}
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-white italic mb-2">{point.label}</h3>
                     <p className="text-violet-300/60 text-sm leading-relaxed mb-4">{point.description}</p>
                     <div className="text-secondary-400 font-black text-2xl drop-shadow-[0_0_8px_rgba(16,192,122,0.4)]">₹{point.amount}</div>
                  </div>
               </motion.div>
            ))}
          </div>

          {/* Donation Form */}
          <motion.div initial={{opacity:0, y: 20}} animate={{opacity:1, y: 0}} className="bg-[#0d0a1a] rounded-[3rem] p-8 sm:p-10 border border-[#1e1535] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(124,58,237,0.15)] relative overflow-hidden">
             
             <div className="absolute top-0 right-0 p-8 opacity-5 text-violet-400 pointer-events-none">
                <Sparkles size={140} />
             </div>

             <h2 className="text-2xl font-black text-white italic mb-8 relative z-10">Choose Impact Amount</h2>
             
             <div className="grid grid-cols-2 gap-4 mb-8">
                {[500, 1000, 1500, 3000].map(amt => (
                   <button 
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setIsCustom(false); }}
                      className={`py-4 rounded-2xl font-black text-lg border-2 transition-all cursor-pointer ${
                         selectedAmount === amt && !isCustom 
                         ? 'border-violet-400 bg-violet-600/30 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                         : 'border-[#261a45] bg-[#130d28] text-violet-300/70 hover:border-violet-500/40 hover:text-white'
                      }`}
                   >
                     ₹{amt}
                   </button>
                ))}
                <button 
                   onClick={() => setIsCustom(true)}
                   className={`col-span-2 py-4 rounded-2xl font-black text-lg border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isCustom 
                      ? 'border-violet-400 bg-violet-600/30 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                      : 'border-[#261a45] bg-[#130d28] text-violet-300/70 hover:border-violet-500/40 hover:text-white'
                   }`}
                >
                   <Plus size={20} /> Other Amount
                </button>
             </div>

             <AnimatePresence>
                {isCustom && (
                   <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="mb-8 overflow-hidden">
                      <div className="relative">
                         <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-violet-400">₹</span>
                         <input 
                            type="number" 
                            placeholder="Enter custom amount" 
                            value={customVal}
                            onChange={(e) => {setCustomVal(e.target.value); setSelectedAmount(parseInt(e.target.value) || 0); }}
                            className="w-full bg-[#130d28] border border-[#261a45] rounded-2xl pl-12 pr-4 py-4 text-xl font-bold text-white focus:border-violet-500 outline-none transition-colors" 
                         />
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>

             <button 
                onClick={handleDonate}
                disabled={selectedAmount <= 0}
                className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-magenta-600 hover:from-violet-500 hover:to-magenta-500 disabled:opacity-50 text-white font-black py-5 rounded-3xl shadow-[0_0_25px_rgba(236,72,153,0.4)] transition-all flex items-center justify-center gap-3 text-base uppercase tracking-widest cursor-pointer"
             >
                Confirm Donation Contribution <Heart size={20} fill="currentColor" />
             </button>

             <div className="mt-8 pt-8 border-t border-[#1e1535] flex items-center gap-2 justify-center opacity-75">
                <ShieldCheck className="text-secondary-400" size={16} />
                <p className="text-[11px] font-bold text-violet-400 uppercase tracking-widest">Powered by Razorpay Secure Payments</p>
             </div>

          </motion.div>

        </div>

      </div>

      <PaymentModal 
         isOpen={showPayment} 
         onClose={() => setShowPayment(false)} 
         amount={selectedAmount} 
         description="Svasthya Platform Donation"
         onConfirm={async (orderId, paymentId) => {
            try {
               const token = localStorage.getItem('token');
               const user = JSON.parse(localStorage.getItem('user') || '{}');
               const response = await fetch('/api/donations/record', {
                  method: 'POST',
                  headers: { 
                     'Content-Type': 'application/json',
                     'Authorization': token ? `Bearer ${token}` : ''
                  },
                  body: JSON.stringify({
                     amount: selectedAmount,
                     razorpayOrderId: orderId,
                     razorpayPaymentId: paymentId,
                     donorName: user.name || 'Anonymous'
                  })
               });

               if (!response.ok) throw new Error("Database record failed");

               toast.success("Donation successful! Thank you for your support.");
               setSelectedAmount(500);
               setShowPayment(false);
            } catch (err) {
               console.error("Donation record failed:", err);
               toast.error("Payment verified but record failed. Please contact support.");
            }
         }} 
      />
    </div>
  );
}
