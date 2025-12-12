"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BigMicHero from './BigMicHero';
import MessageStream, { Message } from './MessageStream';
import FixedInputBar from './FixedInputBar';
import { useVoiceInteraction } from '@/core/hooks/useVoiceInteraction';

export default function ChatCanvasContainer() {
    const [isActiveSession, setIsActiveSession] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const {
        isRecording,
        isProcessing,
        transcript,
        triageResult,
        startRecording,
        stopRecording
    } = useVoiceInteraction();

    useEffect(() => {
        if (triageResult) {
            if (!isActiveSession) setIsActiveSession(true);

            const newMessages: Message[] = [];

            if (transcript) {
                newMessages.push({
                    id: Date.now().toString(),
                    role: 'user',
                    content: transcript,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            }

            if (triageResult.aiResponse) {
                newMessages.push({
                    id: (Date.now() + 1).toString(),
                    role: 'ai',
                    content: triageResult.aiResponse,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            }

            setMessages(prev => [...prev, ...newMessages]);
        }
    }, [triageResult, transcript, isActiveSession]);

    const handleStartSession = () => {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    };

    const handleSendMessage = (text: string) => {
        if (!isActiveSession) {
            setIsActiveSession(true);
        }

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newUserMsg]);

        setTimeout(() => {
            const newAiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: "I've received your text input. (Text analysis pipeline pending implementation)",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, newAiMsg]);
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
                            <MessageStream messages={messages} />
                            {isProcessing && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-blue-100 animate-pulse">
                                    Processing triage...
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <FixedInputBar
                onSendMessage={handleSendMessage}
                isRecording={isRecording}
                onToggleRecording={isRecording ? stopRecording : startRecording}
            />
        </div>
    );
}
