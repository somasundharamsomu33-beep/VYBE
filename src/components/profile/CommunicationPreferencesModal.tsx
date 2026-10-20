import React, { useState } from 'react';
import { X, MessageSquare, Phone, Clock, ShieldCheck, Check } from 'lucide-react';
import { CommunicationPreferences } from '../../types';

interface CommunicationPreferencesModalProps {
  initialPreferences?: CommunicationPreferences;
  onClose: () => void;
  onSave: (prefs: CommunicationPreferences) => void;
}

export const CommunicationPreferencesModal: React.FC<CommunicationPreferencesModalProps> = ({
  initialPreferences,
  onClose,
  onSave,
}) => {
  const [textingRhythm, setTextingRhythm] = useState<CommunicationPreferences['textingRhythm']>(
    initialPreferences?.textingRhythm || 'Thoughtful batch responder'
  );
  const [callingPreference, setCallingPreference] = useState<CommunicationPreferences['callingPreference']>(
    initialPreferences?.callingPreference || 'Prefers audio notes'
  );
  const [datingPace, setDatingPace] = useState<CommunicationPreferences['datingPace']>(
    initialPreferences?.datingPace || 'Slow & intentional'
  );
  const [boundarySnippet, setBoundarySnippet] = useState(
    initialPreferences?.boundarySnippet || 'I appreciate mindful evening check-ins over nonstop daytime texting.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      textingRhythm,
      callingPreference,
      datingPace,
      boundarySnippet,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] border border-neutral-200 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm text-neutral-900 leading-tight">
                Communication Rhythm
              </h2>
              <p className="text-[10px] text-neutral-500">How you like to connect</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {/* Texting rhythm */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-600 flex items-center gap-1.5 mb-2 font-mono uppercase">
              <MessageSquare size={13} className="text-rose-600" />
              <span>Texting Rhythm</span>
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(
                [
                  'Quick responder',
                  'Thoughtful batch responder',
                  'Slow texter',
                  'Evenings only',
                ] as const
              ).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTextingRhythm(option)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                    textingRhythm === option
                      ? 'bg-rose-50 border-rose-500 text-rose-900 shadow-xs'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Calling preference */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-600 flex items-center gap-1.5 mb-2 font-mono uppercase">
              <Phone size={13} className="text-emerald-600" />
              <span>Audio & Phone Calls</span>
            </label>
            <div className="space-y-1.5 text-xs">
              {(
                [
                  'Prefers audio notes',
                  'Loves phone calls',
                  'Prefers in-person first',
                ] as const
              ).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCallingPreference(option)}
                  className={`w-full p-2.5 rounded-xl border text-left font-medium transition-all flex items-center justify-between ${
                    callingPreference === option
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span>{option}</span>
                  {callingPreference === option && <Check size={14} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Dating pace */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-600 flex items-center gap-1.5 mb-2 font-mono uppercase">
              <Clock size={13} className="text-amber-600" />
              <span>Preferred Dating Pace</span>
            </label>
            <div className="space-y-1.5 text-xs">
              {(
                [
                  'Slow & intentional',
                  'Meet within a week',
                  'Get to know over chat first',
                ] as const
              ).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDatingPace(option)}
                  className={`w-full p-2.5 rounded-xl border text-left font-medium transition-all flex items-center justify-between ${
                    datingPace === option
                      ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span>{option}</span>
                  {datingPace === option && <Check size={14} className="text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Personal boundary */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-600 flex items-center gap-1.5 mb-1.5 font-mono uppercase">
              <ShieldCheck size={13} className="text-rose-600" />
              <span>Personal Dating Boundary</span>
            </label>
            <textarea
              rows={2}
              value={boundarySnippet}
              onChange={(e) => setBoundarySnippet(e.target.value)}
              placeholder="e.g. Prefer phone calls after 6 PM, or meet in public open spaces for coffee."
              className="w-full p-3 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-rose-500 resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Check size={16} />
            <span>Save Preferences</span>
          </button>
        </form>
      </div>
    </div>
  );
};
