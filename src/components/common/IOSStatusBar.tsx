import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

interface IOSStatusBarProps {
  dark?: boolean;
}

export const IOSStatusBar: React.FC<IOSStatusBarProps> = ({ dark = false }) => {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      // 12-hour or standard format
      const formatted = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes}`;
      setTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const textColor = dark ? 'text-white' : 'text-neutral-900';

  return (
    <div
      className={`w-full h-11 shrink-0 flex items-center justify-between px-7 select-none z-50 pointer-events-none ${textColor}`}
    >
      {/* Time */}
      <span className="text-[14px] font-semibold tracking-tight w-14 text-left">
        {time}
      </span>

      {/* Dynamic Island pill */}
      <div className="h-6 w-28 bg-black rounded-full flex items-center justify-between px-3 pointer-events-auto shadow-sm">
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800" />
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-950 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1e293b]" />
        </div>
      </div>

      {/* Signal, WiFi, Battery */}
      <div className="flex items-center gap-1.5 w-14 justify-end">
        {/* Cellular Signal 4 bars */}
        <div className="flex items-end gap-0.5 h-2.5">
          <div className="w-0.5 h-1 bg-current rounded-full" />
          <div className="w-0.5 h-1.5 bg-current rounded-full" />
          <div className="w-0.5 h-2 bg-current rounded-full" />
          <div className="w-0.5 h-2.5 bg-current rounded-full" />
        </div>

        {/* WiFi */}
        <Wifi size={13} className="stroke-[2.5]" />

        {/* Battery */}
        <div className="flex items-center gap-0.5">
          <div className="w-5 h-2.5 rounded-[4px] border border-current p-0.5 flex items-center">
            <div className="w-3.5 h-full bg-current rounded-[2px]" />
          </div>
          <div className="w-0.5 h-1 bg-current rounded-r-sm" />
        </div>
      </div>
    </div>
  );
};
