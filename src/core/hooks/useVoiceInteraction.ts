import { useState, useRef, useCallback } from 'react';
import { processVoiceTriage, TriageResponse } from '@/app/actions/process-triage';

interface UseVoiceInteractionReturn {
    isRecording: boolean;
    isProcessing: boolean;
    transcript: string | null;
    triageResult: TriageResponse | null;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    reset: () => void;
}

export function useVoiceInteraction(): UseVoiceInteractionReturn {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState<string | null>(null);
    const [triageResult, setTriageResult] = useState<TriageResponse | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                // Clean up tracks
                stream.getTracks().forEach(track => track.stop());

                // Trigger processing
                await handleProcessing(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setTranscript(null);
            setTriageResult(null);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Could not access microphone. Please ensure permissions are granted.');
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, []);

    const handleProcessing = async (audioBlob: Blob) => {
        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');

            const result = await processVoiceTriage(formData);

            setTranscript(result.transcript);
            setTriageResult(result);
        } catch (error) {
            console.error('Processing failed:', error);
            // Determine if error is due to missing key for better DX
            setTranscript("Error: processing failed. Check console for details.");
        } finally {
            setIsProcessing(false);
        }
    };

    const reset = () => {
        setTranscript(null);
        setTriageResult(null);
        setIsRecording(false);
        setIsProcessing(false);
    };

    return {
        isRecording,
        isProcessing,
        transcript,
        triageResult,
        startRecording,
        stopRecording,
        reset
    };
}
