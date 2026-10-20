import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  MapPin,
  Sparkles,
  ShieldCheck,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Gender, MatchPreference, Profile, DateMood, DATE_MOOD_OPTIONS } from '../types';
import { AuthService } from '../services/authService';
import { AvatarImage } from '../components/common/AvatarImage';

interface OnboardingProfileScreenProps {
  onComplete: () => void;
  onCancel: () => void;
}

const AVAILABLE_INTERESTS = [
  'Architecture',
  'Natural Wine',
  'Ceramics',
  'Film Photography',
  'Hiking',
  'Jazz Vinyl',
  'Indie Cinema',
  'Specialty Coffee',
  'Bookstores',
  'Botanical Gardens',
  'Sourdough Baking',
  'Live Music',
  'Ocean Swimming',
  'Contemporary Art',
  'Poetry',
  'Culinary Arts',
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
];

export const OnboardingProfileScreen: React.FC<OnboardingProfileScreenProps> = ({
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Basics
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('1998-06-15');
  const [gender, setGender] = useState<Gender>('woman');
  const [matchPref, setMatchPref] = useState<MatchPreference>('everyone');

  // Step 2: Vibe & Location
  const [occupation, setOccupation] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [selectedDateMood, setSelectedDateMood] = useState<DateMood>(DATE_MOOD_OPTIONS[0]); // ☕ Coffee dates
  const [locationName, setLocationName] = useState('San Francisco, CA');
  const [locationGranted, setLocationGranted] = useState(false);

  // Step 3: Photo & Prompts
  const [selectedPhoto, setSelectedPhoto] = useState<string>(PRESET_AVATARS[0]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Architecture',
    'Specialty Coffee',
    'Film Photography',
  ]);
  const [promptAnswer, setPromptAnswer] = useState(
    'Espresso at 8 AM, flower markets, and a long walk without checking Google Maps.'
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Age calculation & validation
  const calculateAge = (dobString: string): number => {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handleNextStep = () => {
    setErrorMessage(null);

    if (step === 1) {
      if (!name.trim()) {
        setErrorMessage('Please enter your first name.');
        return;
      }
      const age = calculateAge(birthdate);
      if (age < 18) {
        setErrorMessage('You must be 18 years or older to join SoulSync.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!occupation.trim()) {
        setErrorMessage('Please share your profession or focus.');
        return;
      }
      if (!bio.trim() || bio.length < 15) {
        setErrorMessage('Please write a brief bio (at least 15 characters).');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (selectedInterests.length < 3) {
        setErrorMessage('Please pick at least 3 romantic interests.');
        return;
      }

      // Finish Onboarding
      const finalAge = calculateAge(birthdate);
      const updatedProfile: Partial<Profile> = {
        name: name.trim(),
        birthdate,
        age: finalAge,
        gender,
        occupation: occupation.trim(),
        companyOrSchool: company.trim(),
        bio: bio.trim(),
        location: locationName,
        photos: [selectedPhoto],
        interests: selectedInterests,
        dateMood: selectedDateMood,
        prompts: [
          {
            id: 'p_user_1',
            question: 'My ideal Sunday looks like',
            answer: promptAnswer,
          },
        ],
      };

      AuthService.getInstance().updateUser({
        ...updatedProfile,
        onboardingCompleted: true,
      });

      onComplete();
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      if (selectedInterests.length < 6) {
        setSelectedInterests([...selectedInterests, interest]);
      }
    }
  };

  const handleRequestLocation = () => {
    // In production, triggers navigator.geolocation.getCurrentPosition
    setLocationGranted(true);
    setLocationName('San Francisco, CA (Approximate)');
  };

  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSelectedPhoto(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const progressPercent = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#FAF8F5] text-neutral-900 overflow-y-auto">
      {/* Top Header & Progress */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              if (step > 1) {
                setStep((step - 1) as 1 | 2);
              } else {
                onCancel();
              }
            }}
            className="w-9 h-9 -ml-2 rounded-full hover:bg-neutral-200/60 active:scale-95 flex items-center justify-center text-neutral-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="text-center">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest font-mono">
              Step {step} of 3
            </span>
          </div>

          <span className="text-xs font-semibold text-rose-600 font-serif">
            SoulSync
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-rose-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-neutral-900">
                The essentials
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Your first name and age will appear on your profile.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                First Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider">
                  Date of Birth (18+)
                </label>
                <span className="text-[11px] text-neutral-400">
                  Age: {calculateAge(birthdate)} yrs
                </span>
              </div>
              <input
                type="date"
                value={birthdate}
                max="2008-01-01"
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-rose-500"
              />
              <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>Verified age helps keep our community authentic and secure.</span>
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                I identify as
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['woman', 'man', 'nonbinary'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all ${
                      gender === g
                        ? 'bg-rose-50 border-rose-500 text-rose-700 font-semibold'
                        : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                Looking to meet
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['men', 'women', 'everyone'] as MatchPreference[]).map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => setMatchPref(pref)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all ${
                      matchPref === pref
                        ? 'bg-rose-50 border-rose-500 text-rose-700 font-semibold'
                        : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: About & Location */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-neutral-900">
                Your rhythm & craft
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Tell potential partners what brings you purpose.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                Occupation / Passion
              </label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. Architectural Designer"
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                Studio, Company, or Neighborhood
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Studio Terra / Pacific Heights"
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                Your Romantic Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Share your quirks, what kind of conversations you crave, or your favorite small moments in life..."
                className="w-full p-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            {/* Date Mood Selector (Current dating intent) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Current Date Mood</span>
                  <span className="text-rose-600 font-mono font-normal lowercase">(dating intent)</span>
                </label>
                <span className="text-[10px] text-rose-700 font-medium bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  {selectedDateMood.emoji} {selectedDateMood.label}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mb-2">
                Choose the vibe for your dates right now (e.g., Coffee dates, Adventurous, Quiet nights):
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar p-0.5">
                {DATE_MOOD_OPTIONS.map((mood) => {
                  const isSelected = selectedDateMood.id === mood.id;
                  return (
                    <button
                      key={mood.id}
                      type="button"
                      onClick={() => setSelectedDateMood(mood)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 active:scale-[0.98] ${
                        isSelected
                          ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-500 text-rose-950 font-medium shadow-2xs'
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

            {/* Location Permission Request */}
            <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-neutral-900">
                    Neighborhood Location
                  </h4>
                  <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                    We only use city-level distance to recommend nearby matches. We never track or expose your exact address.
                  </p>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-800">
                      {locationName}
                    </span>
                    <button
                      type="button"
                      onClick={handleRequestLocation}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                        locationGranted
                          ? 'bg-emerald-100 text-emerald-800 flex items-center gap-1'
                          : 'bg-rose-600 text-white hover:bg-rose-700'
                      }`}
                    >
                      {locationGranted ? (
                        <>
                          <Check size={12} />
                          <span>Enabled</span>
                        </>
                      ) : (
                        <span>Enable Location</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Photo & Prompts */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-neutral-900">
                Put your heart forward
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Choose a warm portrait and spark ideas for your first note.
              </p>
            </div>

            {/* Photo Selection */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-2">
                Primary Profile Photo
              </label>

              <div className="flex items-center gap-4">
                <div className="w-20 h-24 rounded-2xl overflow-hidden border-2 border-rose-500 shadow-md">
                  <AvatarImage
                    src={selectedPhoto}
                    alt="My profile preview"
                    fallbackName={name || 'My Photo'}
                    className="w-full h-full"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-neutral-800 hover:bg-neutral-50 cursor-pointer shadow-xs">
                    <Camera size={14} className="text-rose-600" />
                    <span>Upload Custom Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-neutral-400">
                    Or select from curated demo avatars:
                  </p>
                  <div className="flex gap-2">
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedPhoto(url)}
                        className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-transform active:scale-95 ${
                          selectedPhoto === url ? 'border-rose-600 scale-105' : 'border-neutral-200'
                        }`}
                      >
                        <img src={url} alt="Preset avatar" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                Soul Prompt: &ldquo;My ideal Sunday looks like&rdquo;
              </label>
              <textarea
                value={promptAnswer}
                onChange={(e) => setPromptAnswer(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            {/* Interests Tag Cloud */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider">
                  Select 3–6 Passions
                </label>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {selectedInterests.length}/6 selected
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                {AVAILABLE_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`text-xs px-2.5 py-1 rounded-lg transition-colors border ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-600 font-medium'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="pt-4">
        <button
          onClick={handleNextStep}
          className="w-full h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-2"
        >
          <span>{step === 3 ? 'Complete Profile & Enter VYBE' : 'Next Step'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
