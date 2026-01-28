import React, { useState, useEffect, useRef } from 'react';
import { FlipClock } from './components/FlipClock';
import { RollingCounter } from './components/RollingCounter';
import { Fireworks, FireworksHandle } from './components/Fireworks';
import { ChevronDown } from 'lucide-react';

export default function App() {
  const [dataValue, setDataValue] = useState(969900000000);
  const fireworksRef = useRef<FireworksHandle>(null);

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly increase the number to simulate live data
      const increment = Math.floor(Math.random() * 500000) + 100000;
      setDataValue((prev) => prev + increment);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleFireworks = () => {
    if (fireworksRef.current) {
      fireworksRef.current.launch();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#240a5e] text-white font-inter">
      
      {/* --- Backgrounds --- */}
      {/* Deep Purple Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center_top,_#4c1d95_0%,_#1e1b4b_60%,_#0f0720_100%)] z-[-2]"></div>
      
      {/* Subtle Fireworks/Particles in Background Image (Simulated by opacity dots for now or keeping user's fireworks) */}
      <Fireworks ref={fireworksRef} />

      {/* --- Header Section --- */}
      <header className="relative w-full pt-4 px-6 flex justify-between items-start z-20 opacity-80">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded text-xs text-gray-300 cursor-pointer">
            <span>架构</span>
            <span>全部</span>
            <ChevronDown size={12} />
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded text-xs text-gray-300 cursor-pointer">
            <span>行业</span>
            <span>全部</span>
            <ChevronDown size={12} />
          </div>
        </div>
        <div className="text-xs text-gray-400">数据更新时间 12:00:00</div>
      </header>

      {/* --- MAIN DISPLAY --- */}
      <main className="relative w-full flex flex-col items-center mt-4">
        
        {/* Title Group */}
        <div className="flex flex-col items-center z-10">
          <div className="flex items-center gap-3">
             {/* Left Horn/Cone Graphic (CSS Shape) */}
             <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-purple-800 rounded-tl-3xl rounded-br-lg transform -rotate-45 opacity-80"></div>
             
             <h1 className="text-4xl md:text-6xl font-bold tracking-wide text-white drop-shadow-lg">
               BIGDAY 实时大盘
             </h1>
             
             {/* Right Horn/Cone Graphic */}
             <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-bl from-purple-400 to-purple-800 rounded-tr-3xl rounded-bl-lg transform rotate-45 opacity-80"></div>
          </div>
          
          <div className="flex items-center gap-2 text-white/80 mt-2 mb-8">
             <span className="text-yellow-300 text-xs">✦</span>
             <span className="font-bold tracking-widest text-lg">2025</span>
             <span className="text-yellow-300 text-xs">✦</span>
          </div>
        </div>

        {/* --- NEON CURVE SEPARATOR --- */}
        <div className="absolute top-[140px] w-full h-[60px] md:h-[100px] z-0 pointer-events-none">
           <svg width="100%" height="100%" viewBox="0 0 1440 100" preserveAspectRatio="none">
             {/* Outer Glow */}
             <path d="M0,20 Q720,120 1440,20" fill="none" stroke="#a855f7" strokeWidth="8" className="blur-md opacity-60" />
             {/* Core Line */}
             <path d="M0,20 Q720,120 1440,20" fill="none" stroke="url(#neonGradient)" strokeWidth="4" />
             {/* Inner White Core */}
             <path d="M0,20 Q720,120 1440,20" fill="none" stroke="white" strokeWidth="1" opacity="0.8" />
             
             <defs>
               <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#3b82f6" />
                 <stop offset="50%" stopColor="#d8b4fe" />
                 <stop offset="100%" stopColor="#3b82f6" />
               </linearGradient>
             </defs>
           </svg>
        </div>

        {/* --- COUNTDOWN --- */}
        <div className="relative z-10 flex flex-col items-center mt-12 mb-8">
          <p className="text-white text-lg md:text-xl mb-4 font-medium tracking-wide">距离今天结束</p>
          <FlipClock />
        </div>

        {/* --- ROLLING NUMBER --- */}
        <div className="relative z-10 w-full flex flex-col items-center mt-4">
           
           <RollingCounter value={dataValue} />
           
           {/* Unit Labels: Positioned roughly under where the commas would align for 100B+ */}
           <div className="flex w-full max-w-4xl justify-between px-20 md:px-32 mt-2 text-white/50">
               {/* These are absolutely positioned relative to the center or flex-spaced to match visual columns */}
               <div className="relative w-full h-12">
                  {/* Yi (100 Million) Label */}
                  <div className="absolute left-[38%] md:left-[35%] transform -translate-x-1/2 flex flex-col items-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded border border-white/20 flex items-center justify-center backdrop-blur-md">
                        <span className="text-white text-lg md:text-xl font-bold">亿</span>
                    </div>
                  </div>

                  {/* Wan (10 Thousand) Label */}
                  <div className="absolute right-[22%] md:right-[22%] transform translate-x-1/2 flex flex-col items-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded border border-white/20 flex items-center justify-center backdrop-blur-md">
                        <span className="text-white text-lg md:text-xl font-bold">万</span>
                    </div>
                  </div>
               </div>
           </div>

        </div>

      </main>

      {/* --- Trigger Button --- */}
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
        <button 
          onClick={handleFireworks}
          className="px-8 py-3 bg-purple-600/80 hover:bg-purple-500 rounded-full text-white font-bold shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all border border-purple-400/30 backdrop-blur-md"
        >
          点击燃放烟花
        </button>
      </div>

    </div>
  );
}