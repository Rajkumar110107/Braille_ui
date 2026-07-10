import React, { useState, useEffect } from 'react';

/**
 * DisplayPanel component - Shows current sentence and AI response.
 */
const DisplayPanel = ({ sentence, aiResponse }) => {
  const [displayedAI, setDisplayedAI] = useState("");
  
  // Typing animation for AI response
  useEffect(() => {
    if (!aiResponse) {
      setDisplayedAI("");
      return;
    }
    
    let i = 0;
    setDisplayedAI("");
    const interval = setInterval(() => {
      setDisplayedAI(prev => aiResponse.slice(0, i + 1));
      i++;
      if (i >= aiResponse.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [aiResponse]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      {/* User Input Section */}
      <div className="glass-card p-6 min-h-[120px] flex flex-col justify-between border-l-4 border-l-cyan-500">
        <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">Detected Sentence</span>
        <p className="text-2xl font-light text-white leading-relaxed">
          {sentence || <span className="opacity-20 italic">Waiting for input...</span>}
          <span className="typing-cursor ml-1"></span>
        </p>
      </div>

      {/* AI Response Section */}
      <div className="glass-card p-8 min-h-[250px] relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent border-l-4 border-l-purple-500">
        <div className="absolute top-0 right-0 p-4">
          <svg className="w-8 h-8 text-purple-500/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22C11.79 22 11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2C12.21 2 12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z" />
          </svg>
        </div>
        
        <span className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 block">AI Assistive Feedback</span>
        
        <div className="relative z-10">
          {aiResponse ? (
            <p className="text-xl text-white/90 font-medium leading-relaxed leading-8">
              {displayedAI}
            </p>
          ) : (
            <div className="flex flex-col gap-2 opacity-20">
              <div className="h-4 w-3/4 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-white/20 rounded animate-pulse delay-75"></div>
              <div className="h-4 w-5/6 bg-white/20 rounded animate-pulse delay-150"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayPanel;
