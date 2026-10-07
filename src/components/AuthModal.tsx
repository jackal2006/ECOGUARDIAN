import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, loginAsDemoUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full name');
        await registerWithEmail(name, email, password);
      } else {
        await loginWithEmail(email, password);
      }
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      if (msg.includes('auth/invalid-credential') || msg.includes('user-not-found')) {
        setError('Invalid email or password. You can also use the 1-Click Demo Citizen button below!');
      } else if (msg.includes('auth/email-already-in-use')) {
        setError('This email is already registered. Please sign in instead.');
      } else if (msg.includes('auth/weak-password')) {
        setError('Password should be at least 6 characters.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign in failed';
      console.warn('Google sign-in error:', msg);
      setError('Google Popup blocked or unavailable in iframe. Please use Demo Citizen login below.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'user' | 'admin') => {
    setLoading(true);
    try {
      await loginAsDemoUser(role);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-900 p-6 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md mb-3 border border-white/20">
              <Sparkles className="w-6 h-6 text-emerald-200" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              {isRegister ? 'Join Eco Guardian' : 'Welcome to Eco Guardian'}
            </h3>
            <p className="text-xs text-emerald-200 mt-1 max-w-xs mx-auto">
              {isRegister
                ? 'Create your environmental action profile and earn your first 50 Eco Points'
                : 'Sign in to submit reports, log challenges, and track community impact'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Processing...</span>
              ) : isRegister ? (
                <>
                  <span>Create Eco Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-xs text-emerald-800 hover:underline font-semibold"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </button>
          </div>

          {/* Google Sign In */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <span className="relative bg-white px-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Or evaluate instantly
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full py-2.5 border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors mb-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Dedicated Administrator Login for rahigudeviddesh7@gmail.com */}
          <div className="mt-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4 text-amber-200" />
              <span>Log in as rahigudeviddesh7@gmail.com (Admin)</span>
            </button>
          </div>

          {/* Quick Demo Access for Citizens */}
          <div className="grid grid-cols-2 gap-2 mt-2 pt-1">
            <button
              type="button"
              onClick={() => handleDemo('user')}
              className="py-2 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>Guest Citizen</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('rahigudeviddesh7@gmail.com');
                setIsRegister(false);
              }}
              className="py-2 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Fill Admin Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
