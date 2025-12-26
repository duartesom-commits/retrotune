
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Decade, GameConfig, Category } from '../types';

interface SetupScreenProps {
  initialName: string;
  initialCategory: Category;
  isMuted: boolean;
  onToggleMute: () => void;
  onStart: (config: GameConfig) => void;
  onShowLeaderboard: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ initialName, initialCategory, isMuted, onToggleMute, onStart, onShowLeaderboard }) => {
  const [name, setName] = useState(initialName);
  const [decade, setDecade] = useState<Decade>('80s');
  const [category, setCategory] = useState<Category>(initialCategory);
  const [duration, setDuration] = useState(1);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart({ playerName: name, decade, durationMinutes: duration, category });
    }
  };

  const decades: Decade[] = ['80s', '90s', '00s', '2010s', '2020s', 'all'];
  const categories: Category[] = ['portuguese', 'international', 'both'];
  
  const formatDecade = (d: Decade) => {
     if (d === 'all') return 'Todas';
     if (d === '2010s') return 'Anos 10';
     if (d === '2020s') return 'Anos 20';
     return `Anos ${d.replace('s', '')}`;
  };

  const formatCategory = (c: Category) => {
    if (c === 'portuguese') return 'Portuguesa';
    if (c === 'international') return 'Internacional';
    return 'Ambos';
  };

  const openInfoModal = useCallback(() => {
    setShowInfoModal(true);
  }, []);

  const closeInfoModal = useCallback(() => {
    setShowInfoModal(false);
    infoButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (showInfoModal) {
      modalRef.current?.focus();
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') closeInfoModal();
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showInfoModal, closeInfoModal]);


  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md p-6 md:p-8 mx-auto bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 relative overflow-hidden animate-fade-in">
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>

      {/* Botões de Controlo nos Cantos Superiores */}
      <button 
        onClick={onToggleMute}
        className="absolute top-6 left-6 p-2.5 bg-gray-900/50 rounded-full hover:bg-gray-900 transition-colors border border-gray-700 z-10"
        aria-label={isMuted ? "Desmutar som" : "Mutar som"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.707 5.293a1 1 0 010 1.414 3 3 0 000 4.242 1 1 0 11-1.414 1.414 5 5 0 010-7.072 1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <button 
        onClick={openInfoModal}
        ref={infoButtonRef}
        className="absolute top-6 right-6 p-2.5 bg-gray-900/50 rounded-full hover:bg-gray-900 transition-colors border border-gray-700 z-10"
        aria-label="Informações e regras do jogo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </button>

      <h1 className="text-3xl md:text-4xl font-black mb-6 md:mb-10 mt-12 text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-indigo-500 retro-font text-center leading-tight">
        RETRO<br className="md:hidden"/>TUNE
      </h1>

      <form onSubmit={handleSubmit} className="w-full space-y-4 md:space-y-6">
        <div>
          <label htmlFor="playerNameInput" className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Nome Artístico</label>
          <input
            type="text"
            id="playerNameInput"
            required
            maxLength={15}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none text-white placeholder-gray-600 transition-all font-bold text-sm"
            placeholder="Qual é o teu nome de Rockstar?"
          />
        </div>

        <div>
          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Década de Referência</label>
          <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Selecionar década musical">
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
                aria-pressed={decade === d}
              >
                {formatDecade(d)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Categoria de Conteúdo</label>
          <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Selecionar categoria musical">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-1 py-2 text-[10px] font-black rounded-lg border-2 transition-all ${
                  category === c
                    ? 'bg-indigo-600 border-indigo-400 text-white'
                    : 'bg-gray-900/30 border-gray-800 text-gray-500'
                }`}
                aria-pressed={category === c}
              >
                {formatCategory(c)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Tempo de Sessão</label>
          <div className="flex gap-1.5" role="group" aria-label="Selecionar duração do jogo em minutos">
             {[1, 2, 5].map((m) => (
               <button
                 key={m}
                 type="button"
                 onClick={() => setDuration(m)}
                 className={`flex-1 py-2 text-[10px] font-black rounded-lg border-2 transition-all ${
                   duration === m
                     ? 'bg-pink-600 border-pink-400 text-white'
                     : 'bg-gray-900/30 border-gray-800 text-gray-500'
                 }`}
                 aria-pressed={duration === m}
               >
                 {m}m
               </button>
             ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 mt-2 font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:opacity-90 active:scale-95 transition-all retro-font text-xs tracking-tighter"
          aria-label="Iniciar jogo"
        >
          START
        </button>
      </form>

      <button
        onClick={onShowLeaderboard}
        className="mt-6 text-[9px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-all"
        aria-label="Ver tabela de pontuações"
      >
        TOP CHARTS 
      </button>

      {showInfoModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[9999] animate-fade-in backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-modal-title"
          aria-describedby="info-modal-description"
          tabIndex={-1}
          ref={modalRef}
          onClick={(e) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) closeInfoModal();
          }}
        >
          <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-6 shadow-2xl max-w-sm w-full relative">
            <h3 id="info-modal-title" className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 retro-font mb-4">
              RetroTune Information
            </h3>
            <p id="info-modal-description" className="text-gray-300 text-sm mb-4 leading-relaxed">
              RetroTune Quiz é uma plataforma de avaliação de conhecimentos musicais, abrangendo o período entre 1980 e a atualidade.
            </p>
            <div className="mb-6 bg-gray-900/50 p-4 rounded-xl border border-gray-700">
              <h4 className="text-indigo-400 font-black mb-3 uppercase text-[9px] tracking-[0.2em]">Diretrizes de Jogo:</h4>
              <ul className="text-gray-400 text-[11px] space-y-2 font-medium">
                <li className="flex gap-2"><span>•</span> <span>As questões são geradas dinamicamente com base na década e categoria selecionadas.</span></li>
                <li className="flex gap-2"><span>•</span> <span>O utilizador deve selecionar a resposta correta dentro do limite de tempo estabelecido.</span></li>
                <li className="flex gap-2"><span>•</span> <span>A pontuação é calculada com base no número de respostas corretas.</span></li>
                <li className="flex gap-2"><span>•</span> <span>Os registos de desempenho são armazenados localmente e exibidos no Top Charts.</span></li>
                <li className="flex gap-2"><span>•</span> <span>A precisão e rapidez são fatores fundamentais para alcançar as posições de topo.</span></li>
              </ul>
            </div>
            <button
              onClick={closeInfoModal}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-black text-white hover:opacity-90 transition-all uppercase text-xs shadow-lg shadow-purple-900/40"
              aria-label="Fechar informações do jogo"
            >
              ROCK ON! 🎸
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupScreen;
