import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Mic, Volume2 } from 'lucide-react';
import { VoiceVibe } from '../../types';
import { VoiceVibeService } from '../../services/voiceVibeService';

interface VoiceVibePlayerProps {
  voiceVibe: VoiceVibe;
  authorName: string;
  onDelete?: () => void;
  showDelete?: boolean;
}

export const VoiceVibePlayer: React.FC<VoiceVibePlayerProps> = ({
  voiceVibe,
  authorName,
  onDelete,
  showDelete = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const stopSynthRef = useRef<(() => void) | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (stopSynthRef.current) {
        stopSynthRef.current();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlaying) {
      if (stopSynthRef.current) {
        stopSynthRef.current();
        stopSynthRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setProgress(0);
      return;
    }

    setIsPlaying(true);
    setProgress(0);

    // If real audio URL exists and starts with blob or http, use HTMLAudioElement
    if (voiceVibe.audioUrl && (voiceVibe.audioUrl.startsWith('blob:') || voiceVibe.audioUrl.startsWith('http'))) {
      const audio = new Audio(voiceVibe.audioUrl);
      audioRef.current = audio;
      audio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
      };
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };
      audio.play().catch(() => {
        fallbackToSynth();
      });
    } else {
      fallbackToSynth();
    }
  };

  const fallbackToSynth = () => {
    let current = 0;
    const interval = setInterval(() => {
      current += 3.3;
      setProgress(Math.min(100, current));
      if (current >= 100) {
        clearInterval(interval);
      }
    }, 100);

    const cleanup = VoiceVibeService.getInstance().playSynthesizedPreview(() => {
      clearInterval(interval);
      setIsPlaying(false);
      setProgress(0);
    });

    stopSynthRef.current = () => {
      clearInterval(interval);
      cleanup();
    };
  };

  // 16 stylized audio waveform heights
  const waveformHeights = [
    30, 65, 45, 80, 50, 95, 70, 40, 85, 100, 60, 75, 45, 90, 55, 35,
  ];

  return (
    <div className="p-3.5 bg-gradient-to-r from-rose-50/90 to-neutral-50 rounded-2xl border border-rose-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-800">
          <Mic size={13} className="text-rose-600" />
          <span>Voice Vibe · {voiceVibe.durationSeconds}s</span>
        </div>
        {showDelete && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-[10px] text-neutral-400 hover:text-rose-600 transition-colors"
          >
            Delete
          </button>
        )}
      </div>

      <p className="text-xs text-neutral-700 italic font-serif mb-2.5">
        &ldquo;{voiceVibe.prompt}&rdquo;
      </p>

      {/* Player Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleTogglePlay}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 shadow-sm ${
            isPlaying
              ? 'bg-rose-600 text-white scale-105'
              : 'bg-white hover:bg-neutral-100 text-rose-600 border border-neutral-200'
          }`}
          aria-label={isPlaying ? 'Pause Voice Note' : 'Play Voice Note'}
        >
          {isPlaying ? (
            <Pause size={15} className="fill-white" />
          ) : (
            <Play size={15} className="fill-rose-600 ml-0.5" />
          )}
        </button>

        {/* Waveform Visualization */}
        <div className="flex-1 flex items-center gap-0.5 h-7">
          {waveformHeights.map((h, i) => {
            const barProgress = (i / waveformHeights.length) * 100;
            const isFilled = isPlaying && progress >= barProgress;

            return (
              <div
                key={i}
                className="flex-1 rounded-full transition-all duration-150"
                style={{
                  height: `${h}%`,
                  backgroundColor: isFilled
                    ? '#e11d48'
                    : isPlaying
                    ? '#fda4af'
                    : '#e2e8f0',
                }}
              />
            );
          })}
        </div>

        <div className="text-[10px] font-mono font-medium text-neutral-500 shrink-0">
          {voiceVibe.durationSeconds}s
        </div>
      </div>
    </div>
  );
};
