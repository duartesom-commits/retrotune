
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

  private playChime(frequencies: number[], type: OscillatorType = 'triangle', volume: number = 0.08) {
    if (this.muted) return;
    this.init();
    
    const now = this.ctx!.currentTime;
    frequencies.forEach((freq, i) => {
      const startTime = now + (i * 0.1);
      const duration = 0.3;
      
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  playCorrect() {
    // Som ascendente alegre: C5 -> G5
    this.playChime([523.25, 783.99], 'triangle');
  }

  playWrong() {
    // Som descendente musical: C5 -> G4 (523.25Hz -> 392.00Hz)
    // Mais audível e perceptível que o tom sub-grave anterior
    this.playChime([523.25, 392.00], 'triangle');
  }
}

export const audioService = new AudioService();
