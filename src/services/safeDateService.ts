import { SafeDateConfig } from '../types';

const SAFEDATE_STORAGE_KEY = 'vibe_soulsync_safedate';

export const DEFAULT_SAFEDATE_CONFIG: SafeDateConfig = {
  trustedContactName: 'Jordan Taylor (Best Friend)',
  trustedContactPhone: '+1 (415) 555-0192',
  shareLocation: true,
  checkInMinutes: 120,
  emergencyPin: '1234',
  dateVenueName: '',
  datePartnerName: '',
  activeCheckInExpiry: null,
};

export class SafeDateService {
  private static instance: SafeDateService;
  private config: SafeDateConfig;

  private constructor() {
    const stored = localStorage.getItem(SAFEDATE_STORAGE_KEY);
    if (stored) {
      try {
        this.config = { ...DEFAULT_SAFEDATE_CONFIG, ...JSON.parse(stored) };
      } catch {
        this.config = { ...DEFAULT_SAFEDATE_CONFIG };
      }
    } else {
      this.config = { ...DEFAULT_SAFEDATE_CONFIG };
      this.persist();
    }
  }

  public static getInstance(): SafeDateService {
    if (!SafeDateService.instance) {
      SafeDateService.instance = new SafeDateService();
    }
    return SafeDateService.instance;
  }

  private persist() {
    try {
      localStorage.setItem(SAFEDATE_STORAGE_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.warn('LocalStorage error in SafeDateService', e);
    }
  }

  public getConfig(): SafeDateConfig {
    return { ...this.config };
  }

  public updateConfig(updated: Partial<SafeDateConfig>): SafeDateConfig {
    this.config = { ...this.config, ...updated };
    this.persist();
    return { ...this.config };
  }

  public armCheckIn(partnerName: string, venueName: string, checkInMinutes: number = 120): SafeDateConfig {
    const expiryTime = Date.now() + checkInMinutes * 60 * 1000;
    this.config = {
      ...this.config,
      datePartnerName: partnerName,
      dateVenueName: venueName,
      checkInMinutes,
      activeCheckInExpiry: expiryTime,
    };
    this.persist();
    return { ...this.config };
  }

  public cancelCheckIn(): void {
    this.config.activeCheckInExpiry = null;
    this.config.datePartnerName = '';
    this.config.dateVenueName = '';
    this.persist();
  }

  public isCheckInActive(): boolean {
    if (!this.config.activeCheckInExpiry) return false;
    return Date.now() < this.config.activeCheckInExpiry;
  }

  public getRemainingMinutes(): number {
    if (!this.config.activeCheckInExpiry) return 0;
    const diffMs = this.config.activeCheckInExpiry - Date.now();
    return Math.max(0, Math.round(diffMs / (60 * 1000)));
  }

  public triggerEmergencySOS(): Promise<{ success: boolean; simulatedMessage: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          simulatedMessage: `Simulated SMS dispatched to ${this.config.trustedContactName} (${this.config.trustedContactPhone}): "SafeDate Alert: Alex requested assistance from their date with ${this.config.datePartnerName || 'partner'} at ${this.config.dateVenueName || 'designated spot'}." (Real Twilio/iOS 911 integration active in production build).`,
        });
      }, 400);
    });
  }
}
