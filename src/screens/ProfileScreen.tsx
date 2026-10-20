import React, { useState } from 'react';
import {
  Edit3,
  Sliders,
  Bell,
  Shield,
  Trash2,
  LogOut,
  ChevronRight,
  BadgeCheck,
  MapPin,
  Sparkles,
  Smartphone,
  Eye,
  Camera,
  Heart,
  X,
  Check,
  Mic,
  MessageSquare,
  ShieldCheck,
  Plus,
  HeartHandshake,
} from 'lucide-react';
import { User, Gender, MatchPreference, VoiceVibe, CommunicationPreferences, RelationshipGoal, DateMood, DATE_MOOD_OPTIONS } from '../types';
import { AuthService } from '../services/authService';
import { SafetyService } from '../services/safetyService';
import { AvatarImage } from '../components/common/AvatarImage';
import { VerificationModal } from '../components/verification/VerificationModal';
import { VerificationStatus } from '../components/verification/VerificationStatus';
import { VoiceVibeRecorderModal } from '../components/voicevibe/VoiceVibeRecorderModal';
import { VoiceVibePlayer } from '../components/voicevibe/VoiceVibePlayer';
import { CommunicationPreferencesModal } from '../components/profile/CommunicationPreferencesModal';
import { SafeDateModal } from '../components/safedate/SafeDateModal';
import { RelationshipIntentionsModal } from '../components/intentions/RelationshipIntentionsModal';
import { DateMoodSelector } from '../components/profile/DateMoodSelector';

