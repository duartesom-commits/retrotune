
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

  playCorrect() {
    if (this.muted) return;
    this.init();
    
    // Criar um som de "blip-blup" mais suave usando ondas triangulares
    const playNote = (freq: number, start: number, duration: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.1, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.start(start);
      osc.stop(start + duration);
    };

    const now = this.ctx!.currentTime;
    playNote(523.25, now, 0.15); // C5
    playNote(659.25, now + 0.08, 0.2); // E5
  }

  playWrong() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    
    // Som de erro mais grave e curto
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx!.currentTime);
    osc.frequency.linearRampToValueAtTime(60, this.ctx!.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.08, this.ctx!.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx!.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.2);
  }
}

export const audioService = new AudioService();
