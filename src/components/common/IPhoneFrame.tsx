import React, { useState } from 'react';
import { IOSStatusBar } from './IOSStatusBar';
import { IOSHomeIndicator } from './IOSHomeIndicator';
import { Smartphone, Monitor, Code2, Sparkles } from 'lucide-react';

interface IPhoneFrameProps {
  children: React.ReactNode;
  onOpenSwiftUISpec: () => void;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children, onOpenSwiftUISpec }) => {
  const [deviceMode, setDeviceMode] = useState<'iphone' | 'fluid'>('iphone');

  return (
    <div className="min-h-screen w-full bg-[#121115] text-neutral-100 flex flex-col items-center justify-center p-0 md:p-6 overflow-x-hidden">
      {/* Desktop Top Control Bar */}
      <div className="hidden md:flex items-center justify-between w-full max-w-5xl mb-4 px-4 py-2 bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-neutral-800 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium">
            <Sparkles size={14} />
            <span>VYBE · SoulSync</span>
          </div>
          <span className="text-neutral-400">iOS Design Prototype</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport switcher */}
          <div className="flex items-center bg-neutral-800/80 p-0.5 rounded-xl border border-neutral-700/60">
            <button
              onClick={() => setDeviceMode('iphone')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                deviceMode === 'iphone'
                  ? 'bg-neutral-700 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Smartphone size={13} />
              <span>iPhone 16 Pro</span>
            </button>
            <button
              onClick={() => setDeviceMode('fluid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                deviceMode === 'fluid'
                  ? 'bg-neutral-700 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Monitor size={13} />
              <span>Fluid Preview</span>
            </button>
          </div>

          <button
            onClick={onOpenSwiftUISpec}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors border border-neutral-700"
          >
            <Code2 size={13} className="text-rose-400" />
            <span>SwiftUI Spec</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 flex items-center justify-center ${
          deviceMode === 'iphone' ? 'max-w-[412px]' : 'max-w-2xl'
        }`}
      >
        {/* iPhone Chassis on Desktop */}
        <div
          className={`relative w-full bg-[#FAF8F5] text-neutral-900 overflow-hidden flex flex-col shadow-2xl transition-all duration-300 ${
            deviceMode === 'iphone'
              ? 'md:rounded-[52px] md:border-[10px] md:border-[#2C2B30] md:ring-1 md:ring-neutral-700/60 md:h-[860px]'
              : 'md:rounded-3xl md:border md:border-neutral-800 md:h-[860px]'
          } h-[100dvh]`}
        >
          {/* Hardware buttons on chassis (aesthetic realism on desktop) */}
          {deviceMode === 'iphone' && (
            <>
              {/* Left Volume Up/Down and Action Button */}
              <div className="hidden md:block absolute -left-[14px] top-28 w-[4px] h-8 bg-[#3E3D44] rounded-l-sm" />
              <div className="hidden md:block absolute -left-[14px] top-42 w-[4px] h-12 bg-[#3E3D44] rounded-l-sm" />
              <div className="hidden md:block absolute -left-[14px] top-58 w-[4px] h-12 bg-[#3E3D44] rounded-l-sm" />
              {/* Right Side Power Button */}
              <div className="hidden md:block absolute -right-[14px] top-40 w-[4px] h-16 bg-[#3E3D44] rounded-r-sm" />
            </>
          )}

          {/* iOS Top Status Bar with Dynamic Island */}
          <IOSStatusBar />

          {/* Screen Content Container */}
          <div className="flex-1 w-full flex flex-col overflow-hidden relative">
            {children}
          </div>

          {/* iOS Bottom Home Indicator Bar */}
          <IOSHomeIndicator />
        </div>
      </div>
    </div>
  );
};
