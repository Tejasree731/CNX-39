import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Loader2, CheckCircle2, AlertCircle, Printer, Calendar, Clock, User, Hash } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  amount, 
  onConfirm, 
  description, 
  therapistName, 
  date, 
  isFree,
  timeSlot 
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleRazorpayPayment = async () => {
    if (amount === 0 || isFree) {
      onConfirm('FREE', 'FREE');
      setSuccess(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};

      const keyRes = await fetch('/api/payment/key', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { key } = await keyRes.json();

      const orderRes = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount, description })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Order Creation Failed");

      const options = {
        key: key, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Svasthya Support",
        description: description,
        order_id: orderData.id,
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ orderId: orderData.id, paymentId: response.razorpay_payment_id, signature: response.razorpay_signature })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setReceiptData(response);
              setSuccess(true);
              toast.success("Payment Received!");
              onConfirm(response.razorpay_order_id, response.razorpay_payment_id);
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            toast.error("Payment verification error.");
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', function (response){
        toast.error("Payment failed: " + response.error.description);
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-[#07050f]/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 print:p-0 print:bg-white">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           className={`bg-[#0d0a1a] w-full max-w-lg rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(124,58,237,0.25)] border border-[#261a45] relative transition-all ${success ? 'max-w-xl' : 'max-w-md'} print:shadow-none print:border-none print:w-full print:max-w-none`}
        >
          {success ? (
            <div className="p-8 print:p-0">
               <div className="flex justify-between items-center mb-8 print:hidden">
                  <div className="flex items-center gap-2 text-secondary-400 font-bold drop-shadow-[0_0_8px_rgba(16,192,122,0.5)]">
                     <CheckCircle2 size={24} /> Payment Confirmed
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-[#16102e] text-violet-400 hover:text-white rounded-full transition-colors">
                     <X size={20} />
                  </button>
               </div>

               {/* DIGITAL RECEIPT UI */}
               <div className="bg-[#130d28] rounded-3xl p-8 border border-[#2a1d4a] print:bg-transparent shadow-inner">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <h2 className="text-3xl font-black bg-gradient-to-r from-violet-300 to-magenta-300 bg-clip-text text-transparent mb-1 italic">Svasthya</h2>
                        <p className="text-xs text-violet-400/60 font-bold tracking-widest uppercase">Official Digital Receipt</p>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold text-violet-100">{new Date().toLocaleDateString()}</p>
                        <p className="text-xs text-violet-400/50">Invoice: INV-{receiptData?.razorpay_payment_id ? receiptData.razorpay_payment_id.slice(-6).toUpperCase() : '---'}</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-violet-400/60 uppercase tracking-widest">Description</p>
                           <p className="text-sm font-bold text-violet-200">{description}</p>
                        </div>
                        <div className="space-y-1 text-right">
                           <p className="text-[10px] font-black text-violet-400/60 uppercase tracking-widest">Amount Paid</p>
                           <p className="text-2xl font-black text-secondary-400">₹{amount}</p>
                        </div>
                     </div>

                     <hr className="border-[#261a45] border-dashed" />

                     <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        {therapistName && (
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-[#1c1236] rounded-lg border border-[#2a1d4a]">
                                <User size={14} className="text-violet-400" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-violet-400/60 uppercase">Professional</p>
                                <p className="text-xs font-bold text-violet-200">{therapistName}</p>
                             </div>
                          </div>
                        )}
                        {date && (
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-[#1c1236] rounded-lg border border-[#2a1d4a]">
                                <Calendar size={14} className="text-violet-400" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-violet-400/60 uppercase">Date</p>
                                <p className="text-xs font-bold text-violet-200">{date}</p>
                             </div>
                          </div>
                        )}
                        {timeSlot && (
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-[#1c1236] rounded-lg border border-[#2a1d4a]">
                                <Clock size={14} className="text-violet-400" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-violet-400/60 uppercase">Time Slot</p>
                                <p className="text-xs font-bold text-violet-200">{timeSlot}</p>
                             </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-[#1c1236] rounded-lg border border-[#2a1d4a]">
                              <Hash size={14} className="text-violet-400" />
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-violet-400/60 uppercase">Payment ID</p>
                              <p className="text-[10px] font-bold text-violet-200 truncate w-24 lg:w-32">{receiptData?.razorpay_payment_id}</p>
                           </div>
                        </div>
                     </div>

                     <div className="mt-8 p-4 bg-violet-950/30 rounded-2xl border border-violet-500/20 text-center">
                        <p className="text-[10px] text-violet-300 font-bold uppercase tracking-widest">CONFIDENTIALITY GUARANTEED</p>
                        <p className="text-[9px] text-violet-400/70 mt-1 uppercase tracking-tighter">System verified document • Svasthya Cryptographic Seal</p>
                     </div>
                  </div>
               </div>

               <div className="mt-6 flex gap-3 print:hidden">
                  <button 
                     onClick={handlePrint}
                     className="flex-1 bg-gradient-to-r from-violet-600 to-magenta-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:from-violet-500 hover:to-magenta-500 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] cursor-pointer"
                  >
                     <Printer size={18} /> Print Receipt
                  </button>
                  <button 
                     onClick={onClose}
                     className="flex-1 bg-[#150f2f] text-violet-200 font-bold py-3.5 rounded-2xl border border-[#2a1d4a] hover:bg-[#1e153f] hover:text-white transition-all cursor-pointer"
                  >
                     Done
                  </button>
               </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-[#130d28] p-6 border-b border-[#261a45] flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <ShieldCheck className="text-violet-400" /> Razorpay Checkout
                  </h2>
                  <p className="text-xs text-secondary-400 mt-1 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 animate-pulse"></span>
                    256-Bit Encrypted Payment
                  </p>
                </div>
                <button onClick={onClose} disabled={loading} className="text-violet-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Info Area */}
              <div className="p-8 space-y-6">
                <div className="text-center">
                   <p className="text-xs text-violet-400/70 uppercase font-black tracking-widest mb-2">Payment Summary</p>
                   <p className="text-4xl font-black text-white mb-1">₹{amount}</p>
                   <p className="text-sm font-medium text-violet-300/80">{description}</p>
                </div>

                <div className="bg-violet-950/40 p-4 rounded-2xl border border-violet-500/30 flex items-start gap-3">
                   <AlertCircle size={18} className="text-violet-400 shrink-0 mt-0.5" />
                   <p className="text-[11px] text-violet-200 leading-relaxed font-medium">
                     You are about to be redirected to the secure Razorpay payment gateway to finalize your transaction. 
                     Please do not close this window or refresh the page during processing.
                   </p>
                </div>

                <button
                  onClick={handleRazorpayPayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-magenta-600 hover:from-violet-500 hover:to-magenta-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl mt-4 shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Preparing...</>
                  ) : (
                    isFree ? 'Confirm Free Session' : `Open Checkout Modal`
                  )}
                </button>
                <div className="flex items-center justify-center gap-4 mt-6 opacity-40">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-3" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3" />
                   <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-4" />
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
