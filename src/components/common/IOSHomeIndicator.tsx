import React from 'react';

interface IOSHomeIndicatorProps {
  dark?: boolean;
}

export const IOSHomeIndicator: React.FC<IOSHomeIndicatorProps> = ({ dark = false }) => {
  return (
    <div className="w-full h-5 shrink-0 flex items-center justify-center pointer-events-none pb-1">
      <div
        className={`w-36 h-1 rounded-full transition-colors ${
          dark ? 'bg-white/40' : 'bg-neutral-900/30'
        }`}
      />
    </div>
  );
};
