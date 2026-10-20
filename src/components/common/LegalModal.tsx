import React from 'react';
import { X, ShieldCheck, HeartHandshake, EyeOff, Lock } from 'lucide-react';

interface LegalModalProps {
  type: 'terms' | 'privacy';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-neutral-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              {type === 'terms' ? <HeartHandshake size={18} /> : <ShieldCheck size={18} />}
            </div>
            <div>
              <h3 className="font-serif font-semibold text-lg text-neutral-900 leading-tight">
                {type === 'terms' ? 'Terms of Service' : 'Privacy & Safety Policy'}
              </h3>
              <p className="text-xs text-neutral-500">VYBE · SoulSync Dating</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200/60 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-sm text-neutral-700 leading-relaxed space-y-4 font-sans">
          {type === 'terms' ? (
            <>
              <div>
                <h4 className="font-semibold text-neutral-900 mb-1 text-sm">1. Age Requirement & Eligibility</h4>
                <p>
                  You must be at least 18 years of age to create an account on SoulSync. By creating an account,
                  you verify that you have never been convicted of a felony or sexual offense and agree to maintain honest,
                  respectful interactions.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-1 text-sm">2. Community Kindness Standard</h4>
                <p>
                  SoulSync is built for romantic sincerity. Harassment, hateful speech, non-consensual sharing of media,
                  and deceptive profiling are strictly prohibited. Violators are permanently banned without recourse.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-1 text-sm">3. Privacy-First Location Usage</h4>
                <p>
                  We never share your exact GPS coordinates with other users. Distances are rounded to approximate
                  neighborhoods to protect your personal safety and routine.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-1 text-sm">4. Prototype Notice</h4>
                <p>
                  This web app is an interactive concept prototype. User authentication and messaging operate locally
                  until native iOS deployment.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 p-3 bg-rose-50/70 rounded-xl border border-rose-100">
                <Lock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-950">
                  Your romantic preferences and chat messages are treated as strictly confidential personal data.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-1 text-sm">Data Minimization</h4>
                <p>
                  We collect only the information necessary to suggest compatible romantic partners: first name, age,
                  approximate location, orientation, photos, and answers to personality prompts.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-1 text-sm">Location Privacy</h4>
                <p>
                  Location data is never stored with pinpoint precision. Other members only see approximate distance
                  (e.g., &ldquo;3 miles away&rdquo;) and neighborhood names.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 mb-1 text-sm">Account Deletion & Data Rights</h4>
                <p>
                  You maintain full rights to delete your profile at any time. Account deletion immediately purges all
                  photos, matches, and chat history.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200/80 bg-neutral-50/50 flex justify-end rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
