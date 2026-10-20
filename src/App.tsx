/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, Match, Profile, User } from './types';
import { AuthService } from './services/authService';
import { MatchService } from './services/matchService';
import { ChatService } from './services/chatService';

// Layout & Common
import { IPhoneFrame } from './components/common/IPhoneFrame';
import { BottomTabBar } from './navigation/BottomTabBar';
import { LegalModal } from './components/common/LegalModal';
import { SwiftUIMigrationModal } from './components/common/SwiftUIMigrationModal';
import { ReportModal } from './components/common/ReportModal';

// Screens
import { WelcomeScreen } from './screens/WelcomeScreen';
import { AuthScreen } from './screens/AuthScreen';
import { OnboardingProfileScreen } from './screens/OnboardingProfileScreen';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { MatchesScreen } from './screens/MatchesScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ProfileDetailModal } from './screens/ProfileDetailModal';
import { MatchCelebrationModal } from './screens/MatchCelebrationModal';

type AppFlow = 'welcome' | 'auth' | 'onboarding' | 'main';

export default function App() {
  const authService = AuthService.getInstance();
  const matchService = MatchService.getInstance();
  const chatService = ChatService.getInstance();

  const [session, setSession] = useState(authService.getSession());
  const [currentUser, setCurrentUser] = useState<User | null>(session.user);
  const [appFlow, setAppFlow] = useState<AppFlow>(
    session.isAuthenticated ? (session.user?.onboardingCompleted ? 'main' : 'onboarding') : 'welcome'
  );
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>('discover');

  // Active Chat State
  const [activeChatMatch, setActiveChatMatch] = useState<Match | null>(null);

  // Modals
  const [inspectingProfile, setInspectingProfile] = useState<Profile | null>(null);
  const [celebratingMatch, setCelebratingMatch] = useState<{
    profile: Profile;
    match: Match;
  } | null>(null);
  const [reportingProfile, setReportingProfile] = useState<Profile | null>(null);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);
  const [showSwiftUIRoadmap, setShowSwiftUIRoadmap] = useState(false);

  // Sync matches count and unread messages count
  const [matchesList, setMatchesList] = useState<Match[]>(matchService.getMatches());

  const refreshMatches = () => {
    setMatchesList([...matchService.getMatches()]);
  };

  useEffect(() => {
    const handleNewMsg = () => {
      refreshMatches();
    };
    window.addEventListener('soulsync_new_message', handleNewMsg);
    return () => {
      window.removeEventListener('soulsync_new_message', handleNewMsg);
    };
  }, []);

  const totalUnreadMessages = matchesList.reduce((acc, m) => acc + (m.unreadCount || 0), 0);

  // Auth actions
  const handleAuthSuccess = (isNewUser: boolean) => {
    const freshSession = authService.getSession();
    setSession(freshSession);
    setCurrentUser(freshSession.user);

    if (isNewUser || !freshSession.user?.onboardingCompleted) {
      setAppFlow('onboarding');
    } else {
      setAppFlow('main');
      setActiveTab('discover');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setSession(authService.getSession());
    setCurrentUser(null);
    setActiveChatMatch(null);
    setAppFlow('welcome');
  };

  const handleUpdateUser = (updated: Partial<User>) => {
    const updatedUser = authService.updateUser(updated);
    setCurrentUser({ ...updatedUser });
  };

  const handleMutualMatch = (matchedProfile: Profile, match: Match) => {
    refreshMatches();
    setCelebratingMatch({ profile: matchedProfile, match });
  };

  const handleOpenChatFromMatch = (match: Match) => {
    // Mark as read
    match.unreadCount = 0;
    setActiveChatMatch(match);
    setCelebratingMatch(null);
    setActiveTab('messages');
  };

  const handleUnmatch = (matchId: string) => {
    matchService.unmatch(matchId);
    chatService.clearConversation(matchId);
    refreshMatches();
    setActiveChatMatch(null);
  };

  return (
    <IPhoneFrame onOpenSwiftUISpec={() => setShowSwiftUIRoadmap(true)}>
      {/* 1. Welcome Screen */}
      {appFlow === 'welcome' && (
        <WelcomeScreen
          onStartSignUp={() => {
            setAuthInitialMode('signup');
            setAppFlow('auth');
          }}
          onStartLogin={() => {
            setAuthInitialMode('login');
            setAppFlow('auth');
          }}
          onExploreDemo={() => {
            handleAuthSuccess(false);
          }}
          onOpenTerms={() => setLegalModalType('terms')}
          onOpenPrivacy={() => setLegalModalType('privacy')}
        />
      )}

      {/* 2. Authentication Screen */}
      {appFlow === 'auth' && (
        <AuthScreen
          initialMode={authInitialMode}
          onSuccess={handleAuthSuccess}
          onBack={() => setAppFlow('welcome')}
        />
      )}

      {/* 3. Onboarding Profile Creation */}
      {appFlow === 'onboarding' && (
        <OnboardingProfileScreen
          onComplete={() => {
            const freshSession = authService.getSession();
            setCurrentUser(freshSession.user);
            setAppFlow('main');
            setActiveTab('discover');
          }}
          onCancel={() => setAppFlow('welcome')}
        />
      )}

      {/* 4. Main Application Experience */}
      {appFlow === 'main' && currentUser && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Active Chat Overrides Tab View when open */}
          {activeChatMatch ? (
            <ChatScreen
              match={activeChatMatch}
              currentUser={currentUser}
              onBack={() => setActiveChatMatch(null)}
              onOpenProfile={(prof) => setInspectingProfile(prof)}
              onUnmatch={handleUnmatch}
              onReport={(prof) => setReportingProfile(prof)}
            />
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Tab 1: Discover */}
              {activeTab === 'discover' && (
                <DiscoverScreen
                  currentUser={currentUser}
                  onOpenProfileDetail={(profile) => setInspectingProfile(profile)}
                  onMutualMatch={handleMutualMatch}
                  onNavigateToMatches={() => setActiveTab('matches')}
                />
              )}

              {/* Tab 2: Matches & Likes */}
              {activeTab === 'matches' && (
                <MatchesScreen
                  onSelectMatch={(match) => handleOpenChatFromMatch(match)}
                  onNavigateToDiscover={() => setActiveTab('discover')}
                />
              )}

              {/* Tab 3: Messages */}
              {activeTab === 'messages' && (
                <MatchesScreen
                  onSelectMatch={(match) => handleOpenChatFromMatch(match)}
                  onNavigateToDiscover={() => setActiveTab('discover')}
                />
              )}

              {/* Tab 4: My Profile */}
              {activeTab === 'profile' && (
                <ProfileScreen
                  currentUser={currentUser}
                  onUpdateUser={handleUpdateUser}
                  onLogout={handleLogout}
                  onOpenSwiftUIRoadmap={() => setShowSwiftUIRoadmap(true)}
                />
              )}

              {/* Bottom Navigation Tab Bar */}
              <BottomTabBar
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveChatMatch(null);
                  setActiveTab(tab);
                }}
                matchesCount={matchesList.length}
                unreadMessagesCount={totalUnreadMessages}
              />
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: Profile Detail Modal */}
      {inspectingProfile && currentUser && (
        <ProfileDetailModal
          currentUser={currentUser}
          profile={inspectingProfile}
          onClose={() => setInspectingProfile(null)}
          onLike={(profile) => {
            const res = matchService.likeCurrent();
            if (res.isMatch && res.matchedProfile && res.match) {
              handleMutualMatch(res.matchedProfile, res.match);
            }
          }}
          onPass={() => {
            matchService.passCurrent();
          }}
          onReport={(profile) => {
            setInspectingProfile(null);
            setReportingProfile(profile);
          }}
        />
      )}

      {/* MODAL 2: Mutual Match Celebration */}
      {celebratingMatch && currentUser && (
        <MatchCelebrationModal
          currentUser={currentUser}
          matchedProfile={celebratingMatch.profile}
          match={celebratingMatch.match}
          onOpenChat={(match) => handleOpenChatFromMatch(match)}
          onKeepDiscovering={() => setCelebratingMatch(null)}
        />
      )}

      {/* MODAL 3: Safety & Report Modal */}
      {reportingProfile && (
        <ReportModal
          profile={reportingProfile}
          onClose={() => setReportingProfile(null)}
          onReportCompleted={() => {
            setReportingProfile(null);
            refreshMatches();
          }}
        />
      )}

      {/* MODAL 4: Legal / Terms / Privacy */}
      {legalModalType && (
        <LegalModal
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />
      )}

      {/* MODAL 5: SwiftUI Migration Roadmap */}
      {showSwiftUIRoadmap && (
        <SwiftUIMigrationModal onClose={() => setShowSwiftUIRoadmap(false)} />
      )}
    </IPhoneFrame>
  );
}
