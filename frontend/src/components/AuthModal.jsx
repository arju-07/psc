import React, { useState } from 'react';
import { X, Mail, Lock, ShieldCheck, GraduationCap, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess
}) {
  if (!isOpen) return null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await api.login(email);
      if (res.user) {
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickProfile = async (targetEmail) => {
    setLoading(true);
    try {
      const res = await api.login(targetEmail);
      if (res.user) {
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err) {
      console.error('Quick profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl relative space-y-5">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-2">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Sign In to Kerala PYQ Hub
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 ml-text">
            Firebase Authentication & Candidate Account Access
          </p>
        </div>

        {/* Quick Profile Selection */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            One-Click Demo Profiles
          </p>

          <button
            type="button"
            onClick={() => handleQuickProfile('student@keralapyqhub.org')}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between group transition"
          >
            <div className="flex items-center space-x-2.5">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Devika"
                alt=""
                className="w-7 h-7 rounded-full border border-emerald-500/40"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                  Devika Nair (Student Aspirant)
                </p>
                <p className="text-[11px] text-slate-400">student@keralapyqhub.org</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 px-2 py-0.5 rounded">
              Student
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickProfile('admin@keralapyqhub.org')}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between group transition"
          >
            <div className="flex items-center space-x-2.5">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arun"
                alt=""
                className="w-7 h-7 rounded-full border border-purple-500/40"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600">
                  Arun Kumar (System Admin)
                </p>
                <p className="text-[11px] text-slate-400">admin@keralapyqhub.org</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 px-2 py-0.5 rounded">
              Admin
            </span>
          </button>
        </div>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700" /></div>
          <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white dark:bg-slate-800 px-2 text-slate-400">Or sign in with email</span></div>
        </div>

        {/* Custom Email Form */}
        <form onSubmit={handleCustomLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In / Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
