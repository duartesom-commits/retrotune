
import React, { useState, useEffect } from 'react';
import { GameState, GameConfig, PlayerScore } from './types';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';
import Leaderboard from './components/Leaderboard';
import { audioService } from './services/audioService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [lastScore, setLastScore] = useState(0);
  const [highScores, setHighScores] = useState<PlayerScore[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [playedTexts, setPlayedTexts] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    try {
      const savedScores = localStorage.getItem('rt_scores');
      if (savedScores) setHighScores(JSON.parse(savedScores));

      const savedName = localStorage.getItem('rt_player_name');
      if (savedName) setPlayerName(savedName);

      const savedHistory = localStorage.getItem('rt_history_texts');
      if (savedHistory) setPlayedTexts(JSON.parse(savedHistory));

      const savedMute = localStorage.getItem('rt_muted');
      if (savedMute) {
        const muted = savedMute === 'true';
        setIsMuted(muted);
        audioService.setMuted(muted);
      }
    } catch (e) {
      console.error("Erro ao carregar dados locais", e);
    }
  }, []);

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioService.setMuted(nextMute);
    localStorage.setItem('rt_muted', String(nextMute));
  };

  const resetScores = () => {
    if (window.confirm("Desejas mesmo apagar todas as pontuações e o histórico de perguntas?")) {
      setHighScores([]);
      setPlayedTexts([]);
      localStorage.removeItem('rt_scores');
      localStorage.removeItem('rt_history_texts');
    }
  };

  const startGame = (config: GameConfig) => {
    setGameConfig(config);
    setPlayerName(config.playerName);
    localStorage.setItem('rt_player_name', config.playerName);
    setGameState(GameState.PLAYING);
  };

  const finishGame = (score: number) => {
    setLastScore(score);
    if (gameConfig) {
      const newScore: PlayerScore = {
        name: gameConfig.playerName,
        score,
        decade: gameConfig.decade,
        date: new Date().toISOString()
      };
      const updated = [newScore, ...highScores]
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);
      setHighScores(updated);
      localStorage.setItem('rt_scores', JSON.stringify(updated));
    }
    setGameState(GameState.FINISHED);
  };

  const updateHistory = (text: string) => {
    // Guardamos o texto da pergunta para evitar repetição semântica via IA
    const updated = [...playedTexts, text].slice(-100); 
    setPlayedTexts(updated);
    localStorage.setItem('rt_history_texts', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white flex flex-col items-center justify-start pt-2 md:pt-6 px-3 overflow-hidden">
      
      {gameState === GameState.SETUP && (
        <SetupScreen 
          initialName={playerName}
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
        <div className="text-center animate-fade-in max-w-sm w-full bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl mt-8">
           <h2 className="text-xl font-black mb-1 retro-font text-white uppercase tracking-tighter">Sessão Encerrada</h2>
           <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-[0.2em] font-black">{playerName}</p>
           
           <div className="relative mb-8 inline-block">
             <div className="text-7xl font-black text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]">
               {lastScore}
             </div>
             <p className="text-[10px] text-yellow-600 font-bold uppercase mt-2">Pontos Ganhos</p>
           </div>
           
           <div className="flex flex-col gap-3">
             <button 
               onClick={() => setGameState(GameState.LEADERBOARD)} 
               className="w-full py-4 bg-purple-600 rounded-xl font-black text-[10px] retro-font hover:bg-purple-500 transition-all uppercase"
             >
               Top Charts
             </button>
             <button 
               onClick={() => setGameState(GameState.SETUP)} 
               className="w-full py-4 bg-gray-700 rounded-xl font-black text-[10px] retro-font hover:bg-gray-600 transition-all uppercase"
             >
               Novo Jogo
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
      
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-30">
         <div className="absolute top-[-5%] left-[-5%] w-[350px] h-[350px] bg-purple-900/40 rounded-full blur-[90px]"></div>
         <div className="absolute bottom-[-5%] right-[-5%] w-[350px] h-[350px] bg-indigo-900/40 rounded-full blur-[90px]"></div>
      </div>
    </div>
  );
};

export default App;
