import React, { useState, useEffect } from 'react';
import {
  X,
  BadgeCheck,
  ShieldCheck,
  Camera,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Scan,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { User } from '../../types';

interface VerificationModalProps {
  currentUser: User;
  onClose: () => void;
  onVerificationComplete: () => void;
  onUnverify?: () => void;
}

type Step = 'intro' | 'capturing' | 'analyzing' | 'success';

export const VerificationModal: React.FC<VerificationModalProps> = ({
  currentUser,
  onClose,
  onVerificationComplete,
  onUnverify,
}) => {
  const [step, setStep] = useState<Step>(currentUser.verified ? 'success' : 'intro');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanInstruction, setScanInstruction] = useState('Center your face in the oval');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'analyzing') {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep('success');
            onVerificationComplete();
            return 100;
          }
          if (prev === 25) setScanInstruction('Turn head slightly to the right');
          if (prev === 55) setScanInstruction('Give a gentle, natural smile');
          if (prev === 85) setScanInstruction('Verifying photo resonance...');
          return prev + 5;
        });
      }, 120);
    }
    return () => clearInterval(interval);
  }, [step, onVerificationComplete]);

  const handleStartScan = () => {
    setStep('capturing');
    setTimeout(() => {
      setStep('analyzing');
      setScanProgress(0);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] border border-neutral-200 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <BadgeCheck size={18} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm text-neutral-900 leading-tight">
                Profile Verification
              </h2>
              <p className="text-[10px] text-neutral-500">Authentic Connections</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {/* STEP 1: INTRO */}
          {step === 'intro' && (
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 p-1 shadow-lg shadow-rose-500/20">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-rose-600">
                  <ShieldCheck size={40} />
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  Verify your identity
                </h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  A verified badge lets potential matches know you are genuinely the person in your photos.
                  Profiles with verified badges receive 3.5× more meaningful conversations on VYBE.
                </p>
              </div>

              {/* What verification does */}
              <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 text-left space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-neutral-700">
                    <strong>15-second liveness check:</strong> Quick selfie poses confirm real presence.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-neutral-700">
                    <strong>Photo match:</strong> We ensure your live selfie matches your uploaded profile gallery.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Lock size={15} className="text-rose-500 shrink-0 mt-0.5" />
                  <span className="text-neutral-700">
                    <strong>Privacy guaranteed:</strong> Verification selfies are never shown on your public profile.
                  </span>
                </div>
              </div>

              {/* Demo Mode Notice */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-900 text-left flex items-start gap-2">
                <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Demo Verification Environment</span>
                  <span>
                    This interactive demo simulates the native iOS TrueDepth liveness verification workflow.
                    No biometric data or photos leave your browser.
                  </span>
                </div>
              </div>

              <button
                onClick={handleStartScan}
                className="w-full h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/20"
              >
                <Camera size={16} />
                <span>Begin Selfie Verification</span>
              </button>
            </div>
          )}

          {/* STEP 2: CAPTURING VIEW */}
          {step === 'capturing' && (
            <div className="text-center py-6 space-y-4">
              <div className="relative w-44 h-56 mx-auto rounded-[36px] bg-neutral-900 overflow-hidden border-4 border-rose-500 flex items-center justify-center shadow-xl">
                <div className="absolute inset-0 bg-neutral-800 flex flex-col items-center justify-center text-white/60 p-4">
                  <Camera size={36} className="animate-pulse mb-2 text-rose-400" />
                  <span className="text-[11px] font-medium">Connecting camera...</span>
                </div>
                <div className="absolute inset-4 rounded-[28px] border-2 border-dashed border-white/40 pointer-events-none" />
              </div>

              <div>
                <h4 className="font-serif font-bold text-base text-neutral-900">
                  Initializing camera
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Hold your phone at eye level in good lighting.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: ANALYZING / SCANNING */}
          {step === 'analyzing' && (
            <div className="text-center py-4 space-y-4">
              <div className="relative w-44 h-56 mx-auto rounded-[36px] bg-neutral-950 overflow-hidden border-4 border-rose-500 flex items-center justify-center shadow-xl">
                {/* Simulated portrait image being scanned */}
                <img
                  src={currentUser.photos[0]}
                  alt="Live Selfie"
                  className="w-full h-full object-cover filter brightness-95 contrast-105"
                />

                {/* Scanning laser beam overlay */}
                <div
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent shadow-[0_0_12px_#f43f5e] transition-all duration-100 ease-linear pointer-events-none"
                  style={{ top: `${scanProgress}%` }}
                />

                {/* Oval face guide */}
                <div className="absolute inset-3 rounded-[30px] border-2 border-rose-400/70 pointer-events-none animate-pulse" />

                {/* Progress badge */}
                <div className="absolute bottom-2.5 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-white text-[10px] font-mono font-semibold">
                  {scanProgress}%
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 rounded-full text-rose-700 text-xs font-semibold mb-1">
                  <RefreshCw size={12} className="animate-spin" />
                  <span>{scanInstruction}</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Matching face landmarks against your profile photos
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-600 transition-all duration-150"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-lg border-2 border-emerald-200">
                <BadgeCheck size={48} className="fill-emerald-100" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-2">
                  <CheckCircle2 size={12} />
                  <span>Selfie Verified</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-neutral-900">
                  You are officially verified!
                </h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed max-w-xs mx-auto">
                  Your blue-and-rose verified badge is now active on your SoulSync profile and visible to all prospective matches.
                </p>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-neutral-200 text-left text-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden shrink-0">
                  <img
                    src={currentUser.photos[0]}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-neutral-900 truncate">
                      {currentUser.name}
                    </span>
                    <BadgeCheck size={16} className="text-rose-600 fill-rose-50 shrink-0" />
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    Trust Badge Active
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={onClose}
                  className="w-full h-12 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  Done
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setStep('intro');
                      setScanProgress(0);
                    }}
                    className="flex-1 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-medium transition-colors"
                  >
                    Retake Scan
                  </button>

                  {onUnverify && (
                    <button
                      onClick={() => {
                        onUnverify();
                        setStep('intro');
                        setScanProgress(0);
                      }}
                      className="flex-1 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-medium transition-colors border border-rose-200"
                    >
                      Demo: Unverify
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
