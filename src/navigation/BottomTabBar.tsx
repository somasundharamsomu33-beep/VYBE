import React from 'react';
import { Compass, Flame, MessageCircle, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomTabBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  matchesCount?: number;
  unreadMessagesCount?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  matchesCount = 0,
  unreadMessagesCount = 0,
}) => {
  const tabs: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ size: number; className?: string }>;
    badge?: number;
  }> = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'matches', label: 'Matches', icon: Flame, badge: matchesCount },
    { id: 'messages', label: 'Messages', icon: MessageCircle, badge: unreadMessagesCount },
    { id: 'profile', label: 'My Soul', icon: User },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="shrink-0 w-full bg-white/90 backdrop-blur-xl border-t border-neutral-200/80 px-2 py-1.5 z-40 transition-colors"
    >
      <div className="grid grid-cols-4 items-center justify-around h-13 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-transform active:scale-95 group focus:outline-none`}
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={`transition-colors duration-150 ${
                    isActive
                      ? 'text-rose-600 stroke-[2.4]'
                      : 'text-neutral-600 group-hover:text-neutral-800 stroke-[1.8]'
                  }`}
                />

                {/* Notification Badge */}
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-rose-600 font-semibold' : 'text-neutral-600'
                }`}
              >
                {tab.label}
              </span>

              {/* iOS subtle active pill indicator */}
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-rose-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
