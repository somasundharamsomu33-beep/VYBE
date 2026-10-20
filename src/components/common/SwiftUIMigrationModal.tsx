import React from 'react';
import { X, Smartphone, Layers, Bell, Shield, KeyRound, Sparkles, Code2 } from 'lucide-react';

interface SwiftUIMigrationModalProps {
  onClose: () => void;
}

export const SwiftUIMigrationModal: React.FC<SwiftUIMigrationModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-xl rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <Smartphone size={18} />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-lg text-neutral-900 leading-tight">
                SwiftUI & Native iOS Roadmap
              </h3>
              <p className="text-xs text-neutral-500">Architecture migration & Apple frameworks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200/60 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notice */}
        <div className="bg-rose-50/80 px-6 py-3 border-b border-rose-100 text-xs text-rose-950 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            <strong>Prototype Disclaimer:</strong> This React prototype validates UX and ergonomics. The production iOS client will be built in pure SwiftUI.
          </span>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-700 font-sans">
          {/* Section 1: SwiftUI Component Mappings */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-neutral-900 font-semibold">
              <Layers className="w-4 h-4 text-rose-600" />
              <span>React Components to SwiftUI Architecture</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-neutral-200/70">
                <p className="font-semibold text-neutral-900">Discover Card Deck</p>
                <p className="text-neutral-500 mt-1">`DiscoverScreen.tsx`</p>
                <p className="text-rose-600 font-mono mt-1">→ `TabView` with `.page` or custom `DragGesture` CardStack</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-neutral-200/70">
                <p className="font-semibold text-neutral-900">Bottom Navigation</p>
                <p className="text-neutral-500 mt-1">`BottomTabBar.tsx`</p>
                <p className="text-rose-600 font-mono mt-1">→ Native `TabView` with `.tabItem` & `Image(systemName:)`</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-neutral-200/70">
                <p className="font-semibold text-neutral-900">Chat Bubble View</p>
                <p className="text-neutral-500 mt-1">`ChatScreen.tsx`</p>
                <p className="text-rose-600 font-mono mt-1">→ `ScrollViewReader` with inverted `LazyVStack`</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-neutral-200/70">
                <p className="font-semibold text-neutral-900">Match Celebration Modal</p>
                <p className="text-neutral-500 mt-1">`MatchCelebrationModal.tsx`</p>
                <p className="text-rose-600 font-mono mt-1">→ `.fullScreenCover` + `CoreHaptics` trigger</p>
              </div>
            </div>
          </div>

          {/* Section 2: Native iOS-Only Implementations */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-neutral-900 font-semibold">
              <Code2 className="w-4 h-4 text-rose-600" />
              <span>Features Requiring Native iOS Frameworks</span>
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-neutral-200/70">
                <KeyRound className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900">Sign in with Apple (AuthenticationServices):</strong> Mandatory for App Store guideline 4.8. Handles Face ID / Touch ID one-tap credential verification.
                </div>
              </li>
              <li className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-neutral-200/70">
                <Bell className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900">APNs Push Notifications (UserNotifications):</strong> Delivers instant alerts when a mutual match occurs or a new chat message arrives.
                </div>
              </li>
              <li className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-neutral-200/70">
                <Smartphone className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900">WidgetKit & Live Activities:</strong> Shows the daily discovery quota or pending romantic sparks directly on the iPhone Lock Screen and StandBy mode.
                </div>
              </li>
              <li className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-neutral-200/70">
                <Shield className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900">CoreLocation with Reduced Accuracy:</strong> Guarantees user safety via `CLAccuracyAuthorization.reducedAccuracy` so only neighborhood-level distance is obtained.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
