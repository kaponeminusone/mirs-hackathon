import { useState, useRef, useCallback, useEffect } from 'react';
import { processVoiceTriage, TriageResponse } from '@/app/actions/process-triage';

interface UseVoiceInteractionProps {
    onTriageComplete: (result: TriageResponse) => void;
    onError?: (error: string) => void;
}

interface UseVoiceInteractionReturn {
    isRecording: boolean;
    isProcessing: boolean;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
}

export function useVoiceInteraction({ onTriageComplete, onError }: UseVoiceInteractionProps): UseVoiceInteractionReturn {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Silence detection configuration
    const SILENCE_THRESHOLD = -50; // dB
    const SILENCE_DURATION = 2000; // ms

    const cleanupAudioContext = () => {
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
    };

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop(); // This triggers onstop, which handles processing
            setIsRecording(false);
            cleanupAudioContext();
        }
    }, []);

    const startRecording = useCallback(async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                const errorMsg = "Microphone access is only available on HTTPS or Localhost. Please connect via USB debugging or set up a secure tunnel.";
                if (onError) onError(errorMsg);
                else alert(errorMsg);
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            // Setup Audio Context for Silence Detection
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const checkForSilence = () => {
                if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;

                analyser.getByteFrequencyData(dataArray);

                // Calculate volume (average)
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                const average = sum / bufferLength;
                // Normalize roughly to dB (0-255 map) - simpler heuristic for web
                // Silence usually < 10-15 in this array scale

                if (average < 15) { // Threshold for silence
                    if (!silenceTimerRef.current) {
                        silenceTimerRef.current = setTimeout(() => {
                            console.log('Silence detected, stopping recording...');
                            stopRecording();
                        }, SILENCE_DURATION);
                    }
                } else {
                    if (silenceTimerRef.current) {
                        clearTimeout(silenceTimerRef.current);
                        silenceTimerRef.current = null;
                    }
                }

                requestAnimationFrame(checkForSilence);
            };

            checkForSilence();

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                stream.getTracks().forEach(track => track.stop());

                // Only process if we have data
                if (audioBlob.size > 0) {
                    await handleProcessing(audioBlob);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            if (onError) onError('Could not access microphone');
        }
    }, [stopRecording]); // Add stopRecording dependency

    const handleProcessing = async (audioBlob: Blob) => {
        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');

            const result = await processVoiceTriage(formData);
            onTriageComplete(result);
        } catch (error) {
            console.error('Processing failed:', error);
            if (onError) onError('Processing failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        isRecording,
        isProcessing,
        startRecording,
        stopRecording
    };
}
