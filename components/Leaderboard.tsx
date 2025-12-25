
import React from 'react';
import { PlayerScore } from '../types';

interface LeaderboardProps {
  scores: PlayerScore[];
  onBack: () => void;
  onReset: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores, onBack, onReset }) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-gray-800 rounded-xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden max-h-[80vh]">
      <div className="p-6 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 retro-font">
          TOP CHARTS
        </h2>
        <button 
          onClick={onReset}
          className="text-[8px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest border border-red-900/30 px-2 py-1 rounded"
        >
          LIMPAR
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-4">
        {scores.length === 0 ? (
          <div className="text-center text-gray-500 py-10 font-bold uppercase text-xs">
            Ainda sem pontuações.<br/>Sê o primeiro a entrar no Top!
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-gray-400 text-[10px] font-black uppercase tracking-tighter">Pos.</th>
                <th className="p-2 text-gray-400 text-[10px] font-black uppercase tracking-tighter">Jogador</th>
                <th className="p-2 text-gray-400 text-[10px] font-black uppercase tracking-tighter">Década</th>
                <th className="p-2 text-gray-400 text-[10px] font-black uppercase tracking-tighter text-right">Pts</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                  <td className="p-3 font-mono text-gray-500 text-xs">#{index + 1}</td>
                  <td className="p-3 font-bold text-white truncate max-w-[120px] text-sm">{s.name}</td>
                  <td className="p-3 text-purple-400 text-xs font-bold uppercase">{s.decade}</td>
                  <td className="p-3 text-right font-mono text-yellow-400 font-bold">{s.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <button
          onClick={onBack}
          className="w-full py-3 font-bold text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors uppercase text-xs"
        >
          VOLTAR AO MENU
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
