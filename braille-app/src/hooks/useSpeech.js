import { useRef, useCallback, useState } from 'react';

/**
 * Custom hook for Web Speech API integration.
 * Handles speaking text and prevents repetitive speech.
 */
export const useSpeech = () => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const lastSpokenLetter = useRef("");
  const lastSpokenAI = useRef("");

  const speak = useCallback((text, type = "letter") => {
    if (!isVoiceEnabled || !text || !window.speechSynthesis) return;

    // Check for repetition
    if (type === "letter" && text === lastSpokenLetter.current) return;
    if (type === "ai" && text === lastSpokenAI.current) return;

    // Update trackers
    if (type === "letter") lastSpokenLetter.current = text;
    if (type === "ai") lastSpokenAI.current = text;

    // Speak
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Customize voice settings
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
  }, [isVoiceEnabled]);

  const toggleVoice = () => setIsVoiceEnabled(prev => !prev);

  return { speak, isVoiceEnabled, toggleVoice };
};
