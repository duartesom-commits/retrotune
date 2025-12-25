
class AudioService {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  private playChime(frequencies: number[]) {
    if (this.muted) return;
    this.init();
    
    const now = this.ctx!.currentTime;
    frequencies.forEach((freq, i) => {
      const startTime = now + (i * 0.08);
      const duration = 0.2;
      
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  playCorrect() {
    // Som ascendente: C5 -> E5
    this.playChime([523.25, 659.25]);
  }

  playWrong() {
    // Som descendente: E5 -> C4 (mais grave para indicar erro)
    this.playChime([659.25, 261.63]);
  }
}

export const audioService = new AudioService();
