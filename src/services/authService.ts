import { User } from '../types';
import { INITIAL_CURRENT_USER } from '../demoData/mockProfiles';

const AUTH_STORAGE_KEY = 'vibe_soulsync_auth';

export interface AuthSession {
  isAuthenticated: boolean;
  user: User | null;
  mode: 'demo';
}

const DEFAULT_USER: User = {
  ...INITIAL_CURRENT_USER,
  email: 'alex.rivera@soulsync.app',
  phone: '+1 (415) 555-0192',
  countryCode: '+1',
  onboardingCompleted: true,
  createdAt: '2026-01-15',
  discoveryPreferences: {
    ageRange: [23, 34],
    maxDistanceMiles: 25,
    preferredGender: 'everyone',
    verifiedOnly: false,
    hasBioOnly: true,
  },
  notificationSettings: {
    pushEnabled: true,
    newMatches: true,
    messages: true,
    dailyReminder: false,
  },
  privacySettings: {
    incognitoMode: false,
    showDistance: true,
    showAge: true,
    readReceipts: true,
    blockedUsers: [],
  },
};

export class AuthService {
  private static instance: AuthService;
  private session: AuthSession;

  private constructor() {
    const cached = localStorage.getItem(AUTH_STORAGE_KEY);
    if (cached) {
      try {
        this.session = JSON.parse(cached);
      } catch {
        this.session = { isAuthenticated: true, user: DEFAULT_USER, mode: 'demo' };
      }
    } else {
      this.session = { isAuthenticated: true, user: DEFAULT_USER, mode: 'demo' };
      this.persist();
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private persist() {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.session));
    } catch (e) {
      console.warn('LocalStorage unavailable in environment', e);
    }
  }

  public getSession(): AuthSession {
    return this.session;
  }

  public async loginWithEmail(email: string, _password: string): Promise<User> {
    // Simulates network latency
    await new Promise((res) => setTimeout(res, 600));
    const user: User = {
      ...(this.session.user || DEFAULT_USER),
      email,
      onboardingCompleted: true,
    };
    this.session = { isAuthenticated: true, user, mode: 'demo' };
    this.persist();
    return user;
  }

  public async loginWithPhone(countryCode: string, phone: string): Promise<User> {
    await new Promise((res) => setTimeout(res, 600));
    const user: User = {
      ...(this.session.user || DEFAULT_USER),
      phone,
      countryCode,
      onboardingCompleted: true,
    };
    this.session = { isAuthenticated: true, user, mode: 'demo' };
    this.persist();
    return user;
  }

  public async signUpWithEmail(email: string): Promise<User> {
    await new Promise((res) => setTimeout(res, 600));
    const user: User = {
      ...DEFAULT_USER,
      email,
      onboardingCompleted: false,
    };
    this.session = { isAuthenticated: true, user, mode: 'demo' };
    this.persist();
    return user;
  }

  public async loginWithGoogle(): Promise<User> {
    await new Promise((res) => setTimeout(res, 600));
    const user: User = {
      ...(this.session.user || DEFAULT_USER),
      email: 'alex.rivera@gmail.com',
      onboardingCompleted: true,
    };
    this.session = { isAuthenticated: true, user, mode: 'demo' };
    this.persist();
    return user;
  }

  public logout(): void {
    this.session = { isAuthenticated: false, user: null, mode: 'demo' };
    this.persist();
  }

  public updateUser(updated: Partial<User>): User {
    if (!this.session.user) {
      this.session.user = { ...DEFAULT_USER };
    }
    this.session.user = { ...this.session.user, ...updated };
    this.persist();
    return this.session.user;
  }
}
