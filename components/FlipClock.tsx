import React, { useEffect, useState, useRef } from 'react';

// --- Types & Interfaces ---
interface FlipDigitProps {
  digit: string | number;
}

// --- Single Digit Component ---
const FlipDigit: React.FC<FlipDigitProps> = ({ digit }) => {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [nextDigit, setNextDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  // We use a ref to track if the component is mounted to prevent state updates on unmount
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (digit !== currentDigit) {
      setNextDigit(digit);
      setIsFlipping(true);

      // Animation duration is 600ms.
      // We set the timeout slightly longer or exactly equal. 
      // The critical fix is the conditional CSS class below (duration-0 vs duration-600).
      const timer = setTimeout(() => {
        if (isMounted.current) {
          setCurrentDigit(digit);
          setIsFlipping(false);
        }
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [digit, currentDigit]);

  return (
    <div className="relative w-16 h-24 sm:w-20 sm:h-28 md:w-28 md:h-40 perspective-1000 mx-[2px] bg-[#1e1b4b] rounded-lg shadow-xl border border-white/5">
      
      {/* 1. Static Top Half (Next Digit - Revealed behind) */}
      <div className="absolute top-0 left-0 w-full h-[50%] z-0">
        <HalfCard value={nextDigit} side="top" />
      </div>

      {/* 2. Static Bottom Half (Current Digit - Covered at end) */}
      <div className="absolute bottom-0 left-0 w-full h-[50%] z-0">
        <HalfCard value={currentDigit} side="bottom" />
      </div>

      {/* 3. The Flipper (Top half rotates down) */}
      <div 
        className={`
          absolute top-0 left-0 w-full h-[50%] z-10 origin-bottom transform-style-3d 
          ${isFlipping ? 'transition-transform duration-600 ease-in-out' : 'duration-0'}
        `}
        style={{ 
          transform: isFlipping ? 'rotateX(-180deg)' : 'rotateX(0deg)',
          willChange: 'transform' // Hardware acceleration hint
        }}
      >
        {/* Front Face: Current Top */}
        <div className="absolute inset-0 backface-hidden z-20">
           <HalfCard value={currentDigit} side="top" />
           {/* Shadow Overlay */}
           <div 
             className={`absolute inset-0 bg-black transition-opacity ${isFlipping ? 'duration-600' : 'duration-0'}`}
             style={{ opacity: isFlipping ? 0.6 : 0 }} 
           />
        </div>

        {/* Back Face: Next Bottom */}
        <div 
          className="absolute inset-0 backface-hidden z-20"
          style={{ 
            transform: 'rotateX(-180deg)',
          }}
        >
           <HalfCard value={nextDigit} side="bottom" />
           {/* Highlight Overlay */}
           <div 
             className={`absolute inset-0 bg-black transition-opacity ${isFlipping ? 'duration-600' : 'duration-0'}`}
             style={{ opacity: isFlipping ? 0 : 0.6 }} 
           />
        </div>
      </div>
      
      {/* Decorative Hinge Line */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#000000] z-30 transform -translate-y-1/2 shadow-sm opacity-30" />
    </div>
  );
};

// --- Helper: Half Card Renderer ---
const HalfCard: React.FC<{ value: string | number; side: 'top' | 'bottom' }> = ({ value, side }) => {
  const isTop = side === 'top';
  
  return (
    <div 
      className={`relative w-full h-full overflow-hidden bg-white text-[#2e1065] flex justify-center
        ${isTop ? 'rounded-t-lg items-end' : 'rounded-b-lg items-start'}
      `}
    >
      <div 
        className={`absolute left-0 w-full h-[200%] flex items-center justify-center
           ${isTop ? 'top-0' : 'bottom-0'}
        `}
      >
        <span className="text-6xl sm:text-7xl md:text-[6.5rem] font-black font-[Inter] tracking-tighter leading-none select-none">
          {value}
        </span>
      </div>
    </div>
  );
};


// --- Main Clock Component ---
interface FlipClockProps {
  targetDate?: Date; 
}

export const FlipClock: React.FC<FlipClockProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let end = targetDate;
      
      if (!end) {
        end = new Date();
        end.setHours(23, 59, 59, 999);
      }

      const diff = end.getTime() - now.getTime();
      
      if (diff <= 0) return { h: '00', m: '00', s: '00' };

      const hours = Math.floor((diff / (1000 * 60 * 60)));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return {
        h: String(hours).padStart(2, '0'),
        m: String(minutes).padStart(2, '0'),
        s: String(seconds).padStart(2, '0'),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-2 sm:gap-4 p-4 transform scale-90 sm:scale-100">
      <div className="flex gap-1 md:gap-2">
        <FlipDigit digit={timeLeft.h[0]} />
        <FlipDigit digit={timeLeft.h[1]} />
      </div>
      
      <div className="flex flex-col gap-3 md:gap-6 justify-center pb-2 h-24 sm:h-28 md:h-40">
        <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
        <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
      </div>
      
      <div className="flex gap-1 md:gap-2">
        <FlipDigit digit={timeLeft.m[0]} />
        <FlipDigit digit={timeLeft.m[1]} />
      </div>
      
      <div className="flex flex-col gap-3 md:gap-6 justify-center pb-2 h-24 sm:h-28 md:h-40">
        <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
        <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
      </div>
      
      <div className="flex gap-1 md:gap-2">
        <FlipDigit digit={timeLeft.s[0]} />
        <FlipDigit digit={timeLeft.s[1]} />
      </div>
    </div>
  );
};
