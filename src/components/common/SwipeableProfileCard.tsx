import React, { useState, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  PanInfo,
  Variants,
} from 'framer-motion';
import {
  Heart,
  X,
  Star,
  MapPin,
  Briefcase,
  BadgeCheck,
  Music,
  Info,
  Sparkles,
} from 'lucide-react';
import { Profile } from '../../types';
import { AvatarImage } from './AvatarImage';
import { VerificationStatus } from '../verification/VerificationStatus';
import { haptics } from '../../utils/haptics';

export interface SwipeableProfileCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  onTap: () => void;
  isFrontCard: boolean;
  exitDirection?: 'left' | 'right' | 'up';
  onSuperLike?: () => void;
  superLikesRemaining?: number;
  isSuperLikedActive?: boolean;
  userGoal?: import('../../types').RelationshipGoal;
}

export const SwipeableProfileCard: React.FC<SwipeableProfileCardProps> = ({
  profile,
  onSwipe,
  onTap,
  isFrontCard,
  exitDirection = 'right',
  onSuperLike,
  superLikesRemaining = 3,
  isSuperLikedActive = false,
  userGoal,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Dynamic transforms based on horizontal drag offset
  const rotate = useTransform(x, [-260, 260], [-18, 18]);
  const likeOpacity = useTransform(x, [25, 110], [0, 1]);
  const passOpacity = useTransform(x, [-25, -110], [0, 1]);
  const superLikeOpacity = useTransform(y, [-25, -110], [0, 1]);

  const [isDragging, setIsDragging] = useState(false);
  const hasTriggeredThresholdRef = useRef(false);

  const handleDragStart = () => {
    setIsDragging(true);
    hasTriggeredThresholdRef.current = false;
    haptics.tap();
  };

  const handleDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const isPastThreshold =
      Math.abs(info.offset.x) > 95 || info.offset.y < -95;

    // Trigger haptic tick exactly when crossing threshold
    if (isPastThreshold && !hasTriggeredThresholdRef.current) {
      hasTriggeredThresholdRef.current = true;
      haptics.threshold();
    } else if (!isPastThreshold && hasTriggeredThresholdRef.current) {
      // Reset if user drags back towards center
      hasTriggeredThresholdRef.current = false;
    }
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);
    hasTriggeredThresholdRef.current = false;
    const horizontalThreshold = 95;
    const verticalThreshold = 95;
    const velocityThreshold = 450;

    // Commit swipe with appropriate tactile feedback
    if (info.offset.x > horizontalThreshold || info.velocity.x > velocityThreshold) {
      haptics.like();
      onSwipe('right');
    } else if (info.offset.x < -horizontalThreshold || info.velocity.x < -velocityThreshold) {
      haptics.pass();
      onSwipe('left');
    } else if (info.offset.y < -verticalThreshold || info.velocity.y < -velocityThreshold) {
      haptics.superLike();
      onSwipe('up');
    }
  };

  const handleCardClick = () => {
    if (!isDragging) {
      onTap();
    }
  };

  const cardVariants: Variants = {
    initial: {
      scale: isFrontCard ? 1 : 0.94,
      y: isFrontCard ? 0 : 12,
      opacity: isFrontCard ? 1 : 0.85,
    },
    animate: {
      scale: isFrontCard ? 1 : 0.94,
      y: isFrontCard ? 0 : 12,
      opacity: isFrontCard ? 1 : 0.85,
      transition: {
        type: 'spring',
        damping: 24,
        stiffness: 300,
      },
    },
    exit: (direction: 'left' | 'right' | 'up') => ({
      x: direction === 'left' ? -420 : direction === 'right' ? 420 : 0,
      y: direction === 'up' ? -480 : 0,
      rotate: direction === 'left' ? -28 : direction === 'right' ? 28 : 0,
      opacity: 0,
      scale: direction === 'up' ? 1.08 : 0.9,
      transition: { duration: 0.32, ease: 'easeOut' },
    }),
  };

  return (
    <motion.div
      style={{
        x,
        y,
        rotate: isFrontCard ? rotate : 0,
        zIndex: isFrontCard ? 10 : 0,
      }}
      variants={cardVariants}
      custom={exitDirection}
      initial="initial"
      animate="animate"
      exit="exit"
      drag={isFrontCard && !isSuperLikedActive ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.78}
      dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
      className={`absolute inset-0 w-full h-full rounded-[34px] overflow-hidden shadow-2xl bg-neutral-900 select-none transition-shadow duration-300 ${
        isSuperLikedActive
          ? 'ring-4 ring-amber-400 border-2 border-amber-300 shadow-[0_0_60px_rgba(251,191,36,0.6)]'
          : ''
      } ${
        isFrontCard ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
    >
      {/* On-Card Super Like Star Button */}
      {isFrontCard && onSuperLike && !isSuperLikedActive && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSuperLike();
          }}
          className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-neutral-950 font-bold text-[11px] shadow-lg shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all border border-white/60 pointer-events-auto group"
          title="Send a limited daily Super Like to stand out immediately"
        >
          <Star size={14} className="fill-neutral-950 stroke-neutral-950 group-hover:rotate-45 transition-transform" />
          <span>Super Like</span>
          <span className="ml-0.5 px-1.5 py-0.5 rounded-md bg-black/15 text-[10px] font-mono font-black">
            {superLikesRemaining}
          </span>
        </button>
      )}

      {/* DISTINCT SUPER LIKED CELEBRATION FEEDBACK OVERLAY */}
      {isSuperLikedActive && (
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/30 via-black/40 to-black/80 backdrop-blur-xs z-30 flex flex-col items-center justify-center p-6 text-center pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-2xl border-2 border-white animate-bounce mb-3">
            <Star size={44} className="fill-neutral-950 text-neutral-950" />
          </div>
          <span className="font-serif font-black text-3xl text-amber-300 tracking-wider uppercase drop-shadow-lg">
            SUPER LIKED!
          </span>
          <p className="text-xs text-white/90 font-medium mt-1 drop-shadow">
            Priority romantic spark sent to {profile.name}
          </p>
        </div>
      )}
      {/* Primary Portrait Photo */}
      <AvatarImage
        src={profile.photos[0]}
        alt={profile.name}
        fallbackName={profile.name}
        className="w-full h-full object-cover"
      />

      {/* Ambient Gradient Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15 pointer-events-none" />

      {/* Tactile Stamp Badges on Drag */}
      {isFrontCard && (
        <>
          {/* LIKE Stamp (Right Drag) */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-8 left-7 border-[3px] border-emerald-400 bg-emerald-950/40 backdrop-blur-xs text-emerald-300 font-serif font-black tracking-widest text-2xl uppercase px-4 py-1.5 rounded-2xl -rotate-12 pointer-events-none shadow-lg shadow-emerald-950/40 flex items-center gap-1.5"
          >
            <Heart size={22} className="fill-emerald-400 stroke-emerald-400" />
            <span>LIKE</span>
          </motion.div>

          {/* PASS Stamp (Left Drag) */}
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-8 right-7 border-[3px] border-rose-500 bg-rose-950/40 backdrop-blur-xs text-rose-300 font-serif font-black tracking-widest text-2xl uppercase px-4 py-1.5 rounded-2xl rotate-12 pointer-events-none shadow-lg shadow-rose-950/40 flex items-center gap-1.5"
          >
            <X size={24} className="stroke-[3]" />
            <span>PASS</span>
          </motion.div>

          {/* SUPER LIKE Stamp (Up Drag) */}
          <motion.div
            style={{ opacity: superLikeOpacity }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[3px] border-amber-400 bg-amber-950/60 backdrop-blur-xs text-amber-300 font-serif font-black tracking-widest text-xl uppercase px-5 py-2 rounded-2xl pointer-events-none shadow-xl flex items-center gap-2"
          >
            <Star size={20} className="fill-amber-400 stroke-amber-400" />
            <span>SUPER LIKE</span>
          </motion.div>
        </>
      )}

      {/* Top Info Hint Pill */}
      <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20 shadow-xs pointer-events-none">
        <Info size={12} className="text-white/80" />
        <span>Tap for story</span>
      </div>

      {/* Profile Info Overlay at Card Bottom */}
      <div className="absolute bottom-0 inset-x-0 p-5 text-white flex flex-col justify-end pointer-events-none">
        {/* Name, Age & Verified Badge */}
        <div className="flex items-baseline gap-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-sm">
            {profile.name}
          </h2>
          <span className="text-xl sm:text-2xl font-light opacity-90">{profile.age}</span>
          {profile.verified && (
            <VerificationStatus
              verified={true}
              badgeType={profile.verificationBadgeType || 'selfie_verified'}
              size="sm"
            />
          )}
        </div>

        {/* Occupation & Distance */}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/80">
          <div className="flex items-center gap-1">
            <Briefcase size={12} className="opacity-70" />
            <span>{profile.occupation}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={12} className="opacity-70" />
            <span>
              {profile.location} · {profile.distanceMiles} mi away
            </span>
          </div>
        </div>

        {/* Relationship Intention & Voice Vibe Badges */}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full backdrop-blur-md text-[10px] font-medium border ${
              userGoal && profile.relationshipGoal === userGoal
                ? 'bg-rose-600/90 text-white border-rose-300 shadow-xs ring-1 ring-white/30'
                : 'bg-white/20 text-white border-white/20'
            }`}
          >
            <Sparkles
              size={11}
              className={userGoal && profile.relationshipGoal === userGoal ? 'text-amber-200' : 'text-rose-300'}
            />
            <span>
              {userGoal && profile.relationshipGoal === userGoal
                ? `✨ Aligned Goal: ${profile.relationshipGoal}`
                : `Seeking: ${profile.relationshipGoal}`}
            </span>
          </div>

          {profile.dateMood && (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/30 backdrop-blur-md text-[10px] font-medium text-amber-100 border border-amber-300/30 shadow-2xs">
              <span className="select-none text-xs" role="img" aria-label={profile.dateMood.label}>
                {profile.dateMood.emoji}
              </span>
              <span>{profile.dateMood.label}</span>
            </div>
          )}

          {profile.voiceVibe && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/30 backdrop-blur-md text-[10px] font-medium text-rose-200 border border-rose-300/30">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              <span>Voice Note</span>
            </div>
          )}
        </div>

        {/* Short Bio snippet */}
        <p className="mt-2 text-xs text-white/90 line-clamp-2 leading-relaxed font-sans">
          &ldquo;{profile.bio}&rdquo;
        </p>

        {/* Anthem Highlight */}
        {profile.spotifyAnthem && (
          <div className="mt-3 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px]">
            <Music size={12} className="text-rose-300 shrink-0" />
            <span className="truncate">
              {profile.spotifyAnthem.songTitle} · {profile.spotifyAnthem.artist}
            </span>
          </div>
        )}

        {/* Interests preview tags */}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {profile.interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="text-[10px] bg-white/15 backdrop-blur-md px-2 py-0.5 rounded-md text-white/90"
            >
              {interest}
            </span>
          ))}
          {profile.interests.length > 3 && (
            <span className="text-[10px] text-white/70 self-center">
              +{profile.interests.length - 3} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
