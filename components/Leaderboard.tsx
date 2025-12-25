import React from 'react';
import { PlayerScore } from '../types';

interface LeaderboardProps {
  scores: PlayerScore[];
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores, onBack }) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-gray-800 rounded-xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden max-h-[80vh]">
      <div className="p-6 bg-gray-900 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 retro-font">
          TOP PONTUAÇÕES
        </h2>
      </div>

      <div className="overflow-y-auto flex-1 p-4">
        {scores.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Ainda sem pontuações. Sê o primeiro!
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-gray-400 text-sm font-semibold uppercase">Pos.</th>
                <th className="p-2 text-gray-400 text-sm font-semibold uppercase">Jogador</th>
                <th className="p-2 text-gray-400 text-sm font-semibold uppercase">Década</th>
                <th className="p-2 text-gray-400 text-sm font-semibold uppercase text-right">Pts</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                  <td className="p-3 font-mono text-gray-500">#{index + 1}</td>
                  <td className="p-3 font-bold text-white truncate max-w-[120px]">{s.name}</td>
                  <td className="p-3 text-purple-400 text-sm">{s.decade}</td>
                  <td className="p-3 text-right font-mono text-yellow-400">{s.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <button
          onClick={onBack}
          className="w-full py-3 font-bold text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          VOLTAR AO MENU
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;