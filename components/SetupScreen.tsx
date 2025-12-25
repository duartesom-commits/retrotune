import React, { useState, useEffect } from 'react';
import { Decade, GameConfig } from '../types';

interface SetupScreenProps {
  initialName: string;
  onStart: (config: GameConfig) => void;
  onShowLeaderboard: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ initialName, onStart, onShowLeaderboard }) => {
  const [name, setName] = useState(initialName);
  const [decade, setDecade] = useState<Decade>('80s');
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart({ playerName: name, decade, durationMinutes: duration });
    }
  };

  const decades: Decade[] = ['80s', '90s', '00s', '2010s', '2020s', 'all'];
  
  const formatDecade = (d: Decade) => {
     if (d === 'all') return 'Todas';
     if (d === '2010s') return 'Anos 10';
     if (d === '2020s') return 'Anos 20';
     return `Anos ${d.replace('s', '')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm p-5 md:p-8 mx-auto bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 relative overflow-hidden animate-fade-in">
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>

      <h1 className="text-3xl md:text-4xl font-black mb-6 md:mb-10 mt-2 text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-indigo-500 retro-font text-center leading-tight">
        RETRO<br className="md:hidden"/>TUNE
      </h1>

      <form onSubmit={handleSubmit} className="w-full space-y-4 md:space-y-6">
        <div>
          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Assinatura</label>
          <input
            type="text"
            required
            maxLength={15}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none text-white placeholder-gray-600 transition-all font-bold text-sm"
            placeholder="Teu nome"
          />
        </div>

        <div>
          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Década</label>
          <div className="grid grid-cols-3 gap-1.5">
            {decades.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDecade(d)}
                className={`px-1 py-2 text-[10px] font-black rounded-lg border-2 transition-all ${
                  decade === d
                    ? 'bg-purple-600 border-purple-400 text-white'
                    : 'bg-gray-900/30 border-gray-800 text-gray-500'
                }`}
              >
                {formatDecade(d)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Duração</label>
          <div className="flex gap-1.5">
             {[1, 2, 3, 5].map((m) => (
               <button
                 key={m}
                 type="button"
                 onClick={() => setDuration(m)}
                 className={`flex-1 py-2 text-[10px] font-black rounded-lg border-2 transition-all ${
                   duration === m
                     ? 'bg-pink-600 border-pink-400 text-white'
                     : 'bg-gray-900/30 border-gray-800 text-gray-500'
                 }`}
               >
                 {m}m
               </button>
             ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 mt-2 font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:opacity-90 active:scale-95 transition-all retro-font text-xs tracking-tighter"
        >
          START
        </button>
      </form>

      <button
        onClick={onShowLeaderboard}
        className="mt-6 text-[9px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-all"
      >
        TOP CHARTS 
      </button>
    </div>
  );
};

export default SetupScreen;
