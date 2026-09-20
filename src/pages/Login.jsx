import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Sparkles, Lock, Mail, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [portal, setPortal] = useState('youth');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      if (portal === 'professional' && data.role === 'youth') {
        throw new Error("This account is not registered as a professional.");
      }
      if (portal === 'admin' && data.role !== 'admin') {
        throw new Error("This account lacks Administrator privileges.");
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, role: data.role }));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const portalConfig = {
    youth: { color: 'from-cyan-400 to-cyan-600', glow: 'shadow-cyan-500/30', ring: 'ring-cyan-400/50', label: 'Youth' },
    professional: { color: 'from-emerald-400 to-teal-600', glow: 'shadow-emerald-500/30', ring: 'ring-emerald-400/50', label: 'Mentor/Provider' },
    admin: { color: 'from-violet-400 to-purple-600', glow: 'shadow-purple-500/30', ring: 'ring-violet-400/50', label: 'Admin' },
  };
  const current = portalConfig[portal];

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Card */}
        <div className="bg-obsidian-800/80 backdrop-blur-xl border border-obsidian-600 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${current.color} flex items-center justify-center mb-4 shadow-lg ${current.glow} transition-all duration-300`}>
              <Sparkles size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back</h2>
            <p className="text-obsidian-400 text-sm mt-1 text-center">Log in to continue your journey.</p>
          </div>

          {/* Portal Segmented Control */}
          <div className="flex bg-obsidian-900/60 p-1 rounded-2xl mb-8 border border-obsidian-700">
            {['youth', 'professional', 'admin'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPortal(type)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl capitalize transition-all duration-300 ${
                  portal === type
                    ? 'bg-obsidian-700 text-white shadow-sm'
                    : 'text-obsidian-400 hover:text-obsidian-200'
                }`}
              >
                {type === 'professional' ? 'Pro' : type}
              </button>
            ))}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm mb-6 text-center border border-red-500/20 font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-obsidian-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Mail size={12} /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-900/60 border border-obsidian-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all text-white placeholder-obsidian-500 text-sm"
                placeholder={portal === 'admin' ? "admin@svasthya.com" : "you@example.com"}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-obsidian-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lock size={12} /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-obsidian-900/60 border border-obsidian-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all text-white placeholder-obsidian-500 text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-obsidian-600 bg-obsidian-900" />
                <span className="text-obsidian-400 text-xs font-medium">Remember me</span>
              </label>
              <a href="#" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wide text-white bg-gradient-to-r ${current.color} shadow-lg ${current.glow} hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:scale-100 mt-2`}
            >
              {loading ? 'Authenticating...' : `Log In → ${portalConfig[portal].label}`}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-obsidian-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
              Register for access
            </Link>
          </p>
        </div>

        {/* Bottom badge */}
        <p className="text-center mt-4 text-xs text-obsidian-500 flex items-center justify-center gap-1.5">
          <ShieldCheck size={12} className="text-cyan-500/60" />
          End-to-end encrypted · HIPAA-safe platform
        </p>
      </motion.div>
    </div>
  );
}
