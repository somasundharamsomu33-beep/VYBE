export class VoiceVibeService {
  private static instance: VoiceVibeService;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;

  public static getInstance(): VoiceVibeService {
    if (!VoiceVibeService.instance) {
      VoiceVibeService.instance = new VoiceVibeService();
    }
    return VoiceVibeService.instance;
  }

  public isMediaRecordingSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices &&
      typeof MediaRecorder !== 'undefined'
    );
  }

  public async startRecording(): Promise<{ success: boolean; error?: string }> {
    if (!this.isMediaRecordingSupported()) {
      return {
        success: false,
        error: 'Microphone recording is not supported in this browser environment.',
      };
    }

    try {
      this.audioChunks = [];
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      return { success: true };
    } catch (err: any) {
      console.warn('Microphone access denied or error:', err);
      return {
        success: false,
        error:
          err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
            ? 'Microphone permission was not granted. You can still test with a simulated voice note.'
            : 'Unable to access microphone: ' + (err.message || 'unknown error'),
      };
    }
  }

  public stopRecording(): Promise<{ audioUrl: string; durationSeconds: number }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Stop all tracks
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
          this.stream = null;
        }

        resolve({
          audioUrl,
          durationSeconds: Math.max(3, Math.round(audioBlob.size / 16000)),
        });
      };

      this.mediaRecorder.stop();
    });
  }

  public cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {
        // ignore
      }
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.audioChunks = [];
  }

  /**
   * Plays a pleasant harmonic voice-note chime for demo/simulated profiles using Web Audio API
   */
  public playSynthesizedPreview(onEnded?: () => void): () => void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        onEnded?.();
        return () => {};
      }

      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Warm acoustic triad chord progression simulating voice resonance
      const notes = [220, 277.18, 329.63, 440]; // A major 9
      const oscillators: OscillatorNode[] = [];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12 / (idx + 1), now + idx * 0.18 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.18);
        osc.stop(now + 3.4);
        oscillators.push(osc);
      });

      const timer = setTimeout(() => {
        ctx.close().catch(() => {});
        onEnded?.();
      }, 3500);

      return () => {
        clearTimeout(timer);
        oscillators.forEach((o) => {
          try {
            o.stop();
          } catch {
            // ignore
          }
        });
        ctx.close().catch(() => {});
      };
    } catch {
      onEnded?.();
      return () => {};
    }
  }
}
