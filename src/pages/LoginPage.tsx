import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GoogleOAuthButton } from '../components/auth/GoogleOAuthButton';
import { Mail, Lock, ArrowRight, ShieldCheck, Info } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('alex@dailynest.com');
  const [password, setPassword] = useState('password123');
  const [formError, setFormError] = useState('');
  const { loginWithEmail, isLoading } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const res = await loginWithEmail(email, password);
    if (res.success) {
      success('Logged in successfully!');
      navigate('/account');
    } else {
      setFormError(res.error || 'Login failed. Please verify credentials.');
    }
  };

  return (
    <div className="py-16 bg-[#F8FAF8] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-emerald-950/5 shadow-card space-y-6 animate-slide-up">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#0F3427] flex items-center justify-center shadow-md">
              <span className="w-4 h-4 rounded-full border-2 border-fresh-400" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-[#0F3427]">
              Daily<span className="text-[#12B76A]">Nest</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-slate-800">Welcome back</h1>
          <p className="text-xs text-slate-500">Sign in to your DailyNest account to manage your essentials</p>
        </div>

        {/* Real Google OAuth Login Button */}
        <div className="space-y-3">
          <GoogleOAuthButton />
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase">
              Or sign in with email
            </span>
          </div>
        </div>

        {/* Demo Credentials Note */}
        <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/60 text-xs text-[#0F3427] flex items-start gap-2">
          <Info className="w-4 h-4 text-fresh-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Instant Demo Account Pre-filled:</span>
            <p className="text-[11px] text-slate-600">alex@dailynest.com &bull; password123</p>
          </div>
        </div>

        {/* Form Error Alert */}
        {formError && (
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-700 font-semibold">
            {formError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F3427] text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F3427] text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-bold text-[#144333] hover:underline">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};
