import React, { useEffect, useState } from 'react';
import BrailleDots from './components/BrailleDots';
import DisplayPanel from './components/DisplayPanel';
import InputBox from './components/InputBox';
import { useFetch } from './hooks/useFetch';
import { useSpeech } from './hooks/useSpeech';

const BACKEND_URL = "http://localhost:5000";

function App() {
  const { data, loading, error, manualSetData } = useFetch(`${BACKEND_URL}/data`, 500);
  const { speak, isVoiceEnabled, toggleVoice } = useSpeech();
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  // Handle Voice Feedback based on data updates
  useEffect(() => {
    if (data.last_letter) {
      speak(data.last_letter, "letter");
    }
  }, [data.last_letter, speak]);

  useEffect(() => {
    if (data.ai_response) {
      speak(data.ai_response, "ai");
    }
  }, [data.ai_response, speak]);

  // Update connection status
  useEffect(() => {
    if (error) setConnectionStatus("disconnected");
    else if (!loading) setConnectionStatus("connected");
  }, [loading, error]);

  const handleSimulate = async (sentence) => {
    try {
      const res = await fetch(`${BACKEND_URL}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence })
      });
      const result = await res.json();
      manualSetData({
        sentence: result.sentence,
        ai_response: result.ai_response,
        pattern: "000000",
        last_letter: ""
      });
    } catch (err) {
      console.error("Simulation failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-main-gradient selection:bg-cyan-500/30">
      {/* Navbar / Header */}
      <nav className="p-6 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-glow-cyan animate-pulse">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Braille AI Assistive System</h1>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`} />
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                {connectionStatus === 'connected' ? 'Systems Online' : 'Connecting to Core...'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleVoice}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border ${
              isVoiceEnabled 
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' 
                : 'bg-white/5 border-white/10 text-white/40'
            }`}
            title="Toggle Voice Feedback"
          >
            {isVoiceEnabled ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
            )}
            <span className="text-sm font-semibold uppercase tracking-wider">{isVoiceEnabled ? 'Voice ON' : 'Voice OFF'}</span>
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        {error && (
          <div className="mb-8 p-4 glass-card border-red-500/30 bg-red-500/5 text-red-200 flex items-center gap-3 animate-bounce">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>Backend link failed. Please ensure Flask server is running on port 5000.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Panel: Braille Visualization */}
          <section className="flex flex-col items-center gap-8">
            <div className="w-full">
              <h3 className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] mb-6 text-center">Real-Time Pattern Recognition</h3>
              <BrailleDots pattern={data.pattern} />
            </div>
            
            <div className="w-full p-6 glass-card border-white/5 flex flex-col gap-4">
              <h4 className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Recent Activity Log</h4>
              <div className="flex gap-2 flex-wrap">
                {data.sentence.split("").slice(-10).map((char, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 rounded-md text-cyan-400 font-mono border border-white/5">{char}</span>
                ))}
                {data.sentence && <span className="animate-pulse text-cyan-400">_</span>}
              </div>
            </div>
          </section>

          {/* Right Panel: AI Interaction */}
          <section className="flex flex-col gap-8 h-full">
            <DisplayPanel 
              sentence={data.sentence} 
              aiResponse={data.ai_response} 
            />
            
            <div className="mt-auto">
              <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Manual Command Interface</h3>
              <InputBox onSimulate={handleSimulate} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-12 p-8 border-t border-white/5 text-center">
        <p className="text-white/20 text-xs tracking-widest uppercase">
          Empowering Accessibility Through AI & Physical Interfaces
        </p>
      </footer>
    </div>
  );
}

export default App;
