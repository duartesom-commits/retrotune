
import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const funPhrases = [
  "Cuidado: contém altos níveis de nostalgia 🕹️",
  "Do Walkman ao Spotify: a viagem começa aqui.",
  "Onde os clássicos nunca saem de moda.",
  "80% Música, 20% Memórias, 100% Vício.",
  "Aumenta o som e domina o palco! 🎸",
  "Prova que não ouves apenas o que dá na rádio.",
  "Estás pronto para ser o próximo Rockstar?",
  "O palco é teu, não desafines!",
  "Insere uma moeda e mostra o que vales 🪙",
  "Mais viciante que rebobinar fitas com uma caneta.",
  "Sintoniza a tua memória na frequência certa.",
  "A tua playlist de memórias começa agora."
];

const CassetteTape: React.FC = () => {
  return (
    <div className="relative w-64 h-40 bg-purple-950/20 backdrop-blur-md rounded-xl border-4 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col items-center group-hover:border-pink-500/50 group-hover:shadow-[0_0_40px_rgba(236,72,153,0.4)] transition-all duration-700">
      {/* Corner Screws - Neon Style */}
      <div className="absolute top-2 left-2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
      <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-pink-400 rounded-full shadow-[0_0_8px_rgba(244,114,182,0.8)]"></div>
      <div className="absolute bottom-2 right-2 w-2 h-2 bg-pink-400 rounded-full shadow-[0_0_8px_rgba(244,114,182,0.8)]"></div>

      {/* Internal Tape Body (Magnetic Tape) with Neon Gradient */}
      <div className="absolute top-6 w-52 h-24 bg-gradient-to-b from-purple-900/40 to-black/60 rounded-lg border-2 border-white/5 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center opacity-20 pointer-events-none">
           <div className="w-40 h-[1px] bg-white/20"></div>
        </div>
      </div>

      {/* Reel Window & Reels */}
      <div className="w-44 h-18 bg-black/80 mt-8 rounded-2xl border-2 border-cyan-500/20 flex justify-around items-center px-4 z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        {/* Left Reel */}
        <div className="relative w-12 h-12 rounded-full border-2 border-pink-500/40 flex items-center justify-center animate-reel-spin shadow-[0_0_15px_rgba(236,72,153,0.2)]">
          <div className="absolute w-full h-1 bg-cyan-400/20"></div>
          <div className="absolute w-full h-1 bg-cyan-400/20 rotate-60"></div>
          <div className="absolute w-full h-1 bg-cyan-400/20 rotate-120"></div>
          <div className="w-5 h-5 bg-black rounded-full z-10 border border-cyan-400/50 flex items-center justify-center">
             <div className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,1)]"></div>
          </div>
          <div className="absolute inset-0 rounded-full border-[8px] border-purple-500/20 scale-105"></div>
        </div>

        {/* Tape Connector Line */}
        <div className="h-[2px] w-8 bg-gradient-to-r from-pink-500/50 via-cyan-500/50 to-pink-500/50 animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.2)]"></div>

        {/* Right Reel */}
        <div className="relative w-12 h-12 rounded-full border-2 border-cyan-500/40 flex items-center justify-center animate-reel-spin shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <div className="absolute w-full h-1 bg-pink-400/20"></div>
          <div className="absolute w-full h-1 bg-pink-400/20 rotate-60"></div>
          <div className="absolute w-full h-1 bg-pink-400/20 rotate-120"></div>
          <div className="w-5 h-5 bg-black rounded-full z-10 border border-pink-400/50 flex items-center justify-center">
             <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,1)]"></div>
          </div>
          <div className="absolute inset-0 rounded-full border-[3px] border-purple-500/20 scale-105"></div>
        </div>
      </div>

      {/* Bottom Details */}
      <div className="absolute bottom-1 w-full flex justify-center gap-12 px-10">
         <div className="w-4 h-4 bg-purple-900/40 rounded-sm border border-cyan-500/30 shadow-[0_0_5px_rgba(6,182,212,0.2)]"></div>
         <div className="w-8 h-5 bg-black/60 rounded-t-lg border-x-2 border-t-2 border-pink-500/30"></div>
         <div className="w-4 h-4 bg-purple-900/40 rounded-sm border border-cyan-500/30 shadow-[0_0_5px_rgba(6,182,212,0.2)]"></div>
      </div>

      <style>{`
        @keyframes reel-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-reel-spin {
          animation: reel-spin 5s infinite linear;
        }
      `}</style>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * funPhrases.length);
    setSubtitle(funPhrases[randomIndex]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto animate-fade-in text-center px-6">
      <div className="mb-14 relative group cursor-pointer transition-all duration-500 hover:scale-110" onClick={onEnter}>
        <CassetteTape />
        
        {/* Neon Floating Elements */}
        <div className="absolute -right-10 top-0 text-cyan-400 text-3xl animate-float-note blur-[0.5px] drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">♪</div>
        <div className="absolute -left-12 top-12 text-pink-400 text-2xl animate-float-note-delayed blur-[0.5px] drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">♫</div>
        <div className="absolute -right-14 bottom-8 text-indigo-400 text-xl animate-float-note blur-[0.5px] drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]" style={{ animationDelay: '2s' }}>♭</div>
        
        {/* Glow behind the tape */}
        <div className="absolute inset-0 bg-cyan-500/5 blur-[40px] rounded-full -z-10 animate-pulse"></div>
      </div>

      <h1 className="text-4xl md:text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 retro-font tracking-tighter leading-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
        RETRO<br/>TUNE
      </h1>
      
      <div className="min-h-[48px] flex items-center justify-center mb-12 px-4">
        <p className="text-[10px] text-cyan-300/80 uppercase tracking-[0.25em] font-black retro-font opacity-90 max-w-[320px] leading-relaxed drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">
          {subtitle || "PREPARANDO O WALKMAN NEON..."}
        </p>
      </div>

      <button
        onClick={onEnter}
        className="group relative px-10 py-4 bg-transparent overflow-hidden rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(236,72,153,0.2)]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-90 group-hover:opacity-100 group-hover:animate-gradient-x transition-opacity duration-300"></div>
        <div className="absolute inset-0 border-2 border-white/30 rounded-2xl"></div>
        <span className="relative text-white font-black retro-font text-[10px] tracking-[0.3em] uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
          JOGAR
        </span>
      </button>

      <style>{`
        @keyframes float-note {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-120px) translateX(30px) rotate(30deg); opacity: 0; }
        }
        @keyframes float-note-delayed {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(-35px) rotate(-20deg); opacity: 0; }
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float-note {
          animation: float-note 4s infinite linear;
        }
        .animate-float-note-delayed {
          animation: float-note-delayed 4.5s infinite linear 1s;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
