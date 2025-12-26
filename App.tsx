
import React, { useState, useEffect, useRef } from 'react';
import { GameState, GameConfig, PlayerScore, Category } from './types';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import Leaderboard from './components/Leaderboard';
import { audioService } from './services/audioService';

const RetroFireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
    }

    let particles: Particle[] = [];
    const colors = ['#ff0055', '#00ffcc', '#ffff00', '#ff8800', '#ff00ff', '#ffffff'];

    const createFirework = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * (canvas.height / 1.5);
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 5,
          color,
          life: 1.0
        });
      }
    };

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (Math.random() < 0.08) createFirework();

      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07;
        p.life -= 0.012;
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fillRect(Math.floor(p.x / 4) * 4, Math.floor(p.y / 4) * 4, p.size, p.size);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [lastScore, setLastScore] = useState(0);
  const [highScores, setHighScores] = useState<PlayerScore[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [gameCategory, setGameCategory] = useState<Category>('both');
  const [playedTexts, setPlayedTexts] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  useEffect(() => {
    try {
      const savedScores = localStorage.getItem('rt_scores_v2');
      if (savedScores) {
        setHighScores(JSON.parse(savedScores));
      } else {
        const oldScores = localStorage.getItem('rt_scores');
        if (oldScores) {
          const parsed = JSON.parse(oldScores).map((s: any) => ({ 
            ...s, 
            durationMinutes: Number(s.durationMinutes) || 1 
          }));
          setHighScores(parsed);
          localStorage.setItem('rt_scores_v2', JSON.stringify(parsed));
          localStorage.removeItem('rt_scores');
        }
      }

      const savedName = localStorage.getItem('rt_player_name');
      if (savedName) setPlayerName(savedName);

      const savedCategory = localStorage.getItem('rt_game_category');
      if (savedCategory) setGameCategory(savedCategory as Category);

      const savedHistory = localStorage.getItem('rt_history_texts');
      if (savedHistory) setPlayedTexts(JSON.parse(savedHistory));

      const savedMute = localStorage.getItem('rt_muted');
      if (savedMute) {
        const muted = savedMute === 'true';
        setIsMuted(muted);
        audioService.setMuted(muted);
      }
    } catch (e) {
      console.error("Erro no carregamento:", e);
    }
  }, []);

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioService.setMuted(nextMute);
    localStorage.setItem('rt_muted', String(nextMute));
  };

  const resetScores = (duration: number) => {
    const confirmMessage = `Desejas apagar todos os recordes da categoria de ${duration} minuto${duration > 1 ? 's' : ''}?`;
    if (window.confirm(confirmMessage)) {
      const updatedScores = highScores.filter(s => Number(s.durationMinutes) !== Number(duration));
      setHighScores(updatedScores);
      localStorage.setItem('rt_scores_v2', JSON.stringify(updatedScores));
    }
  };

  const startGame = (config: GameConfig) => {
    setGameConfig(config);
    setPlayerName(config.playerName);
    setGameCategory(config.category);
    setIsNewRecord(false);
    localStorage.setItem('rt_player_name', config.playerName);
    localStorage.setItem('rt_game_category', config.category);
    setGameState(GameState.PLAYING);
  };

  const finishGame = (score: number) => {
    setLastScore(score);
    
    if (gameConfig) {
      const bestForDuration = highScores
        .filter(h => Number(h.durationMinutes) === Number(gameConfig.durationMinutes))
        .reduce((max, s) => s.score > max ? s.score : max, 0);

      const isRecord = score > bestForDuration && score > 0;
      setIsNewRecord(isRecord);

      const newScoreEntry: PlayerScore = {
        name: gameConfig.playerName,
        score,
        decade: gameConfig.decade,
        category: gameConfig.category,
        durationMinutes: gameConfig.durationMinutes,
        date: new Date().toISOString()
      };

      const updated = [newScoreEntry, ...highScores]
        .sort((a, b) => b.score - a.score)
        .slice(0, 100);
      
      setHighScores(updated);
      localStorage.setItem('rt_scores_v2', JSON.stringify(updated));
    }
    setGameState(GameState.FINISHED);
  };

  const updateHistory = (text: string) => {
    const updated = [...playedTexts, text].slice(-200); 
    setPlayedTexts(updated);
    localStorage.setItem('rt_history_texts', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white flex flex-col items-center justify-start pt-4 md:pt-10 px-4 overflow-x-hidden">
      
      {gameState === GameState.SETUP && (
        <SetupScreen 
          initialName={playerName}
          initialCategory={gameCategory}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onStart={startGame} 
          onShowLeaderboard={() => setGameState(GameState.LEADERBOARD)} 
        />
      )}

      {gameState === GameState.PLAYING && gameConfig && (
        <GameScreen 
          config={gameConfig} 
          excludeTexts={playedTexts}
          onQuestionAnswered={updateHistory}
          onFinish={finishGame} 
        />
      )}

      {gameState === GameState.FINISHED && (
        <div className="text-center animate-fade-in max-w-md w-full bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl mt-8 relative" role="status">
           
           {isNewRecord && <RetroFireworks />}

           {isNewRecord && (
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-2 rounded-full text-[10px] retro-font animate-bounce shadow-xl z-10 border-2 border-white/20">
               NOVO RECORDE
             </div>
           )}

           <h2 className="text-xl font-black mb-1 retro-font text-white uppercase tracking-tighter">Fim de Concerto</h2>
           <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-[0.2em] font-black">{playerName}</p>
           
           <div className="relative mb-8 inline-block">
             <div className={`text-7xl font-black drop-shadow-[0_0_30px_rgba(250,204,21,0.5)] ${isNewRecord ? 'text-yellow-400' : 'text-white'}`}>
               {lastScore}
             </div>
             <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">Pontos Acumulados</p>
           </div>
           
           {isNewRecord && (
             <p className="text-[9px] text-yellow-500 font-black retro-font mb-6 animate-pulse px-4">
               SUBISTE AO TOPO DAS CHARTS! 📀
             </p>
           )}
           
           <div className="flex flex-col gap-3">
             <button 
               onClick={() => setGameState(GameState.LEADERBOARD)} 
               className="w-full py-4 bg-purple-600 rounded-xl font-black text-[10px] retro-font hover:bg-purple-500 transition-all uppercase shadow-lg shadow-purple-900/40"
             >
               Ver Top Charts
             </button>
             <button 
               onClick={() => setGameState(GameState.SETUP)} 
               className="w-full py-4 bg-gray-700 rounded-xl font-black text-[10px] retro-font hover:bg-gray-600 transition-all uppercase"
             >
               Jogar Novamente
             </button>
           </div>
        </div>
      )}

      {gameState === GameState.LEADERBOARD && (
        <Leaderboard 
          scores={highScores} 
          onBack={() => setGameState(GameState.SETUP)} 
          onReset={resetScores}
        />
      )}
      
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default App;
