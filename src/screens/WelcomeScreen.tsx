import React from 'react';
import { Heart, Sparkles, Shield, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onStartSignUp: () => void;
  onStartLogin: () => void;
  onExploreDemo: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartSignUp,
  onStartLogin,
  onExploreDemo,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-b from-[#FAF8F5] via-[#FFF5F6] to-[#FAF8F5] text-neutral-900 overflow-y-auto">
      {/* Top Branding */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-600/25">
            <Heart size={20} className="fill-white" />
          </div>
          <div>
            <span className="font-serif font-bold text-xl tracking-tight text-neutral-900">
              VYBE
            </span>
            <span className="text-xs text-rose-600 font-medium ml-1.5 tracking-wider uppercase">
              SoulSync
            </span>
          </div>
        </div>

        <button
          onClick={onExploreDemo}
          className="text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 border border-rose-200/60"
        >
          <span>Quick Demo</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Hero Visual & Headline */}
      <div className="my-auto py-8 text-center flex flex-col items-center">
        {/* Decorative Ring */}
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-rose-200 via-rose-100 to-pink-50 flex items-center justify-center p-1 shadow-inner">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg shadow-rose-950/5">
              <Sparkles className="w-10 h-10 text-rose-600 animate-pulse" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-neutral-900 text-white p-2 rounded-full shadow-md">
            <Heart size={14} className="fill-rose-500 text-rose-500" />
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 tracking-tight leading-tight max-w-xs text-balance">
          Find a connection that feels like home.
        </h1>

        <p className="mt-3 text-sm text-neutral-600 max-w-xs leading-relaxed font-sans">
          Intentional romance designed for thoughtful people. Slow dating, shared values, and deep resonance.
        </p>

        {/* Prototype trust badge */}
        <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500 bg-white/70 px-3 py-1 rounded-full border border-neutral-200/60 shadow-xs">
          <Shield size={12} className="text-rose-600" />
          <span>iOS Demo Prototype · Verified Profiles</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 w-full max-w-sm mx-auto">
        <button
          onClick={onStartSignUp}
          className="w-full h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
        >
          <span>Create an Account</span>
        </button>

        <button
          onClick={onStartLogin}
          className="w-full h-12 rounded-2xl bg-white hover:bg-neutral-50 active:scale-[0.98] text-neutral-900 font-medium text-sm transition-all border border-neutral-200 shadow-xs flex items-center justify-center"
        >
          <span>Sign In</span>
        </button>

        {/* Legal links */}
        <div className="pt-3 text-center text-[11px] text-neutral-500 leading-relaxed">
          <span>By continuing, you agree to our </span>
          <button
            onClick={onOpenTerms}
            className="text-neutral-800 underline underline-offset-2 hover:text-rose-600 font-medium"
          >
            Terms of Service
          </button>
          <span> and </span>
          <button
            onClick={onOpenPrivacy}
            className="text-neutral-800 underline underline-offset-2 hover:text-rose-600 font-medium"
          >
            Privacy Policy
          </button>
          .
        </div>
      </div>
    </div>
  );
};
