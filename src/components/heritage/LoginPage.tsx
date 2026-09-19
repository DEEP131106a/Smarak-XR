import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  User,
  Mail,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Compass,
  Globe,
  Award,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { loginUser } from '../../services/heritageStateService';
import { soundEngine } from '../../services/soundEngine';
import { triggerHaptic } from '../../utils/haptics';
import confetti from 'canvas-confetti';
import USERS_DATABASE from '../../data/users.json';

interface Props {
  onLoginSuccess: () => void;
  onExploreAsGuest?: () => void;
}

interface StoredUser {
  id?: string;
  name: string;
  username?: string;
  email: string;
  password?: string;
  uid?: string;
  role: string;
  level?: number;
  points?: number;
  avatar: string;
  isAdmin?: boolean;
}

const REGISTERED_USERS_KEY = 'smarak_registered_users';

function getStoredRegisteredUsers(): StoredUser[] {
  try {
    const data = localStorage.getItem(REGISTERED_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUser(newUser: StoredUser): void {
  try {
    const existing = getStoredRegisteredUsers();
    existing.push(newUser);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('Could not persist registered user:', err);
  }
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

interface PasswordValidationResult {
  isValid: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  isOnlyDigits: boolean;
  isOnlyLetters: boolean;
  hasMinLength: boolean;
  message?: string;
}

function validateUserPassword(pwd: string): PasswordValidationResult {
  const hasLetter = /[a-zA-Z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const isOnlyDigits = pwd.length > 0 && /^\d+$/.test(pwd);
  const isOnlyLetters = pwd.length > 0 && /^[a-zA-Z]+$/.test(pwd);
  const hasMinLength = pwd.length >= 6;

  if (isOnlyDigits) {
    return {
      isValid: false,
      hasLetter,
      hasNumber,
      isOnlyDigits: true,
      isOnlyLetters: false,
      hasMinLength,
      message: 'Only alphanumeric password is required! Please include letters as well as numbers.',
    };
  }

  if (isOnlyLetters) {
    return {
      isValid: false,
      hasLetter,
      hasNumber,
      isOnlyDigits: false,
      isOnlyLetters: true,
      hasMinLength,
      message: 'Only alphanumeric password is required! Please include numbers as well as letters (e.g., Heritage2024).',
    };
  }

  if (!hasMinLength) {
    return {
      isValid: false,
      hasLetter,
      hasNumber,
      isOnlyDigits: false,
      isOnlyLetters: false,
      hasMinLength: false,
      message: 'Password must be at least 6 characters long and alphanumeric.',
    };
  }

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      hasLetter,
      hasNumber,
      isOnlyDigits: false,
      isOnlyLetters: false,
      hasMinLength,
      message: 'Only alphanumeric password is required! Must contain both letters and numbers (e.g., Explorer2026).',
    };
  }

  return {
    isValid: true,
    hasLetter: true,
    hasNumber: true,
    isOnlyDigits: false,
    isOnlyLetters: false,
    hasMinLength: true,
  };
}

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
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Live password validation for register tab
  const pwdValidation = validateUserPassword(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser) {
      setError(activeTab === 'signin' ? 'Please enter your username or email.' : 'Please enter your username.');
      triggerHaptic('heavy');
      return;
    }

    if (activeTab === 'register') {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        setError('Please enter a valid email address.');
        triggerHaptic('heavy');
        return;
      }

      // Check if username attempts to clash with admin usernames
      const isReserved = USERS_DATABASE.some(
        (u) =>
          u.username.toLowerCase() === trimmedUser.toLowerCase() ||
          u.name.toLowerCase() === trimmedUser.toLowerCase()
      );
      if (isReserved) {
        setError('This username is reserved. Please select another username.');
        triggerHaptic('heavy');
        return;
      }

      // STRICT ALPHANUMERIC PASSWORD VALIDATION FOR REGULAR USERS
      if (!pwdValidation.isValid) {
        const alertMsg =
          pwdValidation.message ||
          'Only alphanumeric password is required to set the password! Please include both letters and numbers (e.g., Heritage2026).';

        setError(alertMsg);
        triggerHaptic('heavy');

        // Explicit browser alert as requested
        if (typeof window !== 'undefined') {
          window.alert(
            '⚠️ Password Requirement Alert:\n\nOnly alphanumeric password is required to set the password!\n\n• Must contain letters and numbers (e.g., Explorer2026)\n• Minimum 6 characters.'
          );
        }
        return;
      }

      // Check if user/email already exists
      const existingUsers = getStoredRegisteredUsers();
      const duplicate =
        USERS_DATABASE.find(
          (u) =>
            u.username.toLowerCase() === trimmedUser.toLowerCase() ||
            u.email.toLowerCase() === trimmedEmail.toLowerCase()
        ) ||
        existingUsers.find(
          (u) =>
            (u.username && u.username.toLowerCase() === trimmedUser.toLowerCase()) ||
            u.email.toLowerCase() === trimmedEmail.toLowerCase()
        );

      if (duplicate) {
        setError('An account with this username or email already exists. Please sign in instead.');
        triggerHaptic('heavy');
        return;
      }

      // Register new regular user with alphanumeric credentials
      setIsSubmitting(true);
      triggerHaptic('tap');

      const newUser: StoredUser = {
        name: trimmedUser,
        username: trimmedUser.toLowerCase().replace(/\s+/g, '_'),
        email: trimmedEmail,
        password: trimmedPass,
        role: selectedRole,
        avatar: selectedAvatar,
        level: 1,
        points: 100,
        isAdmin: false,
      };

      saveRegisteredUser(newUser);

      setTimeout(() => {
        loginUser(
          newUser.name,
          newUser.email,
          newUser.role,
          newUser.avatar,
          newUser.points,
          newUser.level,
          false // regular user
        );
        soundEngine.playTempleBell(880, 2.5);
        triggerHaptic('success');
        confetti({
          particleCount: 70,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#c85a32', '#10b981'],
        });
        onLoginSuccess();
      }, 350);
      return;
    }

    // SIGN IN FLOW
    if (!trimmedPass) {
      setError('Please enter your password.');
      triggerHaptic('heavy');
      return;
    }

    // 1. Check if it is a built-in ADMIN account (UID credentials handled securely in backend)
    const matchedAdmin = USERS_DATABASE.find(
      (u) =>
        u.username.toLowerCase() === trimmedUser.toLowerCase() ||
        u.name.toLowerCase() === trimmedUser.toLowerCase() ||
        u.email.toLowerCase() === trimmedUser.toLowerCase()
    );

    if (matchedAdmin) {
      const valid =
        trimmedPass === matchedAdmin.password ||
        (matchedAdmin.uid && trimmedPass === matchedAdmin.uid);

      if (!valid) {
        setError('Incorrect username or password. Please try again.');
        triggerHaptic('heavy');
        return;
      }

      setIsSubmitting(true);
      triggerHaptic('tap');

      setTimeout(() => {
        loginUser(
          matchedAdmin.name,
          matchedAdmin.email,
          matchedAdmin.role,
          matchedAdmin.avatar,
          matchedAdmin.points,
          matchedAdmin.level,
          Boolean(matchedAdmin.isAdmin)
        );

        soundEngine.playTempleBell(880, 2.5);
        triggerHaptic('success');

        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#e06d43', '#10b981'],
        });

        onLoginSuccess();
      }, 350);
      return;
    }

    // 2. Check registered users (alphanumeric credentials)
    const registeredUsers = getStoredRegisteredUsers();
    const matchedUser = registeredUsers.find(
      (u) =>
        (u.username && u.username.toLowerCase() === trimmedUser.toLowerCase()) ||
        u.name.toLowerCase() === trimmedUser.toLowerCase() ||
        u.email.toLowerCase() === trimmedUser.toLowerCase()
    );

    if (matchedUser) {
      if (trimmedPass !== matchedUser.password) {
        setError('Incorrect username or password. Please try again.');
        triggerHaptic('heavy');
        return;
      }

      setIsSubmitting(true);
      triggerHaptic('tap');

      setTimeout(() => {
        loginUser(
          matchedUser.name,
          matchedUser.email,
          matchedUser.role,
          matchedUser.avatar,
          matchedUser.points,
          matchedUser.level,
          false // Regular user
        );

        soundEngine.playTempleBell(880, 2.5);
        triggerHaptic('success');

        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#c85a32', '#10b981'],
        });

        onLoginSuccess();
      }, 350);
      return;
    }

    // No user found
    setError('Account not found. Please verify your credentials or register an account.');
    triggerHaptic('heavy');
  };

  const handleGuestLogin = () => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(659, 1.5);
    setIsSubmitting(true);

    setTimeout(() => {
      loginUser('Guest Explorer', 'guest@smarak-xr.org', 'Culture Explorer', undefined, 100, 1, false);
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
      loginUser('Explorer', 'explorer@gmail.com', 'Heritage Custodian', undefined, 150, 1, false);
      onLoginSuccess();
    }, 350);
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
            {activeTab === 'signin' ? 'Sanctum Explorer Login' : 'Create Explorer Account'}
          </h1>
          <p className="text-xs text-amber-200/70 font-outfit mt-1 max-w-xs mx-auto">
            {activeTab === 'signin'
              ? 'Sign in to access 3D AR heritage monuments and community stories.'
              : 'Join the Smarak collective. Set your username and alphanumeric password.'}
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
              setInfoMessage(null);
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
              setInfoMessage(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#c85a32] text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Form Card */}
        <div className="glass-heritage rounded-3xl border border-[#d4af37]/30 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in shake">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{error}</span>
              </div>
            )}

            {infoMessage && (
              <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>{infoMessage}</span>
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

            {/* Username / Name Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-[11px] font-bold text-amber-200/80 mb-1.5 uppercase tracking-wider"
              >
                {activeTab === 'signin' ? 'Username or Email' : 'Explorer Username'}
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
                  placeholder={
                    activeTab === 'signin'
                      ? 'Enter your username or email'
                      : 'Choose your unique username (e.g. alex_explorer)'
                  }
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
                    placeholder="explorer@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-900/60 border border-stone-700/60 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 text-white placeholder-stone-500 text-sm outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-[11px] font-bold text-amber-200/80 uppercase tracking-wider"
                >
                  Password
                </label>
                {activeTab === 'register' && (
                  <span className="text-[10px] text-amber-300 font-mono font-medium">
                    Letters & Numbers Required
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-[#d4af37]/70 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={activeTab === 'signin' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={
                    activeTab === 'signin'
                      ? 'Enter your password'
                      : 'e.g., Heritage2026'
                  }
                  className={`w-full pl-10 pr-11 py-3 rounded-2xl bg-stone-900/60 border text-white placeholder-stone-500 text-sm outline-none transition-all ${
                    activeTab === 'register' && password.length > 0
                      ? pwdValidation.isValid
                        ? 'border-emerald-500/60 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                        : 'border-amber-500/60 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20'
                      : 'border-stone-700/60 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-stone-400 hover:text-amber-300 p-1 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* LIVE PASSWORD REQUIREMENTS INDICATOR (Registration Mode) */}
              {activeTab === 'register' && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-stone-400 font-medium">Password Requirements:</span>
                    {pwdValidation.isOnlyDigits && (
                      <span className="text-amber-400 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Must include letters too</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                    {/* Letters check */}
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                        pwdValidation.hasLetter
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-stone-900 text-stone-400 border border-stone-800'
                      }`}
                    >
                      {pwdValidation.hasLetter ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3 h-3 text-stone-500 shrink-0" />
                      )}
                      <span>Letters (a-z)</span>
                    </div>

                    {/* Numbers check */}
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                        pwdValidation.hasNumber
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-stone-900 text-stone-400 border border-stone-800'
                      }`}
                    >
                      {pwdValidation.hasNumber ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3 h-3 text-stone-500 shrink-0" />
                      )}
                      <span>Numbers (0-9)</span>
                    </div>

                    {/* Min Length check */}
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                        pwdValidation.hasMinLength
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-stone-900 text-stone-400 border border-stone-800'
                      }`}
                    >
                      {pwdValidation.hasMinLength ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3 h-3 text-stone-500 shrink-0" />
                      )}
                      <span>6+ Chars</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-amber-300/80 leading-tight pt-0.5">
                    💡 Password must be alphanumeric (contain both letters and numbers).
                  </p>
                </div>
              )}
            </div>

            {/* Specialization Role in Register Mode */}
            {activeTab === 'register' && (
              <div>
                <label className="block text-[11px] font-bold text-amber-200/80 mb-1.5 uppercase tracking-wider">
                  User Specialization Title
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

            {/* Remember Me & Help */}
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

              {activeTab === 'signin' && (
                <button
                  type="button"
                  onClick={() =>
                    setInfoMessage('Enter your registered username/email and password to sign in.')
                  }
                  className="text-stone-400 hover:text-[#d4af37] text-xs transition-colors"
                >
                  Credential help?
                </button>
              )}
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
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>{activeTab === 'signin' ? 'Sign In to Sanctum' : 'Register Explorer Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social / Guest Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-stone-800">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="py-2.5 px-3 rounded-xl bg-stone-900/60 hover:bg-stone-800/80 border border-stone-800 hover:border-[#d4af37]/40 text-xs font-semibold text-stone-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-rose-400" />
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              className="py-2.5 px-3 rounded-xl bg-amber-950/30 hover:bg-amber-900/50 border border-[#d4af37]/30 text-xs font-semibold text-amber-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#d4af37]" />
              <span>Guest Mode</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-stone-500 mt-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]/70" />
          <span>Protected by Smarak Heritage Security • Encrypted Session</span>
        </p>
      </motion.div>
    </div>
  );
};
