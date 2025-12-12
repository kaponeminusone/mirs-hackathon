"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BigMicHero from './BigMicHero';
import MessageStream, { Message } from './MessageStream';
import FixedInputBar from './FixedInputBar';
import { useVoiceInteraction } from '@/core/hooks/useVoiceInteraction';
import { useAudioPlayer } from '@/core/hooks/useAudioPlayer';

import { useChatStore } from '@/core/store/chatStore';

export default function ChatCanvasContainer() {
    const [isActiveSession, setIsActiveSession] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const { activeSessionId, isLoading, isMuted, toggleMute, addSession, updateSession, sessions } = useChatStore();

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

    // Removed local isMuted state

    const audioPlayer = useAudioPlayer();

    // Stop audio immediately if muted
    useEffect(() => {
        if (isMuted) {
            audioPlayer.stop();
        }
    }, [isMuted]);

    // Tie Voice Hook to Audio Player: Stop audio when recording starts
    const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceInteraction({
        onTriageComplete: (result) => {
            if (!isActiveSession) setIsActiveSession(true);

            // 1. Construct new messages first
            const newMessages: Message[] = [];

            if (result.transcript) {
                newMessages.push({
                    id: Date.now().toString(),
                    role: 'user',
                    content: result.transcript,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            }

            if (result.aiResponse) {
                const aiMsgId = (Date.now() + 1).toString();
                newMessages.push({
                    id: aiMsgId,
                    role: 'ai',
                    content: result.aiResponse,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });

                // Auto-play the AI response ONLY if not muted
                if (!isMuted) {
                    setTimeout(() => {
                        audioPlayer.play(result.aiResponse, aiMsgId);
                    }, 100);
                }
            }

            // 2. Sync to Store (and Local State via Effect or Optimistic)
            if (!activeSessionId) {
                const newId = Date.now().toString();
                const summary = result.transcript
                    ? result.transcript.substring(0, 30) + (result.transcript.length > 30 ? '...' : '')
                    : 'Nueva consulta de voz';

                addSession({
                    id: newId,
                    date: 'Ahora',
                    summary: summary,
                    triageLevel: 'BLUE',
                    patientName: 'Paciente (Voz)',
                    messages: newMessages // Save immediately!
                });
            } else {
                // Update existing
                const currentSession = sessions.find(s => s.id === activeSessionId);
                const prevMsgs = currentSession ? currentSession.messages : [];
                updateSession(activeSessionId, {
                    messages: [...prevMsgs, ...newMessages]
                });
            }
        },
        onError: (err) => {
            // ... existing error logic
            console.error(err);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'ai',
                content: `Error: ${err}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }
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

    const handleSendMessage = (text: string) => {
        audioPlayer.stop();
        if (!isActiveSession) {
            setIsActiveSession(true);
        }

        // 1. Construct User Message
        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        let updatedMessages: Message[] = [];
        let currentSessionId = activeSessionId; // Use a mutable variable for the ID

        if (!activeSessionId) {
            // New Session
            updatedMessages = [newUserMsg];
            const newId = Date.now().toString();
            const summary = text.substring(0, 30) + (text.length > 30 ? '...' : '');

            addSession({
                id: newId,
                date: 'Ahora',
                summary: summary,
                triageLevel: 'BLUE',
                patientName: 'Paciente',
                messages: updatedMessages
            });
            currentSessionId = newId; // Update the ID for subsequent use
        } else {
            // Existing
            const currentSession = sessions.find(s => s.id === activeSessionId);
            updatedMessages = currentSession ? [...currentSession.messages, newUserMsg] : [newUserMsg];
            updateSession(activeSessionId, { messages: updatedMessages });
        }

        // Update local state immediately for optimistic display
        setMessages(updatedMessages);

        // 3. Simulate AI Response (Async)
        setTimeout(() => {
            const aiMsgId = (Date.now() + 1).toString();
            const aiText = "He recibido tu mensaje de texto. (El análisis de texto está pendiente de implementación)";
            const newAiMsg: Message = {
                id: aiMsgId,
                role: 'ai',
                content: aiText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            // Append AI message to the messages array
            const finalMessages = [...updatedMessages, newAiMsg];

            // Update the session in the store with the AI message
            if (currentSessionId) {
                updateSession(currentSessionId, { messages: finalMessages });
            }

            // Update local state
            setMessages(finalMessages);

            // Auto play text response too if not muted
            if (!isMuted) {
                setTimeout(() => {
                    audioPlayer.play(aiText, aiMsgId);
                }, 100);
            }
        }, 1000);
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
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="active-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 flex flex-col min-h-0"
                    >
                        <div className="relative flex-1 flex flex-col min-h-0">
                            <MessageStream
                                messages={messages}
                                playingId={audioPlayer.currentId}
                                progress={audioPlayer.progress}
                                onPlay={audioPlayer.play}
                                onStop={audioPlayer.stop}
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
            />
        </div>
    );
}
