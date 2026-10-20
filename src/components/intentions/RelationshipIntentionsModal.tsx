import React, { useState } from 'react';
import {
  X,
  Heart,
  Sparkles,
  Compass,
  HeartHandshake,
  Users,
  Coffee,
  Check,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { RelationshipGoal, User } from '../../types';
import { haptics } from '../../utils/haptics';

interface RelationshipIntentionsModalProps {
  currentUser: User;
  onClose: () => void;
  onSave: (goal: RelationshipGoal) => void;
}

interface GoalOption {
  goal: RelationshipGoal;
  label: string;
  badge: string;
  description: string;
  icon: React.ElementType;
  accentColor: string;
  pillColor: string;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    goal: 'Long-term partner',
    label: 'Long-term partner',
    badge: 'Commitment',
    description: 'Seeking a meaningful, enduring bond with someone ready to grow together.',
    icon: Heart,
    accentColor: 'text-rose-600 bg-rose-50 border-rose-200',
    pillColor: 'bg-rose-100 text-rose-700',
  },
  {
    goal: 'Casual',
    label: 'Casual Dating',
    badge: 'Low-pressure',
    description: 'Fun dates, exciting conversations, and relaxed company without rigid expectations.',
    icon: Flame,
    accentColor: 'text-amber-600 bg-amber-50 border-amber-200',
    pillColor: 'bg-amber-100 text-amber-700',
  },
  {
    goal: 'Life partner',
    label: 'Life partner',
    badge: 'Deep Connection',
    description: 'Building an intentional future, shared household dreams, and a true co-pilot.',
    icon: Compass,
    accentColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    pillColor: 'bg-indigo-100 text-indigo-700',
  },
  {
    goal: 'Marriage',
    label: 'Marriage',
    badge: 'Intentional',
    description: 'Dating with marriage and family in mind, looking for mutual values and devotion.',
    icon: HeartHandshake,
    accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    pillColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    goal: 'Open to exploring',
    label: 'Open to exploring',
    badge: 'Flexible',
    description: 'Starting with honest chemistry and seeing naturally where the connection flows.',
    icon: Sparkles,
    accentColor: 'text-purple-600 bg-purple-50 border-purple-200',
    pillColor: 'bg-purple-100 text-purple-700',
  },
  {
    goal: 'New friends',
    label: 'New friends',
    badge: 'Social',
    description: 'Expanding social circle with like-minded souls for concerts, coffee, and adventures.',
    icon: Coffee,
    accentColor: 'text-sky-600 bg-sky-50 border-sky-200',
    pillColor: 'bg-sky-100 text-sky-700',
  },
];

export const RelationshipIntentionsModal: React.FC<RelationshipIntentionsModalProps> = ({
  currentUser,
  onClose,
  onSave,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<RelationshipGoal>(
    currentUser.relationshipGoal || 'Long-term partner'
  );
  const [hasSaved, setHasSaved] = useState(false);

  const handleSelect = (goal: RelationshipGoal) => {
    haptics.selection();
    setSelectedGoal(goal);
  };

  const handleSave = () => {
    haptics.success();
    onSave(selectedGoal);
    setHasSaved(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-md max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-neutral-200/80 bg-white rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <HeartHandshake size={18} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-neutral-900">
                Relationship Intentions
              </h3>
              <p className="text-[11px] text-neutral-500">
                Clear goals help find people seeking the same path
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-3.5 text-xs font-sans">
          {/* Transparency note */}
          <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-2xl flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-rose-950 leading-relaxed">
              <strong className="font-semibold text-rose-900">Transparent & Respectful:</strong>{' '}
              Your intention appears as a verified badge on your profile and powers aligned matching in Discover.
            </div>
          </div>

          {/* Goal Options List */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider ml-1 font-mono">
              Choose your current intention
            </span>

            <div className="space-y-2">
              {GOAL_OPTIONS.map((item) => {
                const isSelected = selectedGoal === item.goal;
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.goal}
                    type="button"
                    onClick={() => handleSelect(item.goal)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-white border-rose-600 shadow-sm ring-1 ring-rose-600'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${item.accentColor}`}
                      >
                        <IconComponent size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-900 text-xs">
                            {item.label}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.pillColor}`}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-1 shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-rose-600 border-rose-600 text-white'
                            : 'border-neutral-300 bg-neutral-100'
                        }`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview how it appears on profile */}
          <div className="p-3.5 bg-neutral-100/80 rounded-2xl border border-neutral-200">
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider font-mono">
              Profile Badge Preview
            </span>
            <div className="mt-2 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs text-neutral-800 font-semibold shadow-2xs">
                <Heart size={12} className="text-rose-600 fill-rose-500/20" />
                <span>Intent: {selectedGoal}</span>
              </div>
              <span className="text-[10px] text-neutral-500">
                Visible to matches on card & profile
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-neutral-200 bg-white flex items-center justify-between gap-3 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={hasSaved}
            className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {hasSaved ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span>Saved & Aligned!</span>
              </>
            ) : (
              <>
                <Heart size={14} className="text-rose-400" />
                <span>Save Intention</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
