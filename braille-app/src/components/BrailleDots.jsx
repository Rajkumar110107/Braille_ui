import React from 'react';

/**
 * BrailleDots component - Visualizes a 6-dot Braille cell.
 * @param {string} pattern - 6-bit string (e.g., "100000")
 */
const BrailleDots = ({ pattern = "000000" }) => {
  // Braille dots are traditionally numbered:
  // 1 4
  // 2 5
  // 3 6
  const dotIndices = [0, 3, 1, 4, 2, 5]; // Mapping 6-bit string index to UI positions

  return (
    <div className="flex flex-col items-center justify-center p-8 glass-card animate-subtle-float">
      <h2 className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-8">Braille Matrix</h2>
      <div className="grid grid-cols-2 gap-8 p-4">
        {dotIndices.map((bitIndex, i) => {
          const isActive = pattern[bitIndex] === '1';
          return (
            <div
              key={i}
              className={`braille-dot w-16 h-16 rounded-full border-4 ${
                isActive 
                  ? 'active border-transparent' 
                  : 'border-white/10 bg-white/5'
              } flex items-center justify-center shadow-lg`}
              aria-label={`Dot ${i + 1} ${isActive ? 'active' : 'inactive'}`}
            >
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-white' : 'bg-white/5'}`} />
            </div>
          );
        })}
      </div>
      <div className="mt-8 text-white/40 text-xs font-mono tracking-tighter">
        BIT PATTERN: {pattern}
      </div>
    </div>
  );
};

export default BrailleDots;
