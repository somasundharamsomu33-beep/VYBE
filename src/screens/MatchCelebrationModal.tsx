import React from 'react';
import { Heart, Sparkles, MessageCircle, Compass, Star } from 'lucide-react';
import { Match, Profile } from '../types';
import { AvatarImage } from '../components/common/AvatarImage';

interface MatchCelebrationModalProps {
  currentUser: Profile;
  matchedProfile: Profile;
  match: Match;
  onOpenChat: (match: Match) => void;
  onKeepDiscovering: () => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  currentUser,
  matchedProfile,
  match,
  onOpenChat,
  onKeepDiscovering,
}) => {
  const isSuper = Boolean(match.isSuperLike);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        {/* Floating Heart/Star Monogram */}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 relative ${
            isSuper ? 'bg-amber-400/20 text-amber-400' : 'bg-rose-500/20 text-rose-500'
          }`}
        >
          {isSuper ? (
            <Star size={34} className="fill-amber-400 animate-pulse" />
          ) : (
            <Heart size={34} className="fill-rose-500 animate-pulse" />
          )}
          <Sparkles size={18} className="absolute -top-1 -right-1 text-amber-300 animate-bounce" />
        </div>

        <span
          className={`text-xs font-semibold uppercase tracking-widest font-mono mb-1 ${
            isSuper ? 'text-amber-400' : 'text-rose-400'
          }`}
        >
          {isSuper ? '★ Priority Super Spark' : 'Mutual Spark'}
        </span>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
          {isSuper ? 'Super Connection!' : 'It’s a Soul Connection!'}
        </h2>

        <p className="mt-2 text-xs text-white/80 max-w-xs leading-relaxed font-sans">
          {isSuper ? (
            <>
              You Super Liked <strong className="text-white">{matchedProfile.name}</strong> and your connection stood out instantly!
            </>
          ) : (
            <>
              You and <strong className="text-white">{matchedProfile.name}</strong> both felt drawn to each other.
            </>
          )}
        </p>

        {/* Side-by-Side Avatars */}
        <div className="my-8 flex items-center justify-center relative">
          {/* Current User Photo */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl -mr-4 z-10">
            <AvatarImage
              src={currentUser.photos[0]}
              alt={currentUser.name}
              fallbackName={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Center Emblem */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center z-30 shadow-lg border-2 border-white ${
              isSuper ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-neutral-950' : 'bg-rose-600 text-white'
            }`}
          >
            {isSuper ? (
              <Star size={18} className="fill-neutral-950 stroke-neutral-950" />
            ) : (
              <Heart size={18} className="fill-white" />
            )}
          </div>

          {/* Matched Partner Photo */}
          <div
            className={`w-24 h-24 rounded-full overflow-hidden border-4 shadow-xl -ml-4 z-10 ${
              isSuper ? 'border-amber-300' : 'border-white'
            }`}
          >
            <AvatarImage
              src={matchedProfile.photos[0]}
              alt={matchedProfile.name}
              fallbackName={matchedProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 w-full max-w-xs">
          <button
            onClick={() => onOpenChat(match)}
            className="w-full h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            <span>Send First Note</span>
          </button>

          <button
            onClick={onKeepDiscovering}
            className="w-full h-12 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white font-medium text-xs transition-all border border-white/20 flex items-center justify-center gap-2"
          >
            <Compass size={16} />
            <span>Keep Discovering</span>
          </button>
        </div>
      </div>
    </div>
  );
};
