import React from 'react';
import { motion } from 'framer-motion';

// Height of one number in the strip
const DIGIT_HEIGHT = 160; 

interface RollingDigitProps {
  digit: number;
}

const RollingDigit: React.FC<RollingDigitProps> = ({ digit }) => {
  return (
    <div 
      style={{ height: DIGIT_HEIGHT }} 
      // CRITICAL FIX: Apply font size here so 'em' width is relative to the big text, not the body text.
      // 0.7em at 140px is ~98px, which fits the digit.
      className="relative overflow-hidden w-[0.7em] inline-block align-top mx-[2px] text-[100px] md:text-[140px] font-black font-[Inter] leading-none text-white"
    >
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: -1 * digit * DIGIT_HEIGHT }}
        transition={{ type: 'spring', stiffness: 40, damping: 15, mass: 1.2 }}
        className="absolute top-0 left-0 w-full flex flex-col items-center"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div
            key={num}
            style={{ height: DIGIT_HEIGHT }}
            className="flex items-center justify-center w-full"
          >
            {num}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

interface RollingCounterProps {
  value: number;
}

export const RollingCounter: React.FC<RollingCounterProps> = ({ value }) => {
  const formatted = value.toLocaleString('en-US'); 
  const chars = formatted.split('');

  return (
    <div className="flex items-baseline justify-center tracking-tight leading-none">
      {chars.map((char, index) => {
        if (!isNaN(parseInt(char))) {
          return <RollingDigit key={`digit-${index}-${chars.length}`} digit={parseInt(char)} />;
        }
        // Render commas
        return (
          <span key={`char-${index}`} className="mx-2 text-[60px] md:text-[80px] font-black text-white/50 transform -translate-y-4 md:-translate-y-6 font-[Inter]">
            {char}
          </span>
        );
      })}
    </div>
  );
};