
import React, { useState, useEffect } from 'react';
import { GameConfig, Question } from '../types';
import { generateQuestions } from '../services/geminiService';
import { audioService } from '../services/audioService';

interface GameScreenProps {
  config: GameConfig;
  excludeIds: string[];
  onQuestionAnswered: (id: string) => void;
  onFinish: (score: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ config, excludeIds, onQuestionAnswered, onFinish }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.durationMinutes * 60);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Pedimos 30 perguntas para garantir que temos bastantes para a duração
      const data = await generateQuestions(config.decade, 30, excludeIds);
      setQuestions(data);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (loading || timeLeft <= 0) {
      if (timeLeft <= 0) onFinish(score);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, loading]);

  const handleSelect = (opt: string) => {
    if (revealed) return;
    const isCorrect = opt === questions[currentIdx].correctAnswer;
    
    setSelected(opt);
    setRevealed(true);
    onQuestionAnswered(questions[currentIdx].id);

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
        onFinish(score + (isCorrect ? 1 : 0));
      }
    }, 1000);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 animate-pulse">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-xs font-black text-purple-400 uppercase tracking-widest">A gerar perguntas...</p>
    </div>
  );

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

      <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border-2 border-gray-700 mb-6 shadow-inner text-center">
        <h2 className="text-xl font-bold text-white leading-relaxed">{current.text}</h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {current.options.map((opt, i) => {
          const isCorrect = opt === current.correctAnswer;
          const isSelected = selected === opt;
          
          let btnClass = "bg-gray-900/60 border-gray-700 text-gray-300 hover:border-purple-500";
          if (revealed) {
            if (isCorrect) btnClass = "bg-green-500/30 border-green-500 text-white shadow-lg shadow-green-500/20";
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
