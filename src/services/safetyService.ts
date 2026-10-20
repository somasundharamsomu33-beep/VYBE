export interface ReportReportPayload {
  targetUserId: string;
  reason: 'inappropriate_photos' | 'harassment' | 'spam_bot' | 'underage' | 'other';
  details?: string;
}

const SAFETY_STORAGE_KEY = 'vibe_soulsync_blocked_users';

export class SafetyService {
  private static instance: SafetyService;
  private blockedIds: string[] = [];

  private constructor() {
    const stored = localStorage.getItem(SAFETY_STORAGE_KEY);
    if (stored) {
      try {
        this.blockedIds = JSON.parse(stored);
      } catch {
        this.blockedIds = [];
      }
    }
  }

  public static getInstance(): SafetyService {
    if (!SafetyService.instance) {
      SafetyService.instance = new SafetyService();
    }
    return SafetyService.instance;
  }

  private persist() {
    try {
      localStorage.setItem(SAFETY_STORAGE_KEY, JSON.stringify(this.blockedIds));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }

  public getBlockedUserIds(): string[] {
    return this.blockedIds;
  }

  public blockUser(userId: string): void {
    if (!this.blockedIds.includes(userId)) {
      this.blockedIds.push(userId);
      this.persist();
    }
  }

  public unblockUser(userId: string): void {
    this.blockedIds = this.blockedIds.filter((id) => id !== userId);
    this.persist();
  }

  public reportUser(payload: ReportReportPayload): Promise<{ success: boolean; message: string }> {
    // In production, sends encrypted report ticket to safety moderation queue
    this.blockUser(payload.targetUserId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Report received. This profile has been blocked and our Trust & Safety team will review.',
        });
      }, 500);
    });
  }

  public deleteAccount(): Promise<boolean> {
    return new Promise((resolve) => {
      localStorage.clear();
      resolve(true);
    });
  }
}
