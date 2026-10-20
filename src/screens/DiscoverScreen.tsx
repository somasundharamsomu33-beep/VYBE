import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Heart,
  Star,
  Sparkles,
  RotateCcw,
  Compass,
  Undo2,
  Check,
  History,
  Clock,
} from 'lucide-react';
import { Profile, Match } from '../types';
import { MatchService, DAILY_SWIPE_LIMIT, HistoryAction, MAX_SWIPE_HISTORY } from '../services/matchService';
import { SwipeableProfileCard } from '../components/common/SwipeableProfileCard';
import { AvatarImage } from '../components/common/AvatarImage';
import { haptics } from '../utils/haptics';

interface DiscoverScreenProps {
  onOpenProfileDetail: (profile: Profile) => void;
  onMutualMatch: (matchedProfile: Profile, match: Match) => void;
  onNavigateToMatches: () => void;
  currentUser?: Profile;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  onOpenProfileDetail,
  onMutualMatch,
  onNavigateToMatches,
  currentUser,
}) => {
  const matchService = MatchService.getInstance();
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(
    matchService.getCurrentProfile()
  );
  const [nextProfile, setNextProfile] = useState<Profile | null>(
    matchService.getNextProfile()
  );
  const [dailyStatus, setDailyStatus] = useState(matchService.getDailyLimitStatus());
  const [superLikeStatus, setSuperLikeStatus] = useState(matchService.getSuperLikeStatus());
  const [isSuperLikedActive, setIsSuperLikedActive] = useState(false);
  const [superLikeLimitModal, setSuperLikeLimitModal] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'up'>('right');

  const [goalFilter, setGoalFilter] = useState<import('../types').RelationshipGoal | 'All'>(
    matchService.getGoalFilter()
  );
  const [verifiedFilter, setVerifiedFilter] = useState(matchService.getVerifiedFilter());

  const userGoal = currentUser?.relationshipGoal;
  const isAlignedFilterActive = userGoal && goalFilter === userGoal;

  const handleGoalFilterChange = (goal: import('../types').RelationshipGoal | 'All') => {
    haptics.tap();
    matchService.setGoalFilter(goal);
    setGoalFilter(goal);
    setCurrentProfile(matchService.getCurrentProfile());
    setNextProfile(matchService.getNextProfile());
  };

  const handleToggleAlignedGoal = () => {
    haptics.selection();
    if (!userGoal) return;
    if (isAlignedFilterActive) {
      handleGoalFilterChange('All');
    } else {
      handleGoalFilterChange(userGoal);
    }
  };

  const handleVerifiedToggle = () => {
    haptics.tap();
    const nextVal = !verifiedFilter;
    matchService.setVerifiedFilter(nextVal);
    setVerifiedFilter(nextVal);
    setCurrentProfile(matchService.getCurrentProfile());
    setNextProfile(matchService.getNextProfile());
  };
  const [swipeHistory, setSwipeHistory] = useState<HistoryAction[]>(
    matchService.getActionHistory()
  );
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Undo notification state
  const [undoBanner, setUndoBanner] = useState<{
    profile: Profile;
    type: 'pass' | 'like' | 'superlike';
  } | null>(null);
  const [undoSuccessToast, setUndoSuccessToast] = useState<string | null>(null);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
    };
  }, []);

  const triggerUndoBanner = (profile: Profile, type: 'pass' | 'like' | 'superlike') => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }
    setUndoBanner({ profile, type });

    // Auto dismiss after 5.5 seconds
    undoTimeoutRef.current = setTimeout(() => {
      setUndoBanner(null);
    }, 5500);
  };

  const handleSuperLikeAction = () => {
    if (!currentProfile || isSuperLikedActive) return;

    if (superLikeStatus.remaining <= 0) {
      setSuperLikeLimitModal(true);
      return;
    }

    haptics.superLike();
    setIsSuperLikedActive(true);

    // Give user 450ms of the radiant golden aura celebration on card before launching upwards
    setTimeout(() => {
      executeSwipe('up');
      setIsSuperLikedActive(false);
      setSuperLikeStatus(matchService.getSuperLikeStatus());
    }, 450);
  };

  const executeSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!currentProfile) return;
    const profileBeforeSwipe = currentProfile;
    setExitDirection(direction);

    if (direction === 'left') {
      const res = matchService.passCurrent();
      setCurrentProfile(res.nextProfile);
      setNextProfile(matchService.getNextProfile());
      setDailyStatus(matchService.getDailyLimitStatus());
      setSwipeHistory(matchService.getActionHistory());
      triggerUndoBanner(profileBeforeSwipe, 'pass');
    } else {
      const isSuperLike = direction === 'up';

      // Check if super like limit is exceeded when swiped via gesture
      if (isSuperLike && superLikeStatus.remaining <= 0) {
        setSuperLikeLimitModal(true);
        return;
      }

      const res = matchService.likeCurrent(isSuperLike);
      setDailyStatus(matchService.getDailyLimitStatus());
      setSuperLikeStatus(matchService.getSuperLikeStatus());

      if (res.isMatch && res.matchedProfile && res.match) {
        onMutualMatch(res.matchedProfile, res.match);
      }

      setCurrentProfile(res.nextProfile);
      setNextProfile(matchService.getNextProfile());
      setSwipeHistory(matchService.getActionHistory());
      triggerUndoBanner(profileBeforeSwipe, isSuperLike ? 'superlike' : 'like');
    }
  };

  const handleUndo = () => {
    if (!matchService.canUndo()) return;
    haptics.undo();

    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }
    setUndoBanner(null);

    const res = matchService.undoLastAction();
    if (res.success && res.restoredProfile) {
      // Set exit direction so next entry feels natural
      setExitDirection(res.undoneAction?.type === 'pass' ? 'left' : 'right');
      setCurrentProfile(res.restoredProfile);
      setNextProfile(matchService.getNextProfile());
      setDailyStatus(matchService.getDailyLimitStatus());
      setSuperLikeStatus(matchService.getSuperLikeStatus());
      setSwipeHistory(matchService.getActionHistory());

      // Show brief confirmation
      setUndoSuccessToast(`Restored ${res.restoredProfile.name}`);
      setTimeout(() => setUndoSuccessToast(null), 2200);
    }
  };

  const handleResetQueue = () => {
    matchService.resetDiscoveryQueue();
    setCurrentProfile(matchService.getCurrentProfile());
    setNextProfile(matchService.getNextProfile());
    setSwipeHistory(matchService.getActionHistory());
    setSuperLikeStatus(matchService.getSuperLikeStatus());
    setUndoBanner(null);
  };

  const canUndo = matchService.canUndo();

  return (
    <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 bg-[#FAF8F5] overflow-hidden select-none relative">
      {/* Top Header inside Discover */}
      <div className="flex items-center justify-between px-2 pt-1 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-serif font-bold text-xl text-neutral-900 tracking-tight">
            VYBE
          </span>
          <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            Discover
          </span>
        </div>

        {/* Action Controls in Top Bar: History Drawer Toggle & Daily Meter */}
        <div className="flex items-center gap-2">
          {/* History Pill Toggle */}
          <button
            onClick={() => setShowHistoryModal(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[11px] font-medium transition-all ${
              swipeHistory.length > 0
                ? 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200 shadow-xs'
                : 'bg-white/50 text-neutral-400 border-neutral-200/60'
            }`}
            title="View recent swipe history"
          >
            <History size={12} className={swipeHistory.length > 0 ? 'text-rose-600' : 'text-neutral-400'} />
            <span>History</span>
            {swipeHistory.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold flex items-center justify-center">
                {swipeHistory.length}
              </span>
            )}
          </button>

          {/* Daily Discovery Meter */}
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-200 shadow-xs">
            <Sparkles size={12} className="text-amber-500" />
            <span className="text-[11px] font-medium text-neutral-600">
              <strong className="text-neutral-900">{dailyStatus.remainingSwipes}</strong> of{' '}
              {DAILY_SWIPE_LIMIT} left
            </span>
          </div>
        </div>
      </div>

      {/* Relationship Intentions & Verified Filters */}
      <div className="flex flex-col gap-1.5 shrink-0 px-1 pb-1">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {/* Quick Aligned Intentions Filter Toggle */}
          {userGoal && (
            <button
              onClick={handleToggleAlignedGoal}
              className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 shadow-2xs ${
                isAlignedFilterActive
                  ? 'bg-rose-600 text-white shadow-xs ring-1 ring-rose-500'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
              title={`Toggle filter for matches seeking ${userGoal}`}
            >
              <Sparkles size={11} className={isAlignedFilterActive ? 'text-amber-200' : 'text-rose-500'} />
              <span>✨ Aligned With Me</span>
              {isAlignedFilterActive && <Check size={11} strokeWidth={3} />}
            </button>
          )}

          {(
            [
              'All',
              'Long-term partner',
              'Casual',
              'Life partner',
              'Marriage',
              'Open to exploring',
              'New friends',
            ] as const
          ).map((goal) => {
            const isSelected = goalFilter === goal;
            return (
              <button
                key={goal}
                onClick={() => handleGoalFilterChange(goal)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50'
                }`}
              >
                {goal === 'All' ? 'All Intentions' : goal}
              </button>
            );
          })}

          <button
            onClick={handleVerifiedToggle}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all shrink-0 flex items-center gap-1 ${
              verifiedFilter
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-50'
            }`}
          >
            <span>✓ Verified Only</span>
          </button>
        </div>

        {/* Filter Feedback Indicator Bar */}
        {(goalFilter !== 'All' || verifiedFilter) && (
          <div className="flex items-center justify-between px-3 py-1 rounded-xl bg-rose-50/90 border border-rose-100 text-[11px] text-rose-950">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span className="truncate">
                Seeking:{' '}
                <strong>{goalFilter === 'All' ? 'All Intentions' : goalFilter}</strong>
                {verifiedFilter && ' · Verified Only'}
              </span>
              {isAlignedFilterActive && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-200 text-rose-800 shrink-0">
                  ✨ Aligned
                </span>
              )}
            </div>
            <button
              onClick={() => {
                handleGoalFilterChange('All');
                if (verifiedFilter) handleVerifiedToggle();
              }}
              className="text-rose-700 hover:text-rose-900 font-semibold text-[10px] underline ml-2 shrink-0 cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Main Card Stage Area with Gesture Stack */}
      <div className="flex-1 relative flex items-center justify-center my-1 min-h-0">
        <div className="relative w-full h-full max-w-sm">
          {/* Background Card Preview (renders behind when another profile is queued) */}
          {nextProfile && currentProfile && (
            <SwipeableProfileCard
              key={nextProfile.id}
              profile={nextProfile}
              onSwipe={() => {}}
              onTap={() => {}}
              isFrontCard={false}
              userGoal={userGoal}
            />
          )}

          {/* Active Foreground Card with framer-motion Gestures */}
          <AnimatePresence custom={exitDirection}>
            {currentProfile ? (
              <SwipeableProfileCard
                key={currentProfile.id}
                profile={currentProfile}
                onSwipe={executeSwipe}
                onTap={() => onOpenProfileDetail(currentProfile)}
                isFrontCard={true}
                exitDirection={exitDirection}
                onSuperLike={handleSuperLikeAction}
                superLikesRemaining={superLikeStatus.remaining}
                isSuperLikedActive={isSuperLikedActive}
                userGoal={userGoal}
              />
            ) : (
              /* Empty / No More Profiles State */
              <motion.div
                key="empty_state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full bg-white rounded-[34px] p-6 flex flex-col items-center justify-center text-center border border-neutral-200/80 shadow-md"
              >
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mb-4">
                  <Compass size={32} />
                </div>

                <h3 className="font-serif text-xl font-bold text-neutral-900">
                  {goalFilter !== 'All'
                    ? `No more profiles seeking "${goalFilter}"`
                    : "You've met all nearby souls"}
                </h3>

                <p className="text-xs text-neutral-500 mt-2 max-w-xs leading-relaxed">
                  {goalFilter !== 'All'
                    ? `You've reviewed all available recommendations for ${goalFilter.toLowerCase()}. Clear your filter to discover other members nearby.`
                    : "You've reviewed today's recommendations. More thoughtful matches appear as new members join in your area."}
                </p>

                <div className="mt-6 flex flex-col gap-2.5 w-full max-w-xs">
                  {(goalFilter !== 'All' || verifiedFilter) && (
                    <button
                      onClick={() => {
                        handleGoalFilterChange('All');
                        if (verifiedFilter) handleVerifiedToggle();
                      }}
                      className="w-full h-11 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <Sparkles size={14} className="text-amber-400" />
                      <span>Clear Filter & See All Intentions</span>
                    </button>
                  )}

                  {canUndo && (
                    <button
                      onClick={handleUndo}
                      className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <RotateCcw size={14} />
                      <span>Undo Last Swipe ({swipeHistory.length} left)</span>
                    </button>
                  )}

                  <button
                    onClick={handleResetQueue}
                    className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <RotateCcw size={14} />
                    <span>Revisit Profiles</span>
                  </button>

                  <button
                    onClick={onNavigateToMatches}
                    className="w-full h-11 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Heart size={14} className="text-rose-600" />
                    <span>View Your Matches</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FLOATING UNDO ACTION TOAST (Appears briefly after a swipe gesture) */}
          <AnimatePresence>
            {undoBanner && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-xs bg-neutral-900/95 text-white backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-neutral-700/80 flex items-center justify-between pointer-events-auto"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
                    <Undo2 size={13} />
                  </div>
                  <div className="text-[11px] leading-tight truncate">
                    <span className="text-neutral-400">
                      {undoBanner.type === 'pass'
                        ? 'Passed on '
                        : undoBanner.type === 'superlike'
                        ? 'Super liked '
                        : 'Liked '}
                    </span>
                    <strong className="text-white font-semibold">
                      {undoBanner.profile.name}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleUndo}
                    className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all active:scale-95 flex items-center gap-1 shadow-xs"
                  >
                    <Undo2 size={12} />
                    <span>Undo</span>
                  </button>
                  <button
                    onClick={() => setUndoBanner(null)}
                    className="w-5 h-5 rounded-full text-neutral-400 hover:text-white flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* UNDO CONFIRMATION SUCCESS TOAST */}
          <AnimatePresence>
            {undoSuccessToast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-emerald-600 text-white text-[11px] font-medium px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 pointer-events-none"
              >
                <Check size={12} className="stroke-[2.5]" />
                <span>{undoSuccessToast}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="shrink-0 flex items-center justify-center gap-4 pt-2 pb-1">
        {/* Rewind / Undo Button with History Depth Counter */}
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          aria-label="Undo last swipe"
          className={`relative w-11 h-11 rounded-full border shadow-md flex items-center justify-center transition-all ${
            canUndo
              ? 'bg-amber-50 text-amber-600 border-amber-300 shadow-amber-500/10 active:scale-90 hover:bg-amber-100'
              : 'bg-white/60 text-neutral-300 border-neutral-200/60 opacity-40 cursor-not-allowed'
          }`}
          title={canUndo ? `Undo last swipe (${swipeHistory.length} available in history)` : 'No previous swipe to undo'}
        >
          <RotateCcw size={17} className="stroke-[2.4]" />
          {canUndo && swipeHistory.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-neutral-950 text-[9px] font-bold flex items-center justify-center border border-white">
              {swipeHistory.length}
            </span>
          )}
        </button>

        {/* Pass Button */}
        <button
          onClick={() => {
            haptics.pass();
            executeSwipe('left');
          }}
          disabled={!currentProfile}
          aria-label="Pass profile (swipe left)"
          className="w-14 h-14 rounded-full bg-white text-neutral-700 hover:text-neutral-900 border border-neutral-200/80 shadow-lg shadow-neutral-900/5 flex items-center justify-center active:scale-90 transition-all disabled:opacity-40"
        >
          <X size={24} className="stroke-[2.5]" />
        </button>

        {/* Super Like Button */}
        <button
          onClick={handleSuperLikeAction}
          disabled={!currentProfile || isSuperLikedActive}
          aria-label="Super Like profile (swipe up)"
          className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-neutral-950 border border-white/60 shadow-md shadow-amber-500/25 flex items-center justify-center active:scale-90 hover:scale-105 transition-all disabled:opacity-40"
          title={`Super Like (${superLikeStatus.remaining} of 3 remaining today)`}
        >
          <Star size={18} className="fill-neutral-950 stroke-neutral-950" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neutral-950 text-amber-300 text-[9px] font-black flex items-center justify-center border border-white shadow-xs font-mono">
            {superLikeStatus.remaining}
          </span>
        </button>

        {/* Like Button */}
        <button
          onClick={() => {
            haptics.like();
            executeSwipe('right');
          }}
          disabled={!currentProfile}
          aria-label="Like profile (swipe right)"
          className="w-14 h-14 rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/30 flex items-center justify-center active:scale-90 transition-all disabled:opacity-40"
        >
          <Heart size={26} className="fill-white stroke-white" />
        </button>
      </div>

      {/* RECENT SWIPES HISTORY MODAL (LAST 5 SWIPES) */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-[#FAF8F5] text-neutral-900 w-full max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-200/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                    <History size={15} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-neutral-900">
                      Recent Swipes
                    </h3>
                    <p className="text-[10px] text-neutral-500">
                      Tracking up to the last {MAX_SWIPE_HISTORY} swipes
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="w-7 h-7 rounded-full bg-neutral-200/60 hover:bg-neutral-200 flex items-center justify-center text-neutral-600"
                >
                  <X size={15} />
                </button>
              </div>

              {/* History List */}
              <div className="p-4 overflow-y-auto space-y-2.5">
                {swipeHistory.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-400">
                    <Clock size={24} className="mx-auto mb-2 opacity-40" />
                    <span>No swipes performed yet in this session.</span>
                  </div>
                ) : (
                  [...swipeHistory].reverse().map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-2.5 bg-white rounded-2xl border border-neutral-200/80 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                          <AvatarImage
                            src={item.profile.photos[0]}
                            alt={item.profile.name}
                            fallbackName={item.profile.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-neutral-900 truncate">
                            {item.profile.name}, {item.profile.age}
                          </h4>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {item.timestamp}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.type === 'pass' ? (
                          <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-semibold border border-neutral-200">
                            PASSED
                          </span>
                        ) : item.type === 'superlike' ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">
                            SUPER LIKE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-200">
                            LIKED
                          </span>
                        )}

                        {/* If this is the most recent swipe, show immediate Undo button */}
                        {idx === 0 && (
                          <button
                            onClick={() => {
                              handleUndo();
                              setShowHistoryModal(false);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs ml-1"
                          >
                            <Undo2 size={11} />
                            <span>Undo</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {canUndo && (
                <div className="p-3 bg-neutral-50/80 border-t border-neutral-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500">
                    {swipeHistory.length} of {MAX_SWIPE_HISTORY} slots used
                  </span>
                  <button
                    onClick={() => {
                      handleUndo();
                      setShowHistoryModal(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <RotateCcw size={13} />
                    <span>Undo Last Swipe</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Super Like Daily Limit Depleted Modal */}
      <AnimatePresence>
        {superLikeLimitModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#FAF8F5] text-neutral-900 w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 text-center shadow-2xl overflow-hidden"
            >
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Star size={34} className="fill-amber-500 stroke-amber-500" />
              </div>

              <h3 className="font-serif font-bold text-xl text-neutral-900">
                Daily Super Likes Depleted
              </h3>

              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                You’ve used all <strong>3</strong> of your daily Super Likes.
                Your allowance refreshes at midnight to keep romantic sparks intentional and authentic.
              </p>

              <button
                onClick={() => setSuperLikeLimitModal(false)}
                className="mt-6 w-full h-11 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs transition-colors shadow-sm"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
