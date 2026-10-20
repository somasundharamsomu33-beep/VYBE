import React from 'react';
import { Check, Sparkles, X, Compass, Heart } from 'lucide-react';
import { DateMood, DATE_MOOD_OPTIONS } from '../../types';

export interface DateMoodSelectorProps {
  selectedMood?: DateMood | null;
  onSelectMood: (mood: DateMood) => void;
  onClearMood?: () => void;
  isModal?: boolean;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
}

export const DateMoodSelector: React.FC<DateMoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
  onClearMood,
  isModal = false,
  onClose,
  title = 'What’s your current Date Mood?',
  subtitle = 'Pick the energy you’re bringing to dates right now. You can change this anytime as your mood shifts.',
}) => {
  const content = (
    <div className="flex flex-col h-full">
      {/* Header if modal */}
      {isModal && (
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-neutral-900 leading-tight">
                {title}
              </h3>
              <p className="text-[11px] text-neutral-500">
                Shared with potential matches on your profile
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Intro text */}
      <div className={`px-5 ${isModal ? 'pt-4 pb-2' : 'pb-3'}`}>
        {!isModal && (
          <div className="mb-2">
            <h4 className="text-xs font-semibold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Date Mood</span>
              <span className="text-[10px] text-rose-600 font-mono font-normal">
                (Current dating intent)
              </span>
            </h4>
            <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>
          </div>
        )}

        {/* Selected Mood Highlight Preview */}
        {selectedMood && (
          <div className="p-3 mb-3 rounded-2xl bg-gradient-to-r from-rose-50 via-rose-100/60 to-rose-50 border border-rose-200/90 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-2xl select-none" role="img" aria-label={selectedMood.label}>
                {selectedMood.emoji}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-neutral-900 truncate">
                    {selectedMood.label}
                  </span>
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-rose-600 text-white">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 truncate">{selectedMood.tagline}</p>
              </div>
            </div>

            {onClearMood && (
              <button
                type="button"
                onClick={onClearMood}
                className="text-[10px] text-neutral-500 hover:text-rose-600 font-medium px-2 py-1 rounded-md hover:bg-white/60 ml-2 shrink-0 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mood Options Grid */}
      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2 no-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DATE_MOOD_OPTIONS.map((mood) => {
            const isSelected = selectedMood?.id === mood.id;

            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => {
                  onSelectMood(mood);
                  if (isModal && onClose) {
                    // Small delay for smooth feel or let user close
                  }
                }}
                className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 active:scale-[0.99] relative ${
                  isSelected
                    ? 'bg-rose-50/90 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                    : 'bg-white hover:bg-neutral-50/80 border-neutral-200/90 hover:border-neutral-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-2xs select-none ${
                    isSelected ? 'bg-white ring-1 ring-rose-300' : 'bg-neutral-100/80'
                  }`}
                >
                  {mood.emoji}
                </div>

                <div className="flex-1 min-w-0 pr-5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-rose-950' : 'text-neutral-900'
                      }`}
                    >
                      {mood.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5 leading-snug">
                    {mood.tagline}
                  </p>
                </div>

                {/* Checkmark badge */}
                <div
                  className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-rose-600 text-white'
                      : 'border border-neutral-300 text-transparent'
                  }`}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer if modal */}
      {isModal && onClose && (
        <div className="p-4 border-t border-neutral-200 bg-neutral-50/70 flex items-center justify-between rounded-b-3xl">
          <div className="text-[11px] text-neutral-500 flex items-center gap-1">
            <Heart size={12} className="text-rose-500 fill-rose-500" />
            <span>Updates across your discovery card & profile view</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-lg max-h-[88vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
