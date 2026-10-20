import React from 'react';
import { Heart, Sparkles, MessageSquare, Compass, ShieldCheck, Dumbbell, Wine } from 'lucide-react';
import { Profile } from '../../types';

interface CompatibilityInsightsCardProps {
  user: Profile;
  partner: Profile;
}

export const CompatibilityInsightsCard: React.FC<CompatibilityInsightsCardProps> = ({
  user,
  partner,
}) => {
  // Shared interests
  const sharedInterests = user.interests.filter((i) =>
    partner.interests.some((pi) => pi.toLowerCase() === i.toLowerCase())
  );

  // Intentions match
  const isGoalMatched = user.relationshipGoal === partner.relationshipGoal;

  // Lifestyle match
  const bothNonSmokers = (user.smoking || 'Never') === 'Never' && (partner.smoking || 'Never') === 'Never';
  const bothActive = (user.exercise === 'Active' || user.exercise === 'Daily') && (partner.exercise === 'Active' || partner.exercise === 'Daily');

  // Communication match
  const userComm = user.communicationPreferences;
  const partnerComm = partner.communicationPreferences;

  return (
    <div className="bg-gradient-to-br from-rose-50/70 via-white to-neutral-50 rounded-3xl p-4 sm:p-5 border border-rose-200/80 shadow-xs space-y-3.5">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles size={14} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xs text-neutral-900 tracking-tight">
              Compatibility Insights
            </h3>
            <p className="text-[10px] text-neutral-500">Grounded in your shared values & lifestyle</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-rose-700 bg-rose-100/80 px-2.5 py-0.5 rounded-full">
          Transparent Alignment
        </span>
      </div>

      <div className="space-y-2.5 text-xs">
        {/* 1. Relationship Intentions */}
        <div className="p-3 bg-white rounded-2xl border border-neutral-200/80 flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
            <Heart size={13} className="fill-rose-500/20" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900">Relationship Intentions</span>
              {isGoalMatched ? (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Aligned Goal
                </span>
              ) : (
                <span className="text-[10px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                  Complementary
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
              {isGoalMatched
                ? `You both stated you are seeking a ${user.relationshipGoal.toLowerCase()}. You share a focused desire for intentional commitment.`
                : `You are looking for a ${user.relationshipGoal.toLowerCase()}, while ${partner.name} is ${partner.relationshipGoal.toLowerCase()}.`}
            </p>
          </div>
        </div>

        {/* 2. Shared Passions */}
        <div className="p-3 bg-white rounded-2xl border border-neutral-200/80 flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
            <Compass size={13} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900">Passions & Interests</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                {sharedInterests.length} Mutual
              </span>
            </div>
            {sharedInterests.length > 0 ? (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {sharedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="text-[10px] font-medium px-2 py-0.5 bg-amber-50/80 text-amber-900 border border-amber-200/60 rounded-lg"
                  >
                    ★ {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-500 mt-1">
                Different creative perspectives: {partner.interests.slice(0, 3).join(', ')} provide fresh conversational discovery.
              </p>
            )}
          </div>
        </div>

        {/* 3. Communication Rhythm */}
        {partnerComm && (
          <div className="p-3 bg-white rounded-2xl border border-neutral-200/80 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquare size={13} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900">Communication Rhythm</span>
                <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {partnerComm.datingPace}
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                {partner.name} is a <strong>{partnerComm.textingRhythm.toLowerCase()}</strong> and{' '}
                {partnerComm.callingPreference.toLowerCase()}.
                {partnerComm.boundarySnippet && (
                  <span className="italic block text-neutral-500 mt-0.5">
                    &ldquo;{partnerComm.boundarySnippet}&rdquo;
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* 4. Lifestyle Harmony */}
        <div className="p-3 bg-white rounded-2xl border border-neutral-200/80 flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck size={13} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-semibold text-neutral-900 block">Lifestyle Balance</span>
            <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
              {bothNonSmokers ? 'Both non-smokers. ' : ''}
              {bothActive ? 'Shared enthusiasm for staying active outdoors. ' : ''}
              Drinking rhythm: {partner.drinking || 'Socially'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
