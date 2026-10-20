export type Gender = 'woman' | 'man' | 'nonbinary' | 'other';
export type MatchPreference = 'women' | 'men' | 'everyone';
export type RelationshipGoal =
  | 'Long-term partner'
  | 'Casual'
  | 'Life partner'
  | 'Marriage'
  | 'Open to exploring'
  | 'New friends';

export interface PromptAnswer {
  id: string;
  question: string;
  answer: string;
}

export interface VoiceVibe {
  id: string;
  audioUrl?: string; // base64 data url or demo sound
  durationSeconds: number;
  prompt: string;
  createdAt: string;
}

export interface CommunicationPreferences {
  textingRhythm: 'Quick responder' | 'Thoughtful batch responder' | 'Slow texter' | 'Evenings only';
  callingPreference: 'Prefers audio notes' | 'Loves phone calls' | 'Prefers in-person first';
  datingPace: 'Slow & intentional' | 'Meet within a week' | 'Get to know over chat first';
  boundarySnippet?: string;
}

export interface DateProposal {
  id: string;
  venueTitle: string;
  venueType: 'Coffee & Walk' | 'Cocktails & Jazz' | 'Art & Museum' | 'Bookstore & Pastry' | 'Dinner';
  locationArea: string;
  proposedDate: string;
  proposedTime: string;
  note?: string;
  status: 'proposed' | 'accepted' | 'declined';
  senderId: string;
}

export interface SafeDateConfig {
  trustedContactName: string;
  trustedContactPhone: string;
  shareLocation: boolean;
  checkInMinutes: number;
  emergencyPin: string;
  dateVenueName?: string;
  datePartnerName?: string;
  activeCheckInExpiry?: number | null;
}

export interface DateMood {
  id: string;
  emoji: string;
  label: string;
  tagline: string;
}

export const DATE_MOOD_OPTIONS: DateMood[] = [
  {
    id: 'coffee_dates',
    emoji: '☕',
    label: 'Coffee dates',
    tagline: 'Low-key espresso walks, sunny park benches & easy morning conversation',
  },
  {
    id: 'adventurous',
    emoji: '🧗',
    label: 'Adventurous',
    tagline: 'Hiking trails, secret vistas, scenic coastal drives & spontaneous detours',
  },
  {
    id: 'quiet_nights',
    emoji: '🌙',
    label: 'Quiet nights',
    tagline: 'Dimly lit bookstores, ambient vinyl listening bars, or home-cooked dinners',
  },
  {
    id: 'cocktails_jazz',
    emoji: '🍸',
    label: 'Cocktails & Jazz',
    tagline: 'Craft speakeasies, candlelight, artisanal drinks, and live acoustics',
  },
  {
    id: 'museums_art',
    emoji: '🎨',
    label: 'Museums & Art',
    tagline: 'Gallery openings, sculpture gardens, contemporary exhibitions & indie films',
  },
  {
    id: 'foodie_crawl',
    emoji: '🍜',
    label: 'Foodie crawl',
    tagline: 'Neighborhood hole-in-the-walls, night markets, and dessert adventures',
  },
  {
    id: 'outdoor_nature',
    emoji: '🌿',
    label: 'Outdoor & Park',
    tagline: 'Botanical garden picnics, sunset bike rides, and fresh coastal air',
  },
  {
    id: 'spontaneous',
    emoji: '✨',
    label: 'Spontaneous vibe',
    tagline: 'No rigid agendas—meeting up with good energy and seeing where the city takes us',
  },
];

export interface Profile {
  id: string;
  name: string;
  age: number;
  birthdate?: string;
  gender: Gender;
  occupation: string;
  companyOrSchool?: string;
  location: string;
  distanceMiles: number;
  bio: string;
  interests: string[];
  photos: string[];
  prompts: PromptAnswer[];
  verified: boolean;
  verificationBadgeType?: 'selfie_verified' | 'id_verified' | 'community_vouched' | 'unverified';
  height?: string;
  zodiac?: string;
  drinking?: 'Never' | 'Socially' | 'Frequently';
  smoking?: 'Never' | 'Socially' | 'Regularly';
  exercise?: 'Active' | 'Sometimes' | 'Daily';
  spotifyAnthem?: {
    songTitle: string;
    artist: string;
  };
  relationshipGoal: RelationshipGoal;
  communicationPreferences?: CommunicationPreferences;
  voiceVibe?: VoiceVibe;
  dateMood?: DateMood;
}

export interface User extends Profile {
  email: string;
  phone?: string;
  countryCode?: string;
  onboardingCompleted: boolean;
  createdAt: string;
  discoveryPreferences: DiscoveryPreferences;
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
  safeDateConfig?: SafeDateConfig;
}

export interface DiscoveryPreferences {
  ageRange: [number, number];
  maxDistanceMiles: number;
  preferredGender: MatchPreference;
  verifiedOnly: boolean;
  hasBioOnly: boolean;
  relationshipGoalFilter?: RelationshipGoal | 'All';
}

export interface NotificationSettings {
  pushEnabled: boolean;
  newMatches: boolean;
  messages: boolean;
  dailyReminder: boolean;
}

export interface PrivacySettings {
  incognitoMode: boolean;
  showDistance: boolean;
  showAge: boolean;
  readReceipts: boolean;
  blockedUsers: string[];
}

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  createdAt: string;
  isSuperLike?: boolean;
}

export interface Match {
  id: string;
  users: [string, string];
  matchedProfile: Profile;
  createdAt: string;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCount: number;
  isSuperLike?: boolean;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  dateProposal?: DateProposal;
}

export interface Conversation {
  matchId: string;
  partner: Profile;
  messages: Message[];
}

export type ActiveTab = 'discover' | 'matches' | 'messages' | 'profile';
