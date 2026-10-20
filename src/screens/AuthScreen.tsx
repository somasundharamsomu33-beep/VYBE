import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, Lock, AlertCircle, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { AuthService } from '../services/authService';

interface AuthScreenProps {
  initialMode?: 'login' | 'signup';
  onSuccess: (isNewUser: boolean) => void;
  onBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'login',
  onSuccess,
  onBack,
}) => {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const authService = AuthService.getInstance();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await authService.signUpWithEmail(email);
        setIsLoading(false);
        onSuccess(true);
      } else {
        await authService.loginWithEmail(email, password);
        setIsLoading(false);
        onSuccess(false);
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Unable to connect. Please try again.');
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 7) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.loginWithPhone(countryCode, phone);
      setIsLoading(false);
      onSuccess(isSignUp);
    } catch {
      setIsLoading(false);
      setErrorMessage('Unable to send code. Please try again.');
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await authService.loginWithGoogle();
      setIsLoading(false);
      onSuccess(false);
    } catch {
      setIsLoading(false);
      setErrorMessage('Google authentication could not be completed.');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#FAF8F5] text-neutral-900 overflow-y-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="w-10 h-10 -ml-2 rounded-full hover:bg-neutral-200/60 active:scale-95 flex items-center justify-center text-neutral-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-xs font-semibold text-rose-600 tracking-wider uppercase font-serif">
            SoulSync
          </span>
          <div className="w-10" />
        </div>

        {/* Demo-only banner */}
        <div className="mb-6 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Interactive Prototype:</span> Any email, phone, or Google tap will authenticate in local demo mode. No external servers receive credentials.
          </div>
        </div>

        <h2 className="font-serif text-2xl font-semibold tracking-tight text-neutral-900">
          {isSignUp ? 'Begin your journey' : 'Welcome back'}
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          {isSignUp
            ? 'Create your romantic profile and meet intentional partners.'
            : 'Continue where your conversations left off.'}
        </p>

        {/* Method Switcher */}
        <div className="mt-5 grid grid-cols-2 p-1 bg-neutral-200/70 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'email'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Mail size={14} />
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'phone'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Phone size={14} />
            <span>Phone</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        {authMethod === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="mt-5 space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full h-11 px-3.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <span>{isSignUp ? 'Continue to Profile Creation' : 'Sign In'}</span>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePhoneSubmit} className="mt-5 space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="h-11 px-2 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-rose-500"
                >
                  <option value="+1">🇺🇸 +1 (US/CA)</option>
                  <option value="+44">🇬🇧 +44 (UK)</option>
                  <option value="+33">🇫🇷 +33 (FR)</option>
                  <option value="+49">🇩🇪 +49 (DE)</option>
                  <option value="+81">🇯🇵 +81 (JP)</option>
                  <option value="+61">🇦🇺 +61 (AU)</option>
                  <option value="+91">🇮🇳 +91 (IN)</option>
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="flex-1 h-11 px-3.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <span>Send Verification Code</span>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-[11px] text-neutral-400 uppercase">
            <span className="bg-[#FAF8F5] px-3 font-semibold">Or continue with</span>
          </div>
        </div>

        {/* Google Auth Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full h-11 rounded-xl bg-white hover:bg-neutral-50 active:scale-[0.98] border border-neutral-300 text-neutral-800 text-sm font-medium transition-all flex items-center justify-center gap-2.5 shadow-xs"
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
      </div>

      {/* Switch between sign-up and login */}
      <div className="pt-4 text-center text-xs text-neutral-600">
        <span>{isSignUp ? 'Already have an account?' : 'New to SoulSync?'} </span>
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setErrorMessage(null);
          }}
          className="text-rose-600 font-semibold hover:underline"
        >
          {isSignUp ? 'Sign In' : 'Create an Account'}
        </button>
      </div>
    </div>
  );
};
