import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Sparkles, ShieldCheck, User, Mail, Lock, Briefcase, KeyRound } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'youth',
    licenseNumber: '', specialization: '', adminCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, role: data.role }));
      navigate('/onboarding');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const roles = [
    { value: 'youth', label: 'Youth', color: 'from-cyan-400 to-sky-500', glow: 'shadow-cyan-500/30' },
    { value: 'mentor', label: 'Mentor', color: 'from-blue-400 to-indigo-500', glow: 'shadow-blue-500/30' },
    { value: 'therapist', label: 'Therapist', color: 'from-emerald-400 to-teal-500', glow: 'shadow-emerald-500/30' },
    { value: 'admin', label: 'Admin', color: 'from-violet-400 to-purple-600', glow: 'shadow-purple-500/30' },
  ];

  const activeRole = roles.find(r => r.value === formData.role);

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full"
      >
        {/* Card */}
        <div className="bg-obsidian-800/80 backdrop-blur-xl border border-obsidian-600 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeRole?.color} flex items-center justify-center mb-4 shadow-lg ${activeRole?.glow} transition-all duration-500`}>
              <Sparkles size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Create Account</h2>
            <p className="text-obsidian-400 text-sm mt-1 text-center">
              Join the safest digital community for youth wellbeing.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm mb-6 text-center border border-red-500/20 font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name + Email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-obsidian-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User size={12} /> Full Name
                </label>
                <input
                  type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-900/60 border border-obsidian-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all text-white placeholder-obsidian-500 text-sm"
                  placeholder="First and Last Name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-obsidian-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Mail size={12} /> Email Address
                </label>
                <input
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-900/60 border border-obsidian-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all text-white placeholder-obsidian-500 text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-obsidian-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lock size={12} /> Password
              </label>
              <input
                type="password" name="password" required value={formData.password} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-900/60 border border-obsidian-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all text-white placeholder-obsidian-500 text-sm"
                placeholder="••••••••"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-obsidian-300 uppercase tracking-wider mb-3">
                I am registering as a:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {roles.map(({ value, label, color, glow }) => {
                  const isSelected = formData.role === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: value })}
                      className={`py-3 px-2 rounded-xl text-sm font-bold transition-all duration-200 border ${
                        isSelected
                          ? `bg-gradient-to-br ${color} text-white border-transparent shadow-lg ${glow} scale-[1.03]`
                          : 'bg-obsidian-900/50 border-obsidian-600 text-obsidian-400 hover:text-obsidian-200 hover:border-obsidian-500'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conditional Role Fields */}
            <AnimatePresence>
              {(formData.role === 'therapist' || formData.role === 'mentor' || formData.role === 'admin') && (
                <motion.div
                  initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  className="bg-obsidian-900/60 p-5 rounded-2xl border border-obsidian-700 space-y-4"
                >
                  {formData.role === 'admin' && (
                    <div>
                      <label className="block text-xs font-bold text-obsidian-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <KeyRound size={12} /> System Security Code
                      </label>
                      <input
                        type="password" name="adminCode" required value={formData.adminCode} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-obsidian-800 border border-obsidian-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 outline-none transition-all text-white placeholder-obsidian-500 text-sm"
                        placeholder="Admin secret phrase"
                      />
                    </div>
                  )}
                  {formData.role === 'therapist' && (
                    <div>
                      <label className="block text-xs font-bold text-obsidian-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <ShieldCheck size={12} /> Medical License Number
                      </label>
                      <input
                        type="text" name="licenseNumber" required value={formData.licenseNumber} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-obsidian-800 border border-obsidian-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all text-white placeholder-obsidian-500 text-sm"
                        placeholder="e.g. MH-12345678"
                      />
                    </div>
                  )}
                  {(formData.role === 'therapist' || formData.role === 'mentor') && (
                    <div>
                      <label className="block text-xs font-bold text-obsidian-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Briefcase size={12} /> Area of Specialization
                      </label>
                      <input
                        type="text" name="specialization" value={formData.specialization} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-obsidian-800 border border-obsidian-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all text-white placeholder-obsidian-500 text-sm"
                        placeholder={formData.role === 'therapist' ? "e.g. CBT, Trauma" : "e.g. Academic Stress"}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wide text-white bg-gradient-to-r ${activeRole?.color} shadow-lg ${activeRole?.glow} hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:scale-100 mt-2`}
            >
              {loading ? 'Creating Account...' : 'Finish Registration →'}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-obsidian-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
              Log in here
            </Link>
          </p>
        </div>

        <p className="text-center mt-4 text-xs text-obsidian-500 flex items-center justify-center gap-1.5">
          <ShieldCheck size={12} className="text-cyan-500/60" />
          End-to-end encrypted · HIPAA-safe platform
        </p>
      </motion.div>
    </div>
  );
}
