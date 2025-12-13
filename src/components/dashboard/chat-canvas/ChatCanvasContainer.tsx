"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BigMicHero from './BigMicHero';
import MessageStream, { Message } from './MessageStream';
import FixedInputBar from './FixedInputBar';
import MirsLogo from '@/components/ui/MirsLogo';
import { useVoiceInteraction } from '@/core/hooks/useVoiceInteraction';
import { useAudioPlayer } from '@/core/hooks/useAudioPlayer';

import { useChatStore } from '@/core/store/chatStore';

import { analyzeImage } from '@/app/actions/analyze-image';
import { processTextTriage } from '@/app/actions/process-triage';

export default function ChatCanvasContainer() {
    const [isActiveSession, setIsActiveSession] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const {
        activeSessionId,
        isLoading,
        isMuted,
        currentPatientId, // NEW: Get global patient ID
        toggleMute,
        addSession,
        updateSession,
        sessions
    } = useChatStore();

    // Reset loop when New Chat is triggered OR Load Session content
    useEffect(() => {
        if (!activeSessionId) {
            setIsActiveSession(false);
            setMessages([]);
        } else {
            // Find the session in logic storage
            const session = sessions.find(s => s.id === activeSessionId);
            if (session) {
                // Load its messages
                setMessages(session.messages);
                setIsActiveSession(true);
            }
        }
    }, [activeSessionId, sessions]);

    // ... (Loading state check remains same)

    const audioPlayer = useAudioPlayer();

    // Stop audio immediately if muted
    useEffect(() => {
        if (isMuted) {
            audioPlayer.stop();
        }
    }, [isMuted]);

    // Tie Voice Hook to Audio Player: Stop audio when recording starts
    // Pass current session ID to keep backend context in sync
    const { isRecording, isProcessing, liveTranscript, startRecording, stopRecording } = useVoiceInteraction({
        onTriageComplete: (result) => {
            // NEW FLOW: The hook only returns the TRANSCRIPT now.
            if (result.transcript) {
                const text = result.transcript;
                console.log("CLIENT: Voice Transcript received:", text);
                handleSendMessage(text);
            }
        },
        onError: (err) => {
            console.error(err);
            const errorMsg: Message = {
                id: Date.now().toString(),
                role: 'ai',
                content: `Error de voz: ${err}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        },
        sessionId: activeSessionId || 'GENERATED_ON_SEND', // Placeholder, we handle ID generation in send match, but hook needs something.
        patientId: currentPatientId // Dynamic!
    });

    // Intercept Recording Start to stop Audio
    const handleStartRecording = () => {
        audioPlayer.stop();
        startRecording();
    };

    const handleStartSession = () => {
        if (!isRecording) {
            handleStartRecording();
        } else {
            stopRecording();
        }
    };

    // Image Handling State
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
    const [visualContext, setVisualContext] = useState<string | null>(null);
    const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
    const [isThinking, setIsThinking] = useState(false);

    // Ref to track the *ongoing* analysis promise to avoid race conditions/stale state
    const analysisPromiseRef = useRef<Promise<string | null> | null>(null);

    const handleImageSelect = (file: File) => {
        console.log("CLIENT: handleImageSelect called. File:", file.name);
        // Create local preview
        const reader = new FileReader();
        reader.onload = (e) => setSelectedImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
        setSelectedImage(file);

        // Clearing previous context if any
        setVisualContext(null);
        console.log("CLIENT: Image selected. Waiting for user to send.");
    };

    const handleClearImage = () => {
        setSelectedImage(null);
        setSelectedImagePreview(null);
        setVisualContext(null);
        setIsAnalyzingImage(false);
        analysisPromiseRef.current = null;
    };

    const handleSendMessage = async (text: string) => {
        console.log("CLIENT: handleSendMessage called. Text:", text);

        audioPlayer.stop();
        if (!isActiveSession) {
            setIsActiveSession(true);
        }

        // 1. Construct User Message
        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            imageUrl: selectedImagePreview || undefined
        };

        // UI Optimistic Update
        let updatedMessages: Message[] = [];
        let currentSessionId = activeSessionId;

        if (!activeSessionId) {
            // GENERATE NEW DYNAMIC SESSION
            const newId = crypto.randomUUID();
            // Reuse test IDs for specific prompts if we want strict demo behavior? 
            // User requested "allow config sync... easier to switch". 
            // So we should adhere to the patient ID. 
            // If patient is 1 -> 'test-final-1' behavior logic is on backend?
            // Actually, backend might rely on session ID for memory.
            // But let's use the random UUID as a real app would.
            // UNLESS the prompt implies "test-final-1" is required for the *specific canned backend response*.
            // "Cada vez que cree un nuevo chat, que se cambie el sesion id". -> Random is good.

            updatedMessages = [newUserMsg];
            currentSessionId = newId;

            const summary = text.substring(0, 30) + (text.length > 30 ? '...' : '');
            addSession({
                id: newId,
                date: 'Ahora',
                summary: summary,
                triageLevel: 'BLUE',
                patientName: currentPatientId === '20' ? 'Paciente 20' : 'Paciente 1',
                messages: updatedMessages
            });
        } else {
            const currentSession = sessions.find(s => s.id === activeSessionId);
            updatedMessages = currentSession ? [...currentSession.messages, newUserMsg] : [newUserMsg];
            updateSession(activeSessionId, { messages: updatedMessages });
        }
        setMessages(updatedMessages);

        // ... (Image handling clear logic)
        const imageToSend = selectedImage;
        const previewToSend = selectedImagePreview;
        handleClearImage();

        // 2. Prepare for Backend Processing
        setIsThinking(true); // Show loader immediately
        let messageToSend = text;

        // ... (Image Analysis Logic) 
        if (imageToSend) {
            // ... same analyze logic ...
            try {
                const formData = new FormData();
                formData.append('file', imageToSend);
                const result = await analyzeImage(formData);
                if (result.success && result.description) {
                    messageToSend += `\n\n(Contexto Visual detectado: ${result.description})`;
                } else {
                    messageToSend += `\n\n(Error análisis visual: ${result.error})`;
                }
            } catch (e) { console.error(e); }
        }

        console.log("CLIENT: Final messageToSend:", messageToSend);

        // 4. Call Real AI Action (Triage/Response)
        try {
            // Using Dynamic Session ID and Dynamic Patient ID
            const targetSession = currentSessionId!;

            console.log(`Calling Triage: Session=${targetSession}, Patient=${currentPatientId}`);

            const result = await processTextTriage(messageToSend, targetSession, currentPatientId);

            const aiMsgId = (Date.now() + 1).toString();

            // Unified Bubble Logic: 
            // One message. Color determined by triageLevel. 
            // Content contains Recommendation + Follow-up Questions (appended in server action).

            const aiText = result.aiResponse;
            const newAiMsg: Message = {
                id: aiMsgId,
                role: 'ai',
                content: aiText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                triageLevel: result.triageLevel as any
            };

            const finalMessages = [...updatedMessages, newAiMsg];

            // 2. Follow-Up Questions Bubble (Separate)
            if (result.followUpQuestions && result.followUpQuestions.length > 0) {
                const qMsgId = (Date.now() + 2).toString();
                // Format nicely
                const questionsText = result.followUpQuestions.map((q: string) => "• " + q).join("\n");

                const qMsg: Message = {
                    id: qMsgId,
                    role: 'ai',
                    content: "**Preguntas de seguimiento:**\n" + questionsText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    triageLevel: result.triageLevel as any, // Inherit color
                    type: 'recommendation'
                };
                finalMessages.push(qMsg);
            }

            // 3. Supplemental Llama Message (Empathetic Close)
            if (result.supplementalMessage) {
                const supMsgId = (Date.now() + 3).toString();
                const supMsg: Message = {
                    id: supMsgId,
                    role: 'ai',
                    content: `_${result.supplementalMessage}_`, // Italicized for "side note" feel
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    triageLevel: 'BLUE', // Neutral/Supportive Color
                    type: 'default'
                };
                finalMessages.push(supMsg);
            }

            if (currentSessionId) {
                updateSession(currentSessionId, { messages: finalMessages });
            }
            // If new session started with test-final-1, we should probably update the ID if we had a mechanism, 
            // but for this demo flow, local state is sufficient.

            setMessages(finalMessages);

            if (!isMuted) {
                setTimeout(() => {
                    audioPlayer.play(aiText, aiMsgId);
                }, 100);
            }

        } catch (error: any) {
            console.error("Text triage error:", error);

            let friendlyError = "Lo siento, tuve un problema conectando con el servidor.";
            // If it's the specific "Lo..." JSON error, give a hint
            if (error.message && error.message.includes('Unrecognized token')) {
                friendlyError = "El asistente médico está teniendo problemas para interpretar la respuesta. Por favor intenta reformular tu pregunta.";
            }

            const errorMsg: Message = {
                id: Date.now().toString(),
                role: 'ai',
                content: friendlyError + `\n(Detalle técnico: ${error.message.substring(0, 50)}...)`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                triageLevel: 'RED'
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            <AnimatePresence mode="wait">
                {!isActiveSession ? (
                    <motion.div
                        key="zero-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col min-h-0"
                    >
                        <BigMicHero
                            onActivate={handleStartSession}
                            isRecording={isRecording}
                            isProcessing={isProcessing}
                            liveTranscript={liveTranscript}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="active-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col min-h-0 bg-slate-50/50"
                    >
                        <div className="relative flex-1 flex flex-col min-h-0">
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                                <MirsLogo className="w-96 h-96 opacity-5 text-gray-500" />
                            </div>
                            <MessageStream
                                messages={messages}
                                playingId={audioPlayer.currentId}
                                progress={audioPlayer.progress}
                                onPlay={audioPlayer.play}
                                onStop={audioPlayer.stop}
                                isThinking={isThinking}
                            />
                            {isProcessing && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-blue-100 animate-pulse">
                                    Procesando triaje...
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <FixedInputBar
                onSendMessage={handleSendMessage}
                isRecording={isRecording}
                onToggleRecording={isRecording ? stopRecording : handleStartRecording}
                isMuted={isMuted}
                onToggleMute={toggleMute}
                liveTranscript={liveTranscript}
                onImageSelect={handleImageSelect}
                selectedImagePreview={selectedImagePreview}
                isAnalyzingImage={isAnalyzingImage}
                onClearImage={handleClearImage}
            />
        </div>
    );
}
