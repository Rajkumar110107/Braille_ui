import React, { useState } from 'react';

/**
 * InputBox component - Allows manual simulation of text.
 */
const InputBox = ({ onSimulate }) => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    await onSimulate(text);
    setText("");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mt-8">
      <div className="relative group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type manually to simulate Braille sentence..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all glass-effect pr-24"
          aria-label="Manual text simulation input"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? '...' : 'Simulate'}
        </button>
      </div>
    </form>
  );
};

export default InputBox;
