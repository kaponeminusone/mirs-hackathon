import { useState, useRef, useCallback, useEffect } from 'react';

interface UseAudioPlayerReturn {
    isPlaying: boolean;
    currentId: string | null;
    progress: number;
    play: (text: string, id: string) => void;
    stop: () => void;
    pause: () => void;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const estimatedDurationRef = useRef<number>(0);

    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

    const stop = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.cancel();
        }
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        setIsPlaying(false);
        setCurrentId(null);
        setProgress(0);
    }, []);

    const pause = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.pause();
        }
        setIsPlaying(false);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis;

            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                // 1. Try specific high-quality female voices on Mac/iOS
                let bestVoice = voices.find(v => v.name === 'Monica' || v.name === 'Paulina');

                // 2. Try Google Spanic Female
                if (!bestVoice) bestVoice = voices.find(v => v.name.includes('Google') && v.name.includes('Español'));

                // 3. Try any Spanish voice
                if (!bestVoice) bestVoice = voices.find(v => v.lang.startsWith('es'));

                if (bestVoice) {
                    console.log('Selected Voice:', bestVoice.name);
                    setSelectedVoice(bestVoice);
                }
            };

            loadVoices();
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
        }
        return () => {
            // Cleanup handled by onvoiceschanged reassignment if strictly needed, 
            // but usually fine to leave listener or nullify
            stop();
        };
    }, [stop]);

    const play = useCallback((text: string, id: string) => {
        if (!synthRef.current) return;

        // Stop any current playback
        stop();

        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; // Force Spanish
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.pitch = 1.1; // Slightly higher pitch for friendliness
        utterance.rate = 1.05; // Slightly faster/energetic
        utteranceRef.current = utterance;

        // Estimate duration for progress bar (Web Speech API doesn't give duration)
        // Average speaking rate ~150-170 words per minute -> ~350-400ms per word
        const wordCount = text.split(/\s+/).length;
        estimatedDurationRef.current = Math.max(1000, wordCount * 350);
        startTimeRef.current = Date.now();

        utterance.onstart = () => {
            setIsPlaying(true);
            setCurrentId(id);
            setProgress(0);

            // Simulate progress
            progressIntervalRef.current = setInterval(() => {
                const elapsed = Date.now() - startTimeRef.current;
                const p = Math.min(100, (elapsed / estimatedDurationRef.current) * 100);
                setProgress(p);
            }, 50); // Update every 50ms
        };

        utterance.onend = () => {
            stop();
            setProgress(100);
        };

        utterance.onerror = (e) => {
            // Ignore interruption errors which happen when we cancel execution
            // @ts-ignore - error property exists on SpeechSynthesisErrorEvent
            if (e.error === 'interrupted' || e.error === 'canceled') {
                return;
            }

            // @ts-ignore - error property exists on SpeechSynthesisErrorEvent
            console.error('TTS Error:', e.error || e);
            stop();
        };

        synthRef.current.speak(utterance);
    }, [stop]);

    return {
        isPlaying,
        currentId,
        progress,
        play,
        stop,
        pause
    };
}
