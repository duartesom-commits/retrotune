
import React, { useState, useEffect } from 'react';
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
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const init = async () => {
      const startTime = Date.now();
      const targetCount = config.durationMinutes * 10;
      const data = await generateQuestions(config.decade, Math.max(12, targetCount), excludeTexts);
      
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 2500 - elapsed); 
      
      setTimeout(() => {
        setQuestions(data);
        setLoading(false);
      }, delay);
    };
    init();
  }, []);

  useEffect(() => {
    if (loading || timeLeft <= 0) {
      if (timeLeft === 0 && !loading) onFinish(score);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading, score]);

  const handleSelect = (opt: string) => {
    if (revealed) return;
    const isCorrect = opt === questions[currentIdx].correctAnswer;
    
    setSelected(opt);
    setRevealed(true);
    onQuestionAnswered(questions[currentIdx].text);

    if (isCorrect) {
      setScore(s => s + 1);
      audioService.playCorrect();
    } else {
      audioService.playWrong();
    }

    setTimeout(() => {
      if (currentIdx + 1 < questions.length) {
        setSelected(null);
        setRevealed(false);
        setCurrentIdx(prev => prev + 1);
      } else {
        onFinish(score + (isCorrect ? 0 : 0));
      }
    }, 1200);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
        {/* Equalizador Retro High-Fi */}
        <div className="bg-gray-900 p-6 rounded-xl border-4 border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-10">
          <div className="flex gap-2 h-48 items-end p-2 bg-black border-2 border-gray-800 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="relative w-5 h-full flex flex-col-reverse gap-[2px]"
              >
                {/* A animação controla a altura do contentor interno ou o clip-path */}
                <div 
                  className="absolute bottom-0 left-0 w-full bg-transparent flex flex-col-reverse gap-[2px]"
                  style={{
                    height: '100%',
                    animation: `eq-bounce-${i % 3} ${0.6 + Math.random() * 0.8}s infinite alternate ease-in-out`,
                    animationTimingFunction: 'steps(12)',
                    clipPath: 'inset(0 0 0 0)' // Será animado
                  }}
                >
                  {[...Array(12)].map((_, seg) => {
                    let color = "bg-green-500";
                    if (seg >= 7 && seg < 10) color = "bg-yellow-400";
                    if (seg >= 10) color = "bg-red-500";
                    
                    return (
                      <div 
                        key={seg} 
                        className={`h-[14px] w-full ${color} rounded-sm shadow-[0_0_8px_rgba(0,0,0,0.3)]`}
                        style={{ opacity: 0.9 }}
                      ></div>
                    );
                  })}
                </div>
                {/* Background "apagado" para os leds ficarem visíveis como grelha */}
                {[...Array(12)].map((_, seg) => (
                  <div key={`bg-${seg}`} className="h-[14px] w-full bg-gray-900/50 rounded-sm"></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes eq-bounce-0 {
            0% { clip-path: inset(80% 0 0 0); }
            50% { clip-path: inset(20% 0 0 0); }
            100% { clip-path: inset(60% 0 0 0); }
          }
          @keyframes eq-bounce-1 {
            0% { clip-path: inset(90% 0 0 0); }
            30% { clip-path: inset(10% 0 0 0); }
            70% { clip-path: inset(40% 0 0 0); }
            100% { clip-path: inset(85% 0 0 0); }
          }
          @keyframes eq-bounce-2 {
            0% { clip-path: inset(70% 0 0 0); }
            40% { clip-path: inset(0% 0 0 0); }
            100% { clip-path: inset(50% 0 0 0); }
          }
        `}</style>
        
        <div className="text-center">
          <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] retro-font animate-pulse">
            A gerar perguntas...
          </p>
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            <span className="text-[8px] text-gray-600 uppercase tracking-widest font-bold">Rec / Sintonizando rádio</span>
          </div>
        </div>
      </div>
    );
  }

  const current = questions[currentIdx];
  if (!current) return null;

  return (
    <div key={current.id} className="w-full max-w-xl mx-auto flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-6 bg-gray-900/80 p-5 rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em]">Tempo</span>
          <span className={`text-2xl font-mono font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black text-yellow-500 uppercase tracking-[0.2em]">Pontos</span>
          <span className="text-2xl font-mono font-black text-yellow-400">{score}</span>
        </div>
      </div>

      <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border-2 border-gray-700 mb-6 shadow-inner text-center min-h-[140px] flex items-center justify-center">
        <h2 className="text-xl font-bold text-white leading-relaxed">{current.text}</h2>
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
            <button
              key={`${current.id}-opt-${i}`}
              onClick={() => handleSelect(opt)}
              disabled={revealed}
              className={`w-full p-5 text-left rounded-2xl border-2 font-bold transition-all duration-200 flex items-center ${btnClass}`}
            >
              <span className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center mr-4 text-xs font-black text-gray-500">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GameScreen;
