import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { VoiceVibe } from '../../types';
import { VoiceVibeService } from '../../services/voiceVibeService';

interface VoiceVibeRecorderModalProps {
  onClose: () => void;
  onSaveVoiceVibe: (voiceVibe: VoiceVibe) => void;
}

const PRESET_PROMPTS = [
  'A tiny snippet of my natural speaking voice',
  'What my laugh sounds like on a Sunday afternoon',
  'Pronouncing my favorite book or secret travel place',
  'A warm good morning thought to the right soul',
];

export const VoiceVibeRecorderModal: React.FC<VoiceVibeRecorderModalProps> = ({
  onClose,
  onSaveVoiceVibe,
}) => {
  const voiceService = VoiceVibeService.getInstance();
  const [selectedPrompt, setSelectedPrompt] = useState(PRESET_PROMPTS[0]);
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [customPromptText, setCustomPromptText] = useState('');

  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [duration, setDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      voiceService.cancelRecording();
      if (audioPreviewRef.current) audioPreviewRef.current.pause();
    };
  }, [voiceService]);

  const handleStartRecording = async () => {
    setErrorMessage(null);
    const res = await voiceService.startRecording();
    if (!res.success) {
      setErrorMessage(res.error || 'Microphone unavailable.');
      return;
    }

    setRecordingState('recording');
    setDuration(0);
    timerRef.current = setInterval(() => {
      setDuration((prev) => {
        if (prev >= 29) {
          handleStopRecording();
          return 30;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      const result = await voiceService.stopRecording();
      setRecordedAudioUrl(result.audioUrl);
      setRecordingState('recorded');
    } catch {
      setErrorMessage('Recording could not be finalized.');
      setRecordingState('idle');
    }
  };

  const handleTogglePreview = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingPreview) {
      audioPreviewRef.current?.pause();
      setIsPlayingPreview(false);
    } else {
      const audio = new Audio(recordedAudioUrl);
      audioPreviewRef.current = audio;
      audio.onended = () => setIsPlayingPreview(false);
      audio.play().catch(() => {});
      setIsPlayingPreview(true);
    }
  };

  const handleUseSimulatedVoice = () => {
    setDuration(8);
    setRecordedAudioUrl('demo_synth');
    setRecordingState('recorded');
    setErrorMessage(null);
  };

  const handleSave = () => {
    const finalPrompt = isCustomPrompt && customPromptText.trim() ? customPromptText.trim() : selectedPrompt;
    const newVibe: VoiceVibe = {
      id: `voice_${Date.now()}`,
      prompt: finalPrompt,
      durationSeconds: Math.max(3, duration),
      audioUrl: recordedAudioUrl === 'demo_synth' ? undefined : (recordedAudioUrl || undefined),
      createdAt: 'Just now',
    };
    onSaveVoiceVibe(newVibe);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] border border-neutral-200 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Mic size={18} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm text-neutral-900 leading-tight">
                Record Voice Vibe
              </h2>
              <p className="text-[10px] text-neutral-500">Audio Chemistry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {/* Prompt Selector */}
          <div>
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider font-mono block mb-2">
              Select Your Voice Prompt
            </span>

            <div className="space-y-1.5">
              {PRESET_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setSelectedPrompt(prompt);
                    setIsCustomPrompt(false);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-colors ${
                    !isCustomPrompt && selectedPrompt === prompt
                      ? 'bg-rose-50 border-rose-500 text-rose-900 font-medium'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}

              {isCustomPrompt ? (
                <input
                  type="text"
                  value={customPromptText}
                  onChange={(e) => setCustomPromptText(e.target.value)}
                  placeholder="Enter custom prompt question..."
                  className="w-full h-10 px-3 rounded-xl bg-white border border-rose-500 text-xs text-neutral-900 focus:outline-none"
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCustomPrompt(true)}
                  className="text-xs text-rose-600 font-semibold p-1.5 hover:underline"
                >
                  + Write a custom prompt
                </button>
              )}
            </div>
          </div>

          {/* Recording Canvas / Controller */}
          <div className="p-6 bg-white rounded-3xl border border-neutral-200/80 text-center space-y-4 shadow-xs">
            {recordingState === 'idle' && (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Mic size={32} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900">
                    Up to 30 seconds
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Tap to speak naturally. Let your personality come through.
                  </p>
                </div>
                <button
                  onClick={handleStartRecording}
                  className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-md shadow-rose-600/20"
                >
                  Start Recording
                </button>
              </div>
            )}

            {recordingState === 'recording' && (
              <div className="space-y-3">
                {/* Live pulsing microphone indicator */}
                <div className="relative w-16 h-16 mx-auto rounded-full bg-rose-600 text-white flex items-center justify-center animate-pulse">
                  <Mic size={28} />
                  <span className="absolute -inset-2 rounded-full border-2 border-rose-500 animate-ping opacity-75" />
                </div>

                <div className="font-mono text-2xl font-bold text-rose-600">
                  00:{duration < 10 ? `0${duration}` : duration}
                </div>

                <p className="text-[11px] text-neutral-500">
                  Recording live microphone audio...
                </p>

                <button
                  onClick={handleStopRecording}
                  className="px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center gap-2 mx-auto transition-colors"
                >
                  <Square size={14} className="fill-white" />
                  <span>Stop & Review</span>
                </button>
              </div>
            )}

            {recordingState === 'recorded' && (
              <div className="space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <Check size={28} />
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-neutral-900">
                    Voice Note Ready ({duration}s)
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Listen to preview before publishing to your profile.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleTogglePreview}
                    className="px-4 py-2 rounded-full bg-rose-50 text-rose-700 font-semibold text-xs border border-rose-200 flex items-center gap-1.5"
                  >
                    {isPlayingPreview ? <Pause size={14} /> : <Play size={14} />}
                    <span>{isPlayingPreview ? 'Pause' : 'Preview Note'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setRecordingState('idle');
                      setRecordedAudioUrl(null);
                    }}
                    className="px-3 py-2 rounded-full bg-neutral-100 text-neutral-600 hover:text-rose-600 font-semibold text-xs flex items-center gap-1.5"
                  >
                    <Trash2 size={13} />
                    <span>Re-record</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Error / Fallback notice */}
          {errorMessage && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Browser Microphone Notice</span>
                  <span>{errorMessage}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleUseSimulatedVoice}
                className="w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] transition-colors"
              >
                Use Sample Harmonic Voice Note
              </button>
            </div>
          )}

          {/* Save CTA */}
          {recordingState === 'recorded' && (
            <button
              onClick={handleSave}
              className="w-full h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/20"
            >
              <Check size={16} />
              <span>Add Voice Vibe to My Profile</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