interface ProfileScreenProps {
  currentUser: User;
  onUpdateUser: (updated: Partial<User>) => void;
  onLogout: () => void;
  onOpenSwiftUIRoadmap: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onUpdateUser,
  onLogout,
  onOpenSwiftUIRoadmap,
}) => {
  const [activeModal, setActiveModal] = useState<
    | 'edit'
    | 'discovery'
    | 'notifications'
    | 'privacy'
    | 'verification'
    | 'voice'
    | 'communication'
    | 'safedate'
    | 'intentions'
    | 'dateMood'
    | null
  >(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editOccupation, setEditOccupation] = useState(currentUser.occupation);
  const [editInterests, setEditInterests] = useState<string[]>(currentUser.interests);
  const [editRelationshipGoal, setEditRelationshipGoal] = useState(
    currentUser.relationshipGoal || 'Long-term partner'
  );
  const [editDateMood, setEditDateMood] = useState<DateMood>(
    currentUser.dateMood || DATE_MOOD_OPTIONS[0]
  );

  // Discovery Preferences State
  const [prefAgeMin, setPrefAgeMin] = useState(currentUser.discoveryPreferences.ageRange[0]);
  const [prefAgeMax, setPrefAgeMax] = useState(currentUser.discoveryPreferences.ageRange[1]);
  const [prefDistance, setPrefDistance] = useState(currentUser.discoveryPreferences.maxDistanceMiles);
  const [prefGender, setPrefGender] = useState<MatchPreference>(
    currentUser.discoveryPreferences.preferredGender
  );

  // Notification State
  const [notifMatches, setNotifMatches] = useState(currentUser.notificationSettings.newMatches);
  const [notifMessages, setNotifMessages] = useState(currentUser.notificationSettings.messages);
  const [notifDaily, setNotifDaily] = useState(currentUser.notificationSettings.dailyReminder);

  // Privacy State
  const [incognito, setIncognito] = useState(currentUser.privacySettings.incognitoMode);
  const [showDistance, setShowDistance] = useState(currentUser.privacySettings.showDistance);
  const [showAge, setShowAge] = useState(currentUser.privacySettings.showAge);

  const calculateCompletionScore = () => {
    let score = 40;
    if (currentUser.bio && currentUser.bio.length > 20) score += 20;
    if (currentUser.interests && currentUser.interests.length >= 3) score += 15;
    if (currentUser.prompts && currentUser.prompts.length > 0) score += 15;
    if (currentUser.photos && currentUser.photos.length >= 2) score += 10;
    return Math.min(100, score);
  };

  const completionScore = calculateCompletionScore();

  const handleSaveEditProfile = () => {
    onUpdateUser({
      name: editName,
      bio: editBio,
      occupation: editOccupation,
      interests: editInterests,
      relationshipGoal: editRelationshipGoal as any,
      dateMood: editDateMood,
    });
    setActiveModal(null);
  };

  const handleSaveDiscoveryPrefs = () => {
    onUpdateUser({
      discoveryPreferences: {
        ...currentUser.discoveryPreferences,
        ageRange: [prefAgeMin, prefAgeMax],
        maxDistanceMiles: prefDistance,
        preferredGender: prefGender,
      },
    });
    setActiveModal(null);
  };

  const handleSaveNotifications = () => {
    onUpdateUser({
      notificationSettings: {
        ...currentUser.notificationSettings,
        newMatches: notifMatches,
        messages: notifMessages,
        dailyReminder: notifDaily,
      },
    });
    setActiveModal(null);
  };

  const handleSavePrivacy = () => {
    onUpdateUser({
      privacySettings: {
        ...currentUser.privacySettings,
        incognitoMode: incognito,
        showDistance,
        showAge,
      },
    });
    setActiveModal(null);
  };

  const handleSaveVoiceVibe = (voiceVibe: VoiceVibe) => {
    onUpdateUser({ voiceVibe });
  };

  const handleDeleteVoiceVibe = () => {
    onUpdateUser({ voiceVibe: undefined });
  };

  const handleSaveCommunicationPrefs = (prefs: CommunicationPreferences) => {
    onUpdateUser({ communicationPreferences: prefs });
  };

  const handleSaveRelationshipGoal = (goal: RelationshipGoal) => {
    onUpdateUser({ relationshipGoal: goal });
    setEditRelationshipGoal(goal);
  };

  const handleVerificationSuccess = () => {
    onUpdateUser({
      verified: true,
      verificationBadgeType: 'selfie_verified',
    });
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        'Are you completely sure? This will delete your SoulSync profile, matches, and chat history permanently.'
      )
    ) {
      await SafetyService.getInstance().deleteAccount();
      onLogout();
    }
  };

  const handleAvatarPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const newPhoto = uploadEvent.target.result as string;
          onUpdateUser({
            photos: [newPhoto, ...currentUser.photos.slice(1)],
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF8F5] text-neutral-900 overflow-y-auto no-scrollbar pb-6">
      {/* Top Header */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <h1 className="font-serif font-bold text-2xl tracking-tight text-neutral-900">
          My Soul
        </h1>
        <button
          onClick={onOpenSwiftUIRoadmap}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
        >
          <Smartphone size={12} />
          <span>iOS & SwiftUI</span>
        </button>
      </div>

      {/* Profile Card Header */}
      <div className="px-4 py-2">
        <div className="p-5 bg-white rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col items-center text-center relative">
          {/* Avatar with Camera Overlay */}
          <div className="relative mb-3 group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-rose-500 shadow-md">
              <AvatarImage
                src={currentUser.photos[0]}
                alt={currentUser.name}
                fallbackName={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-rose-700 active:scale-95 transition-all">
              <Camera size={14} />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarPhotoChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Name & Age */}
          <div className="flex items-center gap-1.5 justify-center flex-wrap">
            <h2 className="font-serif text-xl font-bold text-neutral-900">
              {currentUser.name}
            </h2>
            <span className="text-lg font-light text-neutral-500">{currentUser.age}</span>
            <VerificationStatus
              verified={currentUser.verified}
              badgeType={currentUser.verificationBadgeType || 'selfie_verified'}
              size="md"
              interactive={true}
              onClick={() => setActiveModal('verification')}
            />
          </div>

          <p className="text-xs text-neutral-500 mt-0.5">
            {currentUser.occupation} · {currentUser.location}
          </p>

          {/* Verification Status Pill & Demo Toggle */}
          <div className="mt-2.5 flex items-center justify-center gap-2 flex-wrap">
            <VerificationStatus
              verified={currentUser.verified}
              badgeType={currentUser.verificationBadgeType || 'selfie_verified'}
              size="md"
              showLabel={true}
              interactive={true}
              onClick={() => setActiveModal('verification')}
            />
            <button
              type="button"
              onClick={() => onUpdateUser({ verified: !currentUser.verified })}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium transition-colors border ${
                currentUser.verified
                  ? 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 font-semibold'
              }`}
              title="Quickly toggle verified status for demo testing"
            >
              {currentUser.verified ? 'Demo: Unverify' : 'Demo: Quick Verify'}
            </button>
          </div>

          {/* Relationship Intention & Date Mood Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
            <button
              onClick={() => setActiveModal('intentions')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 text-[11px] text-rose-800 font-semibold transition-all shadow-2xs group cursor-pointer"
              title="Update your relationship intentions"
            >
              <Heart size={12} className="text-rose-600 fill-rose-500/20 group-hover:scale-110 transition-transform" />
              <span>Intent: {currentUser.relationshipGoal || 'Long-term partner'}</span>
              <ChevronRight size={12} className="text-rose-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => setActiveModal('dateMood')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-[11px] text-amber-900 font-semibold transition-all shadow-2xs group cursor-pointer"
              title="Change your current Date Mood"
            >
              <span className="text-sm select-none" role="img" aria-label={currentUser.dateMood?.label || 'Coffee dates'}>
                {currentUser.dateMood?.emoji || '☕'}
              </span>
              <span>Mood: {currentUser.dateMood?.label || 'Coffee dates'}</span>
              <ChevronRight size={12} className="text-amber-500 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Completion Progress Bar */}
          <div className="w-full max-w-xs mt-3.5 p-3 bg-rose-50/60 rounded-2xl border border-rose-100">
            <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
              <span className="text-rose-900">Profile Resonance</span>
              <span className="text-rose-600 font-semibold font-mono">{completionScore}%</span>
            </div>
            <div className="w-full h-1.5 bg-rose-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-600 rounded-full transition-all duration-300"
                style={{ width: `${completionScore}%` }}
              />
            </div>
          </div>

          {/* Voice Vibe Showcase or Recorder Trigger */}
          <div className="w-full max-w-xs mt-3 text-left">
            {currentUser.voiceVibe ? (
              <VoiceVibePlayer
                voiceVibe={currentUser.voiceVibe}
                authorName={currentUser.name}
                showDelete={true}
                onDelete={handleDeleteVoiceVibe}
              />
            ) : (
              <button
                onClick={() => setActiveModal('voice')}
                className="w-full p-3 rounded-2xl bg-white border border-dashed border-rose-300 hover:bg-rose-50/50 flex items-center justify-center gap-2 text-rose-700 text-xs font-semibold transition-colors"
              >
                <Mic size={15} />
                <span>Record 15s Voice Vibe Intro</span>
              </button>
            )}
          </div>

          {/* Edit Profile CTA */}
          <button
            onClick={() => setActiveModal('edit')}
            className="mt-3.5 px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Edit3 size={13} />
            <span>Edit Profile & Prompts</span>
          </button>
        </div>
      </div>

      {/* Settings Navigation List */}
      <div className="px-4 py-3 space-y-2">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider ml-1 font-mono">
          Preferences & Controls
        </span>

        {/* Relationship Intentions */}
        <button
          onClick={() => setActiveModal('intentions')}
          className="w-full p-3.5 bg-white rounded-2xl border border-rose-200/90 flex items-center justify-between hover:bg-rose-50/40 transition-colors shadow-xs text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <HeartHandshake size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold text-neutral-900">Relationship Intentions</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  {currentUser.relationshipGoal || 'Long-term partner'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Choose goals: Long-term, Casual, Life partner, Marriage, or Open
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
        </button>

        {/* Current Date Mood */}
        <button
          onClick={() => setActiveModal('dateMood')}
          className="w-full p-3.5 bg-white rounded-2xl border border-amber-200/90 flex items-center justify-between hover:bg-amber-50/40 transition-colors shadow-xs text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg select-none">
              {currentUser.dateMood?.emoji || '☕'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold text-neutral-900">Current Date Mood</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {currentUser.dateMood?.label || 'Coffee dates'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {currentUser.dateMood?.tagline || 'Pick your vibe: Coffee dates, Adventurous, Quiet nights'}
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
        </button>

        {/* Discovery Preferences */}
        <button
          onClick={() => setActiveModal('discovery')}
          className="w-full p-3.5 bg-white rounded-2xl border border-neutral-200/80 flex items-center justify-between hover:bg-neutral-50 transition-colors shadow-xs text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Sliders size={18} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-neutral-900">Discovery Preferences</h4>
              <p className="text-[11px] text-neutral-500">
                Ages {currentUser.discoveryPreferences.ageRange[0]}–
                {currentUser.discoveryPreferences.ageRange[1]} · Up to{' '}
                {currentUser.discoveryPreferences.maxDistanceMiles} miles
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
        </button>

        {/* Notification Settings */}
        <button
          onClick={() => setActiveModal('notifications')}
          className="w-full p-3.5 bg-white rounded-2xl border border-neutral-200/80 flex items-center justify-between hover:bg-neutral-50 transition-colors shadow-xs text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bell size={18} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-neutral-900">Notifications</h4>
              <p className="text-[11px] text-neutral-500">
                Sparks, messages, and daily matches
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
        </button>

        {/* Privacy & Safety Center */}
        <button
          onClick={() => setActiveModal('privacy')}
          className="w-full p-3.5 bg-white rounded-2xl border border-neutral-200/80 flex items-center justify-between hover:bg-neutral-50 transition-colors shadow-xs text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield size={18} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-neutral-900">Privacy & Safety</h4>
              <p className="text-[11px] text-neutral-500">
                Incognito mode, distance visibility, safety rules
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
        </button>

        {/* Communication Preferences */}
        <button
          onClick={() => setActiveModal('communication')}
          className="w-full p-3.5 bg-white rounded-2xl border border-neutral-200/80 flex items-center justify-between hover:bg-neutral-50 transition-colors shadow-xs text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-neutral-900">Communication Preferences</h4>
              <p className="text-[11px] text-neutral-500">
                {currentUser.communicationPreferences?.textingRhythm || 'Thoughtful batch responder'} · {currentUser.communicationPreferences?.datingPace || 'Slow & intentional'}
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
        </button>

        {/* SafeDate Center */}
        <button
          onClick={() => setActiveModal('safedate')}
          className="w-full p-3.5 bg-white rounded-2xl border border-neutral-200/80 flex items-center justify-between hover:bg-neutral-50 transition-colors shadow-xs text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-neutral-900">SafeDate Protection</h4>
              <p className="text-[11px] text-neutral-500">
                Trusted contact, check-in alarms, instant SOS
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
        </button>

        {/* SwiftUI Migration Spec */}
        <button
          onClick={onOpenSwiftUIRoadmap}
          className="w-full p-3.5 bg-white rounded-2xl border border-neutral-200/80 flex items-center justify-between hover:bg-neutral-50 transition-colors shadow-xs text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Smartphone size={18} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-neutral-900">SwiftUI Migration Spec</h4>
              <p className="text-[11px] text-neutral-500">
                Apple Sign In, APNs, WidgetKit, CoreLocation
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
        </button>
      </div>

      {/* Account Deletion & Logout */}
      <div className="px-4 pt-2 space-y-2">
        <button
          onClick={onLogout}
          className="w-full h-11 rounded-2xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>

        <button
          onClick={handleDeleteAccount}
          className="w-full h-10 rounded-2xl text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Trash2 size={13} />
          <span>Delete Account</span>
        </button>
      </div>

      {/* EDIT PROFILE MODAL */}
      {activeModal === 'edit' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-neutral-200">
              <h3 className="font-serif font-bold text-lg text-neutral-900">Edit Profile</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-neutral-200/60 hover:bg-neutral-200 flex items-center justify-center text-neutral-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-neutral-600 uppercase mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-600 uppercase mb-1">
                  Profession / Focus
                </label>
                <input
                  type="text"
                  value={editOccupation}
                  onChange={(e) => setEditOccupation(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-600 uppercase mb-1">
                  Relationship Goal
                </label>
                <select
                  value={editRelationshipGoal}
                  onChange={(e) => setEditRelationshipGoal(e.target.value as User['relationshipGoal'])}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-rose-500"
                >
                  <option value="Long-term partner">Long-term partner</option>
                  <option value="Casual">Casual Dating</option>
                  <option value="Life partner">Life partner</option>
                  <option value="Marriage">Marriage</option>
                  <option value="Open to exploring">Open to exploring</option>
                  <option value="New friends">New friends</option>
                </select>
              </div>

              {/* Date Mood in Edit Profile */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-neutral-600 uppercase">
                    Current Date Mood
                  </label>
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-semibold">
                    {editDateMood.emoji} {editDateMood.label}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mb-2">
                  Choose the emoji vibe for your current dating intent:
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto no-scrollbar p-0.5">
                  {DATE_MOOD_OPTIONS.map((mood) => {
                    const isSelected = editDateMood.id === mood.id;
                    return (
                      <button
                        key={mood.id}
                        type="button"
                        onClick={() => setEditDateMood(mood)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-amber-50/90 border-amber-500 ring-1 ring-amber-500 text-amber-950 font-medium shadow-2xs'
                            : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        <span className="text-xl shrink-0 select-none" role="img" aria-label={mood.label}>
                          {mood.emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold leading-tight truncate">
                            {mood.label}
                          </div>
                          <div className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5">
                            {mood.tagline}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-600 uppercase mb-1">
                  Romantic Bio
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 flex justify-end gap-2 rounded-b-3xl">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditProfile}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISCOVERY PREFERENCES MODAL */}
      {activeModal === 'discovery' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-neutral-200">
              <h3 className="font-serif font-bold text-lg text-neutral-900">
                Discovery Preferences
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-neutral-200/60 hover:bg-neutral-200 flex items-center justify-center text-neutral-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs font-sans">
              <div>
                <label className="block font-semibold text-neutral-600 uppercase mb-2">
                  Interested in meeting
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['women', 'men', 'everyone'] as MatchPreference[]).map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setPrefGender(pref)}
                      className={`py-2 rounded-xl capitalize font-medium border transition-colors ${
                        prefGender === pref
                          ? 'bg-rose-600 text-white border-rose-600 font-semibold'
                          : 'bg-white border-neutral-300 text-neutral-700'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-600 uppercase">Age Range</span>
                  <span className="text-neutral-900 font-semibold font-mono">
                    {prefAgeMin} – {prefAgeMax}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={18}
                    max={60}
                    value={prefAgeMin}
                    onChange={(e) =>
                      setPrefAgeMin(Math.min(parseInt(e.target.value), prefAgeMax - 1))
                    }
                    className="w-full accent-rose-600"
                  />
                  <input
                    type="range"
                    min={18}
                    max={60}
                    value={prefAgeMax}
                    onChange={(e) =>
                      setPrefAgeMax(Math.max(parseInt(e.target.value), prefAgeMin + 1))
                    }
                    className="w-full accent-rose-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-neutral-600 uppercase">
                    Maximum Distance
                  </span>
                  <span className="text-neutral-900 font-semibold font-mono">
                    {prefDistance} miles
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={prefDistance}
                  onChange={(e) => setPrefDistance(parseInt(e.target.value))}
                  className="w-full accent-rose-600"
                />
              </div>
            </div>

            <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 flex justify-end gap-2 rounded-b-3xl">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDiscoveryPrefs}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Apply Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS MODAL */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-neutral-200">
              <h3 className="font-serif font-bold text-lg text-neutral-900">Notifications</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-neutral-200/60 hover:bg-neutral-200 flex items-center justify-center text-neutral-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans">
              <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-neutral-200">
                <div>
                  <h4 className="font-semibold text-neutral-900">New Mutual Matches</h4>
                  <p className="text-[11px] text-neutral-500">Alert me when a spark occurs</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifMatches}
                  onChange={(e) => setNotifMatches(e.target.checked)}
                  className="w-5 h-5 accent-rose-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-neutral-200">
                <div>
                  <h4 className="font-semibold text-neutral-900">Chat Messages</h4>
                  <p className="text-[11px] text-neutral-500">Alert me for incoming messages</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifMessages}
                  onChange={(e) => setNotifMessages(e.target.checked)}
                  className="w-5 h-5 accent-rose-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-neutral-200">
                <div>
                  <h4 className="font-semibold text-neutral-900">Daily Discovery Drop</h4>
                  <p className="text-[11px] text-neutral-500">Gentle evening reminder</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifDaily}
                  onChange={(e) => setNotifDaily(e.target.checked)}
                  className="w-5 h-5 accent-rose-600 rounded"
                />
              </div>
            </div>

            <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 flex justify-end gap-2 rounded-b-3xl">
              <button
                onClick={handleSaveNotifications}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRIVACY MODAL */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-neutral-200">
              <h3 className="font-serif font-bold text-lg text-neutral-900">Privacy & Safety</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-neutral-200/60 hover:bg-neutral-200 flex items-center justify-center text-neutral-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans">
              <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-neutral-200">
                <div>
                  <h4 className="font-semibold text-neutral-900">Incognito Mode</h4>
                  <p className="text-[11px] text-neutral-500">
                    Only profiles you have liked can see you
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={incognito}
                  onChange={(e) => setIncognito(e.target.checked)}
                  className="w-5 h-5 accent-rose-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-neutral-200">
                <div>
                  <h4 className="font-semibold text-neutral-900">Show Distance</h4>
                  <p className="text-[11px] text-neutral-500">
                    Show approximate miles on your profile
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={showDistance}
                  onChange={(e) => setShowDistance(e.target.checked)}
                  className="w-5 h-5 accent-rose-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-neutral-200">
                <div>
                  <h4 className="font-semibold text-neutral-900">Show Age</h4>
                  <p className="text-[11px] text-neutral-500">Display age number next to name</p>
                </div>
                <input
                  type="checkbox"
                  checked={showAge}
                  onChange={(e) => setShowAge(e.target.checked)}
                  className="w-5 h-5 accent-rose-600 rounded"
                />
              </div>
            </div>

            <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 flex justify-end gap-2 rounded-b-3xl">
              <button
                onClick={handleSavePrivacy}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VERIFICATION MODAL */}
      {activeModal === 'verification' && (
        <VerificationModal
          currentUser={currentUser}
          onClose={() => setActiveModal(null)}
          onVerificationComplete={handleVerificationSuccess}
          onUnverify={() => onUpdateUser({ verified: false })}
        />
      )}

      {/* VOICE VIBE RECORDER MODAL */}
      {activeModal === 'voice' && (
        <VoiceVibeRecorderModal
          onClose={() => setActiveModal(null)}
          onSaveVoiceVibe={handleSaveVoiceVibe}
        />
      )}

      {/* COMMUNICATION PREFERENCES MODAL */}
      {activeModal === 'communication' && (
        <CommunicationPreferencesModal
          initialPreferences={currentUser.communicationPreferences}
          onClose={() => setActiveModal(null)}
          onSave={handleSaveCommunicationPrefs}
        />
      )}

      {/* SAFEDATE MODAL */}
      {activeModal === 'safedate' && (
        <SafeDateModal
          partnerName="Your Next Date"
          defaultVenue="Sightglass Coffee / Presidio Walk"
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* RELATIONSHIP INTENTIONS MODAL */}
      {activeModal === 'intentions' && (
        <RelationshipIntentionsModal
          currentUser={currentUser}
          onClose={() => setActiveModal(null)}
          onSave={handleSaveRelationshipGoal}
        />
      )}

      {/* DATE MOOD MODAL */}
      {activeModal === 'dateMood' && (
        <DateMoodSelector
          isModal={true}
          selectedMood={currentUser.dateMood || DATE_MOOD_OPTIONS[0]}
          onSelectMood={(mood) => {
            onUpdateUser({ dateMood: mood });
            setEditDateMood(mood);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};
