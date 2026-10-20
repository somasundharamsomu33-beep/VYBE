import React, { useState } from 'react';
import {
  X,
  Heart,
  BadgeCheck,
  Briefcase,
  MapPin,
  Music,
  Wine,
  Cigarette,
  Dumbbell,
  Sparkles,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Profile } from '../types';
import { AvatarImage } from '../components/common/AvatarImage';
import { CompatibilityInsightsCard } from '../components/compatibility/CompatibilityInsightsCard';
import { VoiceVibePlayer } from '../components/voicevibe/VoiceVibePlayer';
import { VerificationStatus } from '../components/verification/VerificationStatus';
import { INITIAL_CURRENT_USER } from '../demoData/mockProfiles';
import { ShieldCheck, AlertCircle, Info, CheckCircle2, Lock } from 'lucide-react';

interface ProfileDetailModalProps {
  profile: Profile;
  currentUser?: Profile;
  onClose: () => void;
  onLike: (profile: Profile) => void;
  onPass: (profile: Profile) => void;
  onReport: (profile: Profile) => void;
  onToggleVerified?: (profileId: string, newStatus: boolean) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  currentUser = INITIAL_CURRENT_USER,
  onClose,
  onLike,
  onPass,
  onReport,
  onToggleVerified,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isVerified, setIsVerified] = useState(Boolean(profile.verified));
  const [showVerificationInfo, setShowVerificationInfo] = useState(false);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex < profile.photos.length - 1) {
      setPhotoIndex(photoIndex + 1);
    } else {
      setPhotoIndex(0);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
    } else {
      setPhotoIndex(profile.photos.length - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-3 overflow-hidden">
      <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-md h-[92vh] sm:h-[88vh] rounded-t-[36px] sm:rounded-[36px] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto relative no-scrollbar">
          {/* Top Sticky Close Button */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors border border-white/20 shadow-md"
            >
              <X size={18} />
            </button>
          </div>

          {/* Photos Header Carousel */}
          <div className="relative w-full h-96 bg-neutral-900 select-none">
            <AvatarImage
              src={profile.photos[photoIndex]}
              alt={`${profile.name} photo ${photoIndex + 1}`}
              fallbackName={profile.name}
              className="w-full h-full object-cover"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Carousel navigation controls if multiple photos */}
            {profile.photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Progress bars indicator at top */}
                <div className="absolute top-3 inset-x-6 flex gap-1 z-10">
                  {profile.photos.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        idx === photoIndex ? 'bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Title on photo */}
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-3xl font-bold tracking-tight">{profile.name}</h1>
                <span className="text-2xl font-light opacity-90">{profile.age}</span>
                <VerificationStatus
                  verified={isVerified}
                  badgeType={profile.verificationBadgeType || 'selfie_verified'}
                  size="md"
                  interactive={true}
                  onClick={() => setShowVerificationInfo(true)}
                />
              </div>
              <div className="flex items-center gap-3 text-xs text-white/80 mt-1">
                <span>{profile.occupation}</span>
                <span>·</span>
                <span>{profile.location}</span>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-6">
            {/* Romantic Goal & Distance */}
            <div
              className={`flex items-center justify-between p-3.5 rounded-2xl text-xs border ${
                currentUser.relationshipGoal === profile.relationshipGoal
                  ? 'bg-gradient-to-r from-rose-50 via-rose-100/60 to-rose-50 border-rose-300 shadow-2xs'
                  : 'bg-rose-50/70 border-rose-100'
              }`}
            >
              <div className="flex items-center gap-2 text-rose-950 font-medium">
                <Sparkles
                  size={14}
                  className={
                    currentUser.relationshipGoal === profile.relationshipGoal
                      ? 'text-amber-500'
                      : 'text-rose-600'
                  }
                />
                <span>Intent: {profile.relationshipGoal}</span>
                {currentUser.relationshipGoal === profile.relationshipGoal && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
                    Aligned Goal
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-neutral-500">
                <MapPin size={12} />
                <span>{profile.distanceMiles} miles away</span>
              </div>
            </div>

            {/* Current Date Mood Showcase */}
            {profile.dateMood && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-rose-50/50 border border-amber-200/90 shadow-2xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-amber-200/80 flex items-center justify-center text-2xl shrink-0 select-none">
                    <span role="img" aria-label={profile.dateMood.label}>
                      {profile.dateMood.emoji}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300/70">
                        Current Date Mood
                      </span>
                      {currentUser?.dateMood?.id === profile.dateMood.id && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                          <Sparkles size={10} />
                          <span>Same Mood!</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 mt-1">
                      {profile.dateMood.label}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed font-sans">
                      {profile.dateMood.tagline}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-900/80">
                  <span className="italic flex items-center gap-1">
                    <span>Dating vibe:</span>
                    <strong className="font-semibold text-neutral-800">&ldquo;{profile.dateMood.label}&rdquo;</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => onLike(profile)}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <span>Match vibe</span>
                    <Heart size={11} className="fill-rose-500 text-rose-500" />
                  </button>
                </div>
              </div>
            )}

            {/* Voice Vibe Audio Snippet */}
            {profile.voiceVibe && (
              <VoiceVibePlayer
                voiceVibe={profile.voiceVibe}
                authorName={profile.name}
              />
            )}

            {/* Compatibility Insights Breakdown */}
            <CompatibilityInsightsCard
              user={currentUser}
              partner={profile}
            />

            {/* Bio */}
            <div>
              <h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 font-mono">
                About Me
              </h3>
              <p className="text-sm text-neutral-800 leading-relaxed font-sans">
                {profile.bio}
              </p>
            </div>

            {/* Prompts Showcase */}
            {profile.prompts && profile.prompts.length > 0 && (
              <div className="space-y-3">
                {profile.prompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs"
                  >
                    <span className="text-xs font-semibold text-rose-600 block mb-1">
                      {prompt.question}
                    </span>
                    <p className="text-sm text-neutral-800 font-serif italic leading-relaxed">
                      &ldquo;{prompt.answer}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Spotify Anthem */}
            {profile.spotifyAnthem && (
              <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Music size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                    Favorite Anthem
                  </span>
                  <p className="text-xs font-semibold text-neutral-900 truncate">
                    {profile.spotifyAnthem.songTitle}
                  </p>
                  <p className="text-[11px] text-neutral-500 truncate">
                    {profile.spotifyAnthem.artist}
                  </p>
                </div>
              </div>
            )}

            {/* Lifestyle & Essentials Grid */}
            <div>
              <h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2.5 font-mono">
                Lifestyle & Details
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {profile.height && (
                  <div className="p-2.5 bg-white rounded-xl border border-neutral-200/80 flex items-center gap-2">
                    <span className="text-neutral-400">Height:</span>
                    <span className="font-medium text-neutral-800">{profile.height}</span>
                  </div>
                )}
                {profile.zodiac && (
                  <div className="p-2.5 bg-white rounded-xl border border-neutral-200/80 flex items-center gap-2">
                    <span className="text-neutral-400">Sign:</span>
                    <span className="font-medium text-neutral-800">{profile.zodiac}</span>
                  </div>
                )}
                {profile.drinking && (
                  <div className="p-2.5 bg-white rounded-xl border border-neutral-200/80 flex items-center gap-2">
                    <Wine size={14} className="text-rose-500" />
                    <span className="font-medium text-neutral-800">{profile.drinking}</span>
                  </div>
                )}
                {profile.exercise && (
                  <div className="p-2.5 bg-white rounded-xl border border-neutral-200/80 flex items-center gap-2">
                    <Dumbbell size={14} className="text-neutral-600" />
                    <span className="font-medium text-neutral-800">{profile.exercise}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Communication Preferences */}
            {profile.communicationPreferences && (
              <div className="p-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
                <h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider font-mono">
                  Communication Style
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-neutral-50 rounded-xl">
                    <span className="text-[10px] text-neutral-400 block">Texting</span>
                    <span className="font-semibold text-neutral-900">{profile.communicationPreferences.textingRhythm}</span>
                  </div>
                  <div className="p-2.5 bg-neutral-50 rounded-xl">
                    <span className="text-[10px] text-neutral-400 block">Calling</span>
                    <span className="font-semibold text-neutral-900">{profile.communicationPreferences.callingPreference}</span>
                  </div>
                  <div className="p-2.5 bg-neutral-50 rounded-xl col-span-2">
                    <span className="text-[10px] text-neutral-400 block">Dating Pace</span>
                    <span className="font-semibold text-neutral-900">{profile.communicationPreferences.datingPace}</span>
                  </div>
                </div>
                {profile.communicationPreferences.boundarySnippet && (
                  <p className="text-[11px] text-neutral-600 italic bg-rose-50/60 p-2.5 rounded-xl border border-rose-100">
                    &ldquo;{profile.communicationPreferences.boundarySnippet}&rdquo;
                  </p>
                )}
              </div>
            )}

            {/* Verification Status Card */}
            <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <VerificationStatus
                    verified={isVerified}
                    badgeType={profile.verificationBadgeType || 'selfie_verified'}
                    size="md"
                    showLabel={true}
                    interactive={true}
                    onClick={() => setShowVerificationInfo(true)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowVerificationInfo(true)}
                  className="text-[11px] text-rose-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <Info size={12} />
                  <span>About Verification</span>
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 mt-2">
                {isVerified
                  ? 'This user passed facial liveness and photo matching confirmation.'
                  : 'This profile is currently unverified. Be mindful when sharing plans.'}
              </p>

              {/* Demo Mode Toggle */}
              <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                <span className="text-neutral-400 font-mono">Demo mode test:</span>
                <button
                  type="button"
                  onClick={() => {
                    const nextStatus = !isVerified;
                    setIsVerified(nextStatus);
                    if (onToggleVerified) {
                      onToggleVerified(profile.id, nextStatus);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full font-medium transition-colors border ${
                    isVerified
                      ? 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 font-semibold'
                  }`}
                >
                  {isVerified ? 'Toggle Unverified (Demo)' : 'Toggle Verified (Demo)'}
                </button>
              </div>
            </div>

            {/* Safety & Report Button */}
            <div className="pt-2 pb-6 border-t border-neutral-200/80 text-center">
              <button
                onClick={() => onReport(profile)}
                className="text-xs text-neutral-400 hover:text-rose-600 transition-colors inline-flex items-center gap-1.5"
              >
                <ShieldAlert size={14} />
                <span>Report or block {profile.name}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pinned Bottom Pass/Like Bar */}
        <div className="p-4 bg-white/90 backdrop-blur-md border-t border-neutral-200/80 flex items-center justify-around gap-4 shrink-0">
          <button
            onClick={() => {
              onPass(profile);
              onClose();
            }}
            className="flex-1 h-12 rounded-2xl bg-neutral-100 hover:bg-neutral-200 active:scale-98 text-neutral-800 font-medium text-xs flex items-center justify-center gap-2 transition-all"
          >
            <X size={18} />
            <span>Pass</span>
          </button>

          <button
            onClick={() => {
              onLike(profile);
              onClose();
            }}
            className="flex-1 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/20"
          >
            <Heart size={18} className="fill-white" />
            <span>Like {profile.name}</span>
          </button>
        </div>

        {/* Verification Information & Trust Sheet */}
        {showVerificationInfo && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
            <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-sm rounded-t-[32px] border border-neutral-200 shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-neutral-900 leading-tight">
                      Trust & Verification
                    </h3>
                    <p className="text-[10px] text-neutral-500">SoulSync Authenticity Standards</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVerificationInfo(false)}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Status Header */}
              <div className="p-3.5 bg-white rounded-2xl border border-neutral-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-mono">Current Status</span>
                  <span className="text-xs font-semibold text-neutral-900">
                    {isVerified ? 'Selfie Verified Identity' : 'Unverified Profile'}
                  </span>
                </div>
                <VerificationStatus
                  verified={isVerified}
                  badgeType={profile.verificationBadgeType || 'selfie_verified'}
                  size="md"
                  showLabel={true}
                />
              </div>

              {/* What verification means */}
              <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 space-y-2.5 text-xs text-neutral-700">
                <h4 className="font-semibold text-neutral-900 text-xs">How SoulSync Verifies Members</h4>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dynamic 3D Liveness:</strong> Captures subtle micro-movements to ensure the user is an active human, not a static photograph or AI deepfake.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Gallery Facial Geometry:</strong> Compares biometric landmarks against all uploaded public photos.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Lock size={14} className="text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Biometric Privacy:</strong> Verification scan artifacts are discarded once verified and never published.
                  </span>
                </div>
              </div>

              {/* Crucial Disclaimer */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Demo Notice & Identity Disclosure</strong>
                  <span>
                    This applet runs in a browser demonstration environment. True biometric scanning and legal government ID checks require native iOS hardware (TrueDepth/VisionKit) and regulated KYC providers. Always exercise caution and use SafeDate before meeting anyone in person.
                  </span>
                </div>
              </div>

              {/* Demo Toggle Control */}
              <div className="p-3 bg-neutral-100 rounded-xl flex items-center justify-between text-xs">
                <span className="text-neutral-600">Simulate status change:</span>
                <button
                  type="button"
                  onClick={() => {
                    const nextStatus = !isVerified;
                    setIsVerified(nextStatus);
                    if (onToggleVerified) {
                      onToggleVerified(profile.id, nextStatus);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors ${
                    isVerified
                      ? 'bg-neutral-800 text-white hover:bg-neutral-700'
                      : 'bg-rose-600 text-white hover:bg-rose-700'
                  }`}
                >
                  {isVerified ? 'Mark as Unverified' : 'Mark as Verified'}
                </button>
              </div>

              <button
                onClick={() => setShowVerificationInfo(false)}
                className="w-full h-11 rounded-2xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
