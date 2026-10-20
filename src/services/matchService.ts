import { Match, Profile } from '../types';
import { INITIAL_MATCHES, MOCK_DISCOVERY_PROFILES } from '../demoData/mockProfiles';

const MATCHES_STORAGE_KEY = 'vibe_soulsync_matches';
const DISCOVERY_INDEX_KEY = 'vibe_soulsync_discovery_index';
const DAILY_LIMIT_KEY = 'vibe_soulsync_daily_swipes';

export const DAILY_SWIPE_LIMIT = 20;
export const DAILY_SUPER_LIKE_LIMIT = 3;
const DAILY_SUPER_LIKES_KEY = 'vibe_soulsync_daily_super_likes';

export interface DailyLimitStatus {
  swipesUsedToday: number;
  remainingSwipes: number;
  limit: number;
}

export const MAX_SWIPE_HISTORY = 5;

export interface HistoryAction {
  id: string;
  type: 'pass' | 'like' | 'superlike';
  profile: Profile;
  createdMatchId?: string;
  timestamp: string;
}

export class MatchService {
  private static instance: MatchService;
  private matches: Match[];
  private discoveryQueue: Profile[];
  private currentIndex: number = 0;
  private swipesUsedToday: number = 0;
  private superLikesUsedToday: number = 0;
  private actionHistory: HistoryAction[] = [];
  private goalFilter: import('../types').RelationshipGoal | 'All' = 'All';
  private verifiedFilter: boolean = false;

  private constructor() {
    // Load matches
    const storedMatches = localStorage.getItem(MATCHES_STORAGE_KEY);
    if (storedMatches) {
      try {
        this.matches = JSON.parse(storedMatches);
      } catch {
        this.matches = [...INITIAL_MATCHES];
      }
    } else {
      this.matches = [...INITIAL_MATCHES];
      this.persistMatches();
    }

    // Load discovery queue
    this.discoveryQueue = [...MOCK_DISCOVERY_PROFILES];

    // Load index
    const storedIndex = localStorage.getItem(DISCOVERY_INDEX_KEY);
    if (storedIndex) {
      this.currentIndex = parseInt(storedIndex, 10) || 0;
    }

    // Load daily swipes
    const storedDaily = localStorage.getItem(DAILY_LIMIT_KEY);
    if (storedDaily) {
      try {
        const parsed = JSON.parse(storedDaily);
        const todayStr = new Date().toISOString().split('T')[0];
        if (parsed.date === todayStr) {
          this.swipesUsedToday = parsed.count || 0;
        } else {
          this.swipesUsedToday = 0;
          this.persistDaily();
        }
      } catch {
        this.swipesUsedToday = 0;
      }
    }

    // Load daily super likes
    const storedSuperLikes = localStorage.getItem(DAILY_SUPER_LIKES_KEY);
    if (storedSuperLikes) {
      try {
        const parsed = JSON.parse(storedSuperLikes);
        const todayStr = new Date().toISOString().split('T')[0];
        if (parsed.date === todayStr) {
          this.superLikesUsedToday = parsed.count || 0;
        } else {
          this.superLikesUsedToday = 0;
          this.persistSuperLikes();
        }
      } catch {
        this.superLikesUsedToday = 0;
      }
    }
  }

  public static getInstance(): MatchService {
    if (!MatchService.instance) {
      MatchService.instance = new MatchService();
    }
    return MatchService.instance;
  }

  private persistMatches() {
    try {
      localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(this.matches));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }

  private persistDiscoveryIndex() {
    try {
      localStorage.setItem(DISCOVERY_INDEX_KEY, this.currentIndex.toString());
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }

  private persistDaily() {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem(
        DAILY_LIMIT_KEY,
        JSON.stringify({ date: todayStr, count: this.swipesUsedToday })
      );
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }

  private persistSuperLikes() {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem(
        DAILY_SUPER_LIKES_KEY,
        JSON.stringify({ date: todayStr, count: this.superLikesUsedToday })
      );
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }

  public getDailyLimitStatus(): DailyLimitStatus {
    return {
      swipesUsedToday: this.swipesUsedToday,
      remainingSwipes: Math.max(0, DAILY_SWIPE_LIMIT - this.swipesUsedToday),
      limit: DAILY_SWIPE_LIMIT,
    };
  }

  public getSuperLikeStatus(): {
    used: number;
    remaining: number;
    limit: number;
  } {
    return {
      used: this.superLikesUsedToday,
      remaining: Math.max(0, DAILY_SUPER_LIKE_LIMIT - this.superLikesUsedToday),
      limit: DAILY_SUPER_LIKE_LIMIT,
    };
  }

  public getGoalFilter(): import('../types').RelationshipGoal | 'All' {
    return this.goalFilter;
  }

  public setGoalFilter(goal: import('../types').RelationshipGoal | 'All') {
    this.goalFilter = goal;
    this.currentIndex = 0;
    this.persistDiscoveryIndex();
  }

  public getVerifiedFilter(): boolean {
    return this.verifiedFilter;
  }

  public setVerifiedFilter(verifiedOnly: boolean) {
    this.verifiedFilter = verifiedOnly;
    this.currentIndex = 0;
    this.persistDiscoveryIndex();
  }

  public getFilteredQueue(): Profile[] {
    return this.discoveryQueue.filter((p) => {
      if (this.verifiedFilter && !p.verified) {
        return false;
      }
      if (this.goalFilter !== 'All' && p.relationshipGoal !== this.goalFilter) {
        return false;
      }
      return true;
    });
  }

  public getCurrentProfile(): Profile | null {
    const queue = this.getFilteredQueue();
    if (this.currentIndex >= queue.length) {
      return null;
    }
    return queue[this.currentIndex];
  }

  public getNextProfile(): Profile | null {
    const queue = this.getFilteredQueue();
    if (this.currentIndex + 1 >= queue.length) {
      return null;
    }
    return queue[this.currentIndex + 1];
  }

  public getRemainingCount(): number {
    const queue = this.getFilteredQueue();
    return Math.max(0, queue.length - this.currentIndex);
  }

  public passCurrent(): { success: boolean; nextProfile: Profile | null } {
    const current = this.getCurrentProfile();
    if (current) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.actionHistory.push({
        id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: 'pass',
        profile: current,
        timestamp: timeStr,
      });
      if (this.actionHistory.length > MAX_SWIPE_HISTORY) {
        this.actionHistory.shift();
      }
    }
    this.swipesUsedToday += 1;
    this.persistDaily();
    this.currentIndex += 1;
    this.persistDiscoveryIndex();
    return {
      success: true,
      nextProfile: this.getCurrentProfile(),
    };
  }

