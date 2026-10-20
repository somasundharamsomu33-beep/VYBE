import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  RefreshCw,
  Send,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  Check,
} from 'lucide-react';
import { Profile } from '../../types';
import {
  AIWingmateService,
  WingmateSuggestion,
} from '../../services/aiWingmateService';

interface AIWingmateDrawerProps {
  currentUser: Profile;
  partner: Profile;
  onClose: () => void;
  onSelectStarter: (starter: string, autoSend?: boolean) => void;
}

export const AIWingmateDrawer: React.FC<AIWingmateDrawerProps> = ({
  currentUser,
  partner,
  onClose,
  onSelectStarter,
}) => {
  const [suggestions, setSuggestions] = useState<WingmateSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    const results = await AIWingmateService.getInstance().generateStarters(
      currentUser,
      partner
    );
    setSuggestions(results);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSuggestions();
  }, [partner.id]);

  const getCategoryLabel = (category: WingmateSuggestion['category']) => {
    switch (category) {
      case 'shared_interest':
        return 'Mutual Passion';
      case 'prompt_hook':
        return 'Profile Prompt';
      case 'romantic_curiosity':
        return 'Intentional Goal';
      case 'playful_vibe':
        return 'Date Vision';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center p-0 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-sm rounded-t-[32px] border-t border-neutral-200 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-neutral-900 leading-tight">
                AI Wingmate
              </h3>
              <p className="text-[10px] text-neutral-500">
                Thoughtful conversation starters for {partner.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={fetchSuggestions}
              disabled={isLoading}
              className="w-8 h-8 rounded-full hover:bg-neutral-100 text-neutral-500 flex items-center justify-center transition-colors disabled:opacity-50"
              title="Regenerate suggestions"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* List of Suggestions */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-3">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
              <p className="text-xs text-neutral-500 font-medium">
                Analyzing shared passions & prompt resonance...
              </p>
            </div>
          ) : (
            suggestions.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white rounded-2xl border border-neutral-200/80 shadow-xs space-y-2.5 transition-all hover:border-rose-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                    {getCategoryLabel(item.category)}
                  </span>
                  <span className="text-[10px] text-neutral-400">Contextual Hook</span>
                </div>

                <p className="text-xs text-neutral-800 leading-relaxed font-sans font-medium">
                  &ldquo;{item.starter}&rdquo;
                </p>

                <p className="text-[10px] text-neutral-500 italic bg-neutral-50 p-2 rounded-xl">
                  💡 {item.rationale}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      onSelectStarter(item.starter, false);
                      onClose();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare size={12} />
                    <span>Insert into message</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectStarter(item.starter, true);
                      onClose();
                    }}
                    className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors shadow-xs"
                  >
                    <Send size={12} />
                    <span>Send now</span>
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Privacy & Architecture Note */}
          <div className="p-3 bg-neutral-100/80 rounded-xl text-[10px] text-neutral-500 leading-relaxed">
            <strong>Architecture Notice:</strong> AI Wingmate runs locally via service interfaces without needing an API key. In production builds, this uses on-device LLMs to guarantee message privacy.
          </div>
        </div>
      </div>
    </div>
  );
};
