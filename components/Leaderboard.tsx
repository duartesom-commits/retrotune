
import React, { useState } from 'react';
import { PlayerScore, Category } from '../types';

interface LeaderboardProps {
  scores: PlayerScore[];
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores, onBack }) => {
  const [activeTab, setActiveTab] = useState<number>(1); // Tempo selecionado (1, 2 ou 5 min)

  const formatCategory = (c: Category) => {
    if (c === 'portuguese') return 'PT';
    if (c === 'international') return 'INTL';
    return 'AMBOS';
  };

  const filteredScores = scores
    .filter(s => Number(s.durationMinutes) === Number(activeTab))
    .sort((a, b) => b.score - a.score);

  const getRankIcon = (index: number) => {
    const colors = [
      'from-yellow-400 via-yellow-200 to-yellow-600 shadow-yellow-500/50',
      'from-gray-300 via-white to-gray-500 shadow-gray-400/50',
      'from-orange-400 via-orange-200 to-orange-700 shadow-orange-600/50'
    ];
    
    if (index > 2) return null;

    return (
      <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${colors[index]} flex items-center justify-center border border-black/20 shadow-lg relative group overflow-hidden animate-bounce-slow`}>
        <div className="absolute inset-0 rounded-full border border-black/10 opacity-30"></div>
        <div className="absolute inset-1 rounded-full border border-black/10 opacity-30"></div>
        <div className="absolute inset-2 rounded-full border border-black/10 opacity-30"></div>
        <div className="w-2 h-2 bg-gray-900/80 rounded-full z-10 border border-white/20"></div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden max-h-[85vh] animate-fade-in">
      {/* Header */}
      <div className="p-6 bg-gray-900 border-b border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 id="leaderboard-title" className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 retro-font">
              TOP CHARTS
            </h2>
          </div>
        </div>

        {/* Tabs de Duração */}
        <div className="flex gap-2 p-1 bg-gray-950 rounded-xl">
          {[1, 2, 5].map(min => (
            <button
              key={min}
              onClick={() => setActiveTab(min)}
              className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${
                Number(activeTab) === Number(min) 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {min} MINUTO{min > 1 ? 'S' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-y-auto flex-1 p-4">
        {filteredScores.length === 0 ? (
          <div className="text-center text-gray-600 py-16 font-bold uppercase text-[10px] tracking-[0.3em] flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-gray-700 border-t-transparent animate-spin opacity-20"></div>
            Sem registos para {activeTab}m
          </div>
        ) : (
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-500 text-[9px] font-black uppercase tracking-tighter">
                <th className="px-3 pb-2 text-center">RANK</th>
                <th className="px-3 pb-2">JOGADOR</th>
                <th className="px-3 pb-2">DÉCADA</th>
                <th className="px-3 pb-2 text-right">SCORE</th>
              </tr>
            </thead>
            <tbody>
              {filteredScores.map((s, index) => (
                <tr key={`${s.date}-${index}`} className={`group transition-all ${index < 3 ? 'bg-white/5' : 'bg-gray-900/30'} rounded-xl overflow-hidden`}>
                  <td className="py-3 px-3 rounded-l-xl">
                    <div className="flex items-center justify-center">
                      {index < 3 ? getRankIcon(index) : <span className="font-mono text-gray-500 text-xs">#{index + 1}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm truncate max-w-[100px]">{s.name}</span>
                      <span className="text-[8px] text-blue-400 font-black uppercase">{formatCategory(s.category)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-purple-400 text-[10px] font-black uppercase">{s.decade}</span>
                  </td>
                  <td className="py-3 px-3 text-right rounded-r-xl">
                    <span className={`font-mono text-lg font-black ${index < 3 ? 'text-yellow-400' : 'text-gray-300'}`}>
                      {s.score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-gray-900 border-t border-gray-700">
        <button
          onClick={onBack}
          className="w-full py-4 font-black text-white bg-gray-800 border-2 border-gray-700 rounded-xl hover:border-purple-500 transition-all uppercase text-[10px] tracking-[0.2em]"
        >
          VOLTAR AO ESTÚDIO
        </button>
      </div>

      <style>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default Leaderboard;
