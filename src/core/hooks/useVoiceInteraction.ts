import { useState, useRef, useCallback, useEffect } from 'react';
import { processVoiceTriage, TriageResponse } from '@/app/actions/process-triage';

// Augment window for Web Speech API
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

interface UseVoiceInteractionProps {
    onTriageComplete: (result: TriageResponse) => void;
    onError?: (error: string) => void;
    sessionId?: string | null; // Allow null
    patientId?: string;
}

interface UseVoiceInteractionReturn {
    isRecording: boolean;
    isProcessing: boolean;
    liveTranscript: string;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
}

export function useVoiceInteraction({ onTriageComplete, onError, sessionId, patientId = '1' }: UseVoiceInteractionProps): UseVoiceInteractionReturn {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState('');

    // Refs for props to avoid stale closures in async callbacks
    const onTriageCompleteRef = useRef(onTriageComplete);
    const sessionIdRef = useRef(sessionId);
    const patientIdRef = useRef(patientId);

    useEffect(() => {
        onTriageCompleteRef.current = onTriageComplete;
        sessionIdRef.current = sessionId;
        patientIdRef.current = patientId;
    }, [onTriageComplete, sessionId, patientId]);

    const recognitionRef = useRef<any>(null);
    // ... (rest of refs)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // ... (silence detection logic)
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
            mediaRecorderRef.current.stop(); // This triggers onstop

            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }

            setIsRecording(false);
            cleanupAudioContext();
        }
    }, []);

    const startRecording = useCallback(async () => {
        // ... (getUserMedia and setup)
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                const errorMsg = "Microphone access is only available on HTTPS or Localhost.";
                if (onError) onError(errorMsg);
                else alert(errorMsg);
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
            setLiveTranscript('');

            // Setup Speech Recognition
            const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
            const SpeechRecognitionClass = SpeechRecognition || webkitSpeechRecognition;

            if (SpeechRecognitionClass) {
                const recognition = new SpeechRecognitionClass();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'es-ES';

                recognition.onresult = (event: any) => {
                    let interimTranscript = '';
                    let finalTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }
                    setLiveTranscript(finalTranscript || interimTranscript);
                };

                recognition.onerror = (event: any) => {
                    console.warn('Speech recognition error:', event.error);
                };

                recognition.start();
                recognitionRef.current = recognition;
            }

            // Setup Audio Context (Same as before)
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;
            // ... (rest of audio setup)

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const checkForSilence = () => {
                if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
                const average = sum / bufferLength;

                if (average < 15) {
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
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                stream.getTracks().forEach(track => track.stop());
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
    }, [stopRecording, onError]); // Added onError to deps

    const handleProcessing = async (audioBlob: Blob) => {
        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');

            // Use current IDs from refs
            const currentSession = sessionIdRef.current || 'session-voice-' + Date.now();
            const currentPatient = patientIdRef.current || '1';

            const result = await processVoiceTriage(formData, currentSession, currentPatient);
            if (onTriageCompleteRef.current) {
                onTriageCompleteRef.current(result);
            }
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
        liveTranscript,
        startRecording,
        stopRecording
    };
}
