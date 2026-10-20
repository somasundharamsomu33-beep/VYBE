import React, { useState } from 'react';
import { Search, Flame, MessageCircle, Sparkles, ChevronRight, Heart } from 'lucide-react';
import { Match } from '../types';
import { MatchService } from '../services/matchService';
import { AvatarImage } from '../components/common/AvatarImage';

interface MatchesScreenProps {
  onSelectMatch: (match: Match) => void;
  onNavigateToDiscover: () => void;
}

export const MatchesScreen: React.FC<MatchesScreenProps> = ({
  onSelectMatch,
  onNavigateToDiscover,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const matchService = MatchService.getInstance();
  const matches = matchService.getMatches();

  const filteredMatches = matches.filter((m) =>
    m.matchedProfile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#FAF8F5] text-neutral-900 overflow-hidden">
      {/* Top Header */}
      <div className="p-4 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <h1 className="font-serif font-bold text-2xl tracking-tight text-neutral-900">
              Matches
            </h1>
            <span className="text-xs bg-rose-100 text-rose-700 font-semibold px-2 py-0.5 rounded-full">
              {matches.length}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium">
            <Sparkles size={12} className="text-amber-500" />
            <span>Mutual Connections</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or interest..."
            className="w-full h-10 pl-9 pr-3.5 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-rose-500 transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5 no-scrollbar">
        {matches.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 my-12">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4">
              <Flame size={32} />
            </div>
            <h3 className="font-serif text-xl font-bold text-neutral-900">
              No matches yet
            </h3>
            <p className="text-xs text-neutral-500 mt-2 max-w-xs leading-relaxed">
              When someone you like also likes your profile, your mutual connection will appear here.
            </p>
            <button
              onClick={onNavigateToDiscover}
              className="mt-6 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <Heart size={14} className="fill-white" />
              <span>Explore Discover</span>
            </button>
          </div>
        ) : (
          <>
            {/* New Matches Carousel */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider font-mono">
                  New Connections
                </span>
                <span className="text-[10px] text-rose-600 font-medium">
                  {matches.length} active
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {matches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => onSelectMatch(match)}
                    className="flex flex-col items-center shrink-0 w-18 group text-left focus:outline-none"
                  >
                    <div className={`w-16 h-16 rounded-2xl overflow-hidden p-0.5 border-2 ${
                      match.isSuperLike ? 'border-amber-400 shadow-amber-300/30' : 'border-rose-500/80 group-hover:border-rose-600'
                    } transition-all shadow-sm relative`}>
                      <AvatarImage
                        src={match.matchedProfile.photos[0]}
                        alt={match.matchedProfile.name}
                        fallbackName={match.matchedProfile.name}
                        className="w-full h-full rounded-[13px] object-cover"
                      />
                      {match.unreadCount > 0 && (
                        <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-600 border border-white" />
                      )}
                      {match.isSuperLike && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center border-2 border-white shadow-xs">
                          <span className="text-[10px] font-bold">★</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-neutral-800 mt-1.5 truncate max-w-[68px] text-center">
                      {match.matchedProfile.name}
                    </span>
                    <span className="text-[10px] text-neutral-600 truncate max-w-[68px] text-center">
                      {match.matchedProfile.age} yrs
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversations List */}
            <div>
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2.5 block font-mono">
                Conversations
              </span>

              <div className="space-y-2">
                {filteredMatches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => onSelectMatch(match)}
                    className="w-full p-3 rounded-2xl bg-white hover:bg-rose-50/40 active:scale-[0.99] border border-neutral-200/80 transition-all flex items-center gap-3.5 text-left shadow-xs group"
                  >
                    {/* Partner Avatar */}
                    <div className="w-13 h-13 rounded-2xl overflow-hidden shrink-0 relative">
                      <AvatarImage
                        src={match.matchedProfile.photos[0]}
                        alt={match.matchedProfile.name}
                        fallbackName={match.matchedProfile.name}
                        className="w-full h-full object-cover"
                      />
                      {match.unreadCount > 0 && (
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-rose-600 border-2 border-white" />
                      )}
                      {match.isSuperLike && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center border-2 border-white shadow-xs">
                          <span className="text-[10px] font-bold">★</span>
                        </div>
                      )}
                    </div>

                    {/* Chat Snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-rose-600 transition-colors truncate">
                            {match.matchedProfile.name}
                          </h4>
                          {match.isSuperLike && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 shrink-0">
                              ★ SUPER LIKE
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-600 font-mono shrink-0">
                          {match.lastMessageTimestamp || 'Recent'}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-600 truncate leading-relaxed">
                        {match.lastMessage || 'Say hello to spark your connection...'}
                      </p>
                    </div>

                    <ChevronRight size={16} className="text-neutral-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
