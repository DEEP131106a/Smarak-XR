import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  User,
  Mail,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Compass,
  Globe,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { loginUser } from '../../services/heritageStateService';
import { soundEngine } from '../../services/soundEngine';
import { triggerHaptic } from '../../utils/haptics';
import confetti from 'canvas-confetti';

interface Props {
  onLoginSuccess: () => void;
  onExploreAsGuest?: () => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
];

const ROLES = [
  'Culture Guardian',
  'Heritage Custodian',
  'Temple Historian',
  'AR Architect',
];

export const LoginPage: React.FC<Props> = ({ onLoginSuccess, onExploreAsGuest }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  // Controlled form state
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>(ROLES[0]);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATAR_OPTIONS[0]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUser = username.trim();
    if (!trimmedUser) {
      setError('Please enter your explorer username or full name.');
      triggerHaptic('heavy');
      return;
    }

    if (activeTab === 'register' && !email.trim()) {
      setError('Please enter an email address to link your heritage passport.');
      triggerHaptic('heavy');
      return;
    }

    if (!password) {
      setError('Please provide your security access passcode.');
      triggerHaptic('heavy');
      return;
    }

    setIsSubmitting(true);
    triggerHaptic('tap');

    setTimeout(() => {
      // 1. Save user to state & localStorage
      loginUser(trimmedUser, email, selectedRole, selectedAvatar);

      // 2. Audio & Haptics
      soundEngine.playTempleBell(880, 2.5);
      triggerHaptic('success');

      // 3. Confetti celebratory burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#c85a32', '#10b981'],
      });

      // 4. Navigate to application
      onLoginSuccess();
    }, 400);
  };

  const handleGuestLogin = () => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(659, 1.5);
    setIsSubmitting(true);

    setTimeout(() => {
      loginUser('Guest Explorer', 'guest@smarak-xr.org', 'Culture Explorer');
      if (onExploreAsGuest) {
        onExploreAsGuest();
      } else {
        onLoginSuccess();
      }
    }, 250);
  };

  const handleGoogleLogin = () => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(784, 1.8);
    setIsSubmitting(true);

    setTimeout(() => {
      loginUser('Vansh (Google)', 'vansh@gmail.com', 'Heritage Custodian');
      onLoginSuccess();
    }, 350);
  };

  const handleQuickDemoFill = () => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(659, 1.0);
    setUsername('Vansh');
    setPassword('HeritageExplorer2026');
    setEmail('vansh@smarak-xr.com');
    setSelectedRole('Culture Guardian');
    setError(null);
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center p-4 sm:p-6 relative select-none">
      {/* Background Atmosphere */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-96 h-96 rounded-full bg-[#d4af37]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-96 h-96 rounded-full bg-[#c85a32]/10 blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#c85a32] via-[#d4af37] to-[#e06d43] p-0.5 shadow-2xl shadow-[#d4af37]/25 mx-auto mb-3 transform hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-[#0e1017] flex items-center justify-center text-3xl">
              🏛️
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Smarak AI • Cultural Heritage Collective</span>
          </div>

          <h1 className="font-cinzel font-black text-2xl sm:text-3xl text-stone-100 tracking-wide">
            {activeTab === 'signin' ? 'Explorer Sign In' : 'Join Cultural Heritage'}
          </h1>
          <p className="text-xs text-amber-200/70 font-outfit mt-1 max-w-xs mx-auto">
            {activeTab === 'signin'
              ? 'Access 3D AR heritage, 6 Indian city models, and community preservation lore.'
              : 'Create your explorer profile to adopt vanishing crafts, preserve oral stories & earn badges.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-2xl bg-black/60 p-1 border border-[#d4af37]/30 mb-4 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap');
              setActiveTab('signin');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#c85a32] text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap');
              setActiveTab('register');
              setError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#c85a32] text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Card */}
        <div className="glass-heritage rounded-3xl border border-[#d4af37]/30 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in shake">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Avatar Selector in Register Mode */}
            {activeTab === 'register' && (
              <div>
                <label className="block text-[11px] font-bold text-amber-200/80 mb-2 uppercase tracking-wider">
                  Choose Explorer Avatar
                </label>
                <div className="flex items-center justify-center gap-3">
                  {AVATAR_OPTIONS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedAvatar(url)}
                      className={`relative rounded-2xl overflow-hidden p-0.5 border-2 transition-transform cursor-pointer ${
                        selectedAvatar === url
                          ? 'border-[#d4af37] scale-110 shadow-lg shadow-[#d4af37]/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Avatar" className="w-12 h-12 rounded-xl object-cover" />
                      {selectedAvatar === url && (
                        <div className="absolute top-0 right-0 bg-[#d4af37] text-black rounded-bl-lg p-0.5">
                          <CheckCircle2 className="w-3 h-3 text-black" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Explorer Name Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-[11px] font-bold text-amber-200/80 mb-1.5 uppercase tracking-wider"
              >
                Explorer Name / Username
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-[#d4af37]/70 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g., Vansh"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-900/60 border border-stone-700/60 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 text-white placeholder-stone-500 text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Input in Register Mode */}
            {activeTab === 'register' && (
              <div>
                <label
                  htmlFor="email"
                  className="block text-[11px] font-bold text-amber-200/80 mb-1.5 uppercase tracking-wider"
                >
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-[#d4af37]/70 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="explorer@smarak-xr.org"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-900/60 border border-stone-700/60 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 text-white placeholder-stone-500 text-sm outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Passcode / Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-bold text-amber-200/80 mb-1.5 uppercase tracking-wider"
              >
                Passcode / Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-[#d4af37]/70 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-stone-900/60 border border-stone-700/60 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 text-white placeholder-stone-500 text-sm outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-stone-400 hover:text-amber-300 p-1 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Specialization Role in Register Mode */}
            {activeTab === 'register' && (
              <div>
                <label className="block text-[11px] font-bold text-amber-200/80 mb-1.5 uppercase tracking-wider">
                  Specialization Title
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer text-[11px] flex items-center gap-1.5 ${
                        selectedRole === role
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-amber-300 font-bold'
                          : 'bg-stone-900/40 border-stone-800 text-stone-400 hover:text-white'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{role}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Remember Me / Auto-fill Link */}
            <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer hover:text-stone-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-700 bg-stone-900 text-[#d4af37] focus:ring-[#d4af37]"
                />
                <span>Remember session</span>
              </label>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-[#d4af37] hover:underline transition-colors"
              >
                Auto-fill credentials
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#c85a32] to-[#d4af37] hover:brightness-110 text-stone-950 font-cinzel font-black text-sm shadow-xl shadow-[#d4af37]/25 border border-amber-300 transform active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Entering Smarak Platform...</span>
                </>
              ) : (
                <>
                  <span>{activeTab === 'signin' ? 'Enter Heritage Sanctum' : 'Create Explorer Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Auth Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="border-t border-stone-800 w-full" />
            <span className="bg-[#12141d] px-3 text-[11px] text-stone-400 uppercase tracking-widest font-mono">
              Alternative Options
            </span>
          </div>

          {/* Social / Guest Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="py-2.5 px-3 rounded-2xl bg-stone-900/60 hover:bg-stone-800/80 border border-stone-800 hover:border-[#d4af37]/40 text-xs font-semibold text-stone-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-rose-400" />
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              className="py-2.5 px-3 rounded-2xl bg-amber-950/30 hover:bg-amber-900/50 border border-[#d4af37]/30 text-xs font-semibold text-amber-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#d4af37]" />
              <span>Guest Mode</span>
            </button>
          </div>

          {/* 1-Click Demo Evaluation Button */}
          <div className="mt-4 pt-4 border-t border-stone-800">
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="w-full py-2 px-3 rounded-xl bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>1-Click Sign-In as Vansh (Evaluator Demo)</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-stone-500 mt-4">
          Session persisted in client <code className="text-[#d4af37] font-mono">localStorage</code>.
        </p>
      </motion.div>
    </div>
  );
};