  public likeCurrent(isSuperLike: boolean = false): {
    isMatch: boolean;
    matchedProfile: Profile | null;
    match: Match | null;
    nextProfile: Profile | null;
    error?: string;
  } {
    const current = this.getCurrentProfile();
    if (!current) {
      return { isMatch: false, matchedProfile: null, match: null, nextProfile: null };
    }

    if (isSuperLike) {
      if (this.superLikesUsedToday >= DAILY_SUPER_LIKE_LIMIT) {
        return {
          isMatch: false,
          matchedProfile: null,
          match: null,
          nextProfile: current,
          error: 'super_like_limit_reached',
        };
      }
      this.superLikesUsedToday += 1;
      this.persistSuperLikes();
    }

    this.swipesUsedToday += 1;
    this.persistDaily();

    // Mutual match logic: In our demo, liking triggers a mutual spark
    const isMutualMatch = isSuperLike || true;
    let createdMatch: Match | null = null;

    if (isMutualMatch) {
      // Check if match already exists
      const existing = this.matches.find((m) => m.matchedProfile.id === current.id);
      if (!existing) {
        createdMatch = {
          id: `match_${current.id}_${Date.now()}`,
          users: ['user_current', current.id],
          matchedProfile: current,
          createdAt: 'Just now',
          lastMessage: isSuperLike
            ? '★ Sent a Super Like! You caught each other’s eye.'
            : 'You both felt the spark! Say hello.',
          lastMessageTimestamp: 'Just now',
          unreadCount: 1,
          isSuperLike: isSuperLike,
        };
        this.matches.unshift(createdMatch);
        this.persistMatches();
      } else {
        createdMatch = existing;
      }
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.actionHistory.push({
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: isSuperLike ? 'superlike' : 'like',
      profile: current,
      createdMatchId: createdMatch?.id,
      timestamp: timeStr,
    });
    if (this.actionHistory.length > MAX_SWIPE_HISTORY) {
      this.actionHistory.shift();
    }

    this.currentIndex += 1;
    this.persistDiscoveryIndex();

    return {
      isMatch: isMutualMatch,
      matchedProfile: current,
      match: createdMatch,
      nextProfile: this.getCurrentProfile(),
    };
  }

  public canUndo(): boolean {
    return this.actionHistory.length > 0 && this.currentIndex > 0;
  }

  public getActionHistory(): HistoryAction[] {
    return [...this.actionHistory];
  }

  public getLastAction(): HistoryAction | null {
    return this.actionHistory[this.actionHistory.length - 1] || null;
  }

  public undoLastAction(): {
    success: boolean;
    restoredProfile: Profile | null;
    undoneAction: HistoryAction | null;
    remainingHistoryCount: number;
  } {
    if (!this.canUndo()) {
      return { success: false, restoredProfile: null, undoneAction: null, remainingHistoryCount: 0 };
    }

    const lastAction = this.actionHistory.pop()!;
    this.currentIndex = Math.max(0, this.currentIndex - 1);
    this.persistDiscoveryIndex();

    if (this.swipesUsedToday > 0) {
      this.swipesUsedToday -= 1;
      this.persistDaily();
    }

    if (lastAction.type === 'superlike' && this.superLikesUsedToday > 0) {
      this.superLikesUsedToday -= 1;
      this.persistSuperLikes();
    }

    // If a match was created by this action, revert the match
    if (lastAction.createdMatchId) {
      this.matches = this.matches.filter((m) => m.id !== lastAction.createdMatchId);
      this.persistMatches();
    }

    return {
      success: true,
      restoredProfile: this.getCurrentProfile(),
      undoneAction: lastAction,
      remainingHistoryCount: this.actionHistory.length,
    };
  }

  public getMatches(): Match[] {
    return this.matches;
  }

  public unmatch(matchId: string): void {
    this.matches = this.matches.filter((m) => m.id !== matchId);
    this.persistMatches();
  }

  public resetDiscoveryQueue(): void {
    this.currentIndex = 0;
    this.persistDiscoveryIndex();
  }

  public updateLastMessage(matchId: string, message: string): void {
    const match = this.matches.find((m) => m.id === matchId);
    if (match) {
      match.lastMessage = message;
      match.lastMessageTimestamp = 'Just now';
      this.persistMatches();
    }
  }
}
