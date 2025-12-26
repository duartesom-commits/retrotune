
import React, { useState, useEffect, useRef } from 'react';
import { GameConfig, Question } from '../types';
import { generateQuestions } from '../services/geminiService';
import { audioService } from '../services/audioService';

interface GameScreenProps {
  config: GameConfig;
  excludeTexts: string[];
  onQuestionAnswered: (text: string) => void;
  onFinish: (score: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ config, excludeTexts, onQuestionAnswered, onFinish }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.durationMinutes * 60);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  
  const historyRef = useRef<string[]>(excludeTexts);

  // Inicialização
  useEffect(() => {
    const init = async () => {
      // Pedimos uma quantidade generosa inicial (25 por minuto de jogo)
      const data = await generateQuestions(config.decade, config.category, config.durationMinutes * 25, historyRef.current);
      setQuestions(data);
      setLoading(false);
    };
    init();
  }, [config.decade, config.category]);

  // Cronómetro Central - Única fonte de encerramento do jogo
  useEffect(() => {
    if (loading || timeLeft <= 0) {
      if (timeLeft === 0 && !loading) {
        onFinish(score);
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading, score]);

  // Fetch de mais perguntas em background para evitar que acabem
  const fetchMoreQuestions = async () => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      const more = await generateQuestions(config.decade, config.category, 10, historyRef.current);
      setQuestions(prev => [...prev, ...more]);
    } catch (e) {
      console.warn("Erro ao buscar mais questões.");
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleSelect = (opt: string) => {
    if (revealed || timeLeft <= 0) return;
    
    const currentQ = questions[currentIdx];
    if (!currentQ) return;

    const isCorrect = opt === currentQ.correctAnswer;
    
    setSelected(opt);
    setRevealed(true);
    onQuestionAnswered(currentQ.text);
    historyRef.current = [...historyRef.current, currentQ.text];

    if (isCorrect) {
      setScore(s => s + 1);
      audioService.playCorrect();
    } else {
      audioService.playWrong();
    }

    // Avançar ou repor perguntas
    setTimeout(() => {
      const nextIdx = currentIdx + 1;
      
      // Se estivermos a chegar ao fim das perguntas carregadas, pedir mais em background
      if (nextIdx >= questions.length - 3) {
        fetchMoreQuestions();
      }

      // Se por algum motivo as perguntas acabarem antes do tempo, voltamos ao início (shuffle) ou esperamos o fetch
      if (nextIdx < questions.length) {
        setSelected(null);
        setRevealed(false);
        setCurrentIdx(nextIdx);
      } else {
        // Fallback caso a rede falhe e não haja mais perguntas: reciclar as atuais mas com shuffle
        setSelected(null);
        setRevealed(false);
        setCurrentIdx(0);
      }
    }, 1200);
  };

  if (loading) {
    const formatDecade = (d: string) => {
      if (d === 'all') return 'Todas as Décadas';
      if (d === '2010s') return 'Anos 10';
      if (d === '2020s') return 'Anos 20';
      return `Anos ${d.replace('s', '')}`;
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-md mx-auto">
        <div className="bg-gray-900 p-6 rounded-xl border-4 border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-10 w-full">
          <div className="flex gap-2 h-48 items-end p-2 bg-black border-2 border-gray-800 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="relative w-full h-full flex flex-col-reverse gap-[2px]">
                <div 
                  className="absolute bottom-0 left-0 w-full bg-transparent flex flex-col-reverse gap-[2px]"
                  style={{
                    height: '100%',
                    animation: `eq-bounce-${i % 3} ${0.6 + Math.random() * 0.8}s infinite alternate ease-in-out`,
                    animationTimingFunction: 'steps(12)',
                    clipPath: 'inset(0 0 0 0)'
                  }}
                >
                  {[...Array(12)].map((_, seg) => {
                    let color = "bg-green-500";
                    if (seg >= 7 && seg < 10) color = "bg-yellow-400";
                    if (seg >= 10) color = "bg-red-500";
                    return <div key={seg} className={`h-[14px] w-full ${color} rounded-sm opacity-90`}></div>;
                  })}
                </div>
                {[...Array(12)].map((_, seg) => (
                  <div key={`bg-${seg}`} className="h-[14px] w-full bg-gray-900/50 rounded-sm"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] retro-font animate-pulse">A preparar o palco...</p>
          <div className="mt-4 flex flex-col items-center gap-2">
            <span className="text-[8px] text-gray-500 uppercase tracking-widest font-black">Referente aos</span>
            <span className="px-4 py-1.5 bg-indigo-900/40 rounded-full border border-indigo-500/30 text-[9px] text-indigo-400 font-black uppercase tracking-widest">
              {formatDecade(config.decade)}
            </span>
          </div>
        </div>
        <style>{`
          @keyframes eq-bounce-0 { 0% { clip-path: inset(80% 0 0 0); } 50% { clip-path: inset(20% 0 0 0); } 100% { clip-path: inset(60% 0 0 0); } }
          @keyframes eq-bounce-1 { 0% { clip-path: inset(90% 0 0 0); } 30% { clip-path: inset(10% 0 0 0); } 70% { clip-path: inset(40% 0 0 0); } 100% { clip-path: inset(85% 0 0 0); } }
          @keyframes eq-bounce-2 { 0% { clip-path: inset(70% 0 0 0); } 40% { clip-path: inset(0% 0 0 0); } 100% { clip-path: inset(50% 0 0 0); } }
        `}</style>
      </div>
    );
  }

  const current = questions[currentIdx];
  if (!current) return null;

  const totalDuration = config.durationMinutes * 60;
  const timePercentage = timeLeft / totalDuration;

  let progressBarColor = 'bg-green-500';
  if (timePercentage <= 0.6 && timePercentage > 0.3) progressBarColor = 'bg-yellow-400';
  else if (timePercentage <= 0.3) progressBarColor = 'bg-red-500';

  return (
    <div key={current.id} className="w-full max-w-md mx-auto flex flex-col animate-fade-in relative">
      <div className="fixed top-0 left-0 w-full flex flex-col items-center z-50 bg-[#0a0a0f]/80 backdrop-blur-sm shadow-lg border-b border-gray-700 pt-2 pb-2">
        <div className="w-full max-w-md flex justify-between items-center px-4 mb-2">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em]">Tempo</span>
            <span className={`text-2xl font-mono font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-yellow-500 uppercase tracking-[0.2em]">Pontos</span>
            <span className="text-2xl font-mono font-black text-yellow-400">{score}</span>
          </div>
        </div>
        <div className="w-full max-w-md px-4">
          <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
            <div className={`h-full transition-all ease-linear duration-100 ${progressBarColor}`} style={{ width: `${timePercentage * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="mt-24 w-full px-2">
        <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-3xl border-2 border-gray-700 mb-6 shadow-inner text-center min-h-[140px] flex items-center justify-center">
          <h2 id="current-question" className="text-lg md:text-xl font-bold text-white leading-relaxed">{current.text}</h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {current.options.map((opt, i) => {
            const isCorrect = opt === current.correctAnswer;
            const isSelected = selected === opt;
            let btnClass = "bg-gray-900/60 border-gray-700 text-gray-300 hover:border-purple-500";
            if (revealed) {
              if (isCorrect) btnClass = "bg-green-500/30 border-green-500 text-white shadow-lg shadow-green-500/20 scale-[1.02]";
              else if (isSelected) btnClass = "bg-red-500/30 border-red-500 text-white";
              else btnClass = "bg-gray-900/20 border-gray-800 opacity-20 scale-95";
            }
            return (
              <button key={`${current.id}-opt-${i}`} onClick={() => handleSelect(opt)} disabled={revealed} className={`w-full p-4 md:p-5 text-left rounded-2xl border-2 font-bold transition-all duration-200 flex items-center ${btnClass}`}>
                <span className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center mr-4 text-xs font-black text-gray-500">{String.fromCharCode(65 + i)}</span>
                <span className="flex-1 text-sm md:text-base">{opt}</span>
              </button>
            );
          })}
        </div>
        {isFetchingMore && (
          <div className="mt-4 text-center">
             <span className="text-[8px] font-black text-gray-600 animate-pulse uppercase tracking-widest">A carregar mais temas...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
