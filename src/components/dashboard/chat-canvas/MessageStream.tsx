import React, { useEffect, useRef } from 'react';
import { User, Volume2, PauseCircle, PlayCircle, Activity, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/core/store/userStore';

export interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
    imageUrl?: string;
    // New fields for UI Richness
    triageLevel?: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'BLUE';
    type?: 'text' | 'recommendation' | 'default';
    options?: { label: string; action: string }[];
}

import ChatMessageBubble from './ChatMessageBubble';

interface MessageStreamProps {
    messages: Message[];
    playingId?: string | null;
    progress?: number;
    onPlay?: (text: string, id: string) => void;
    onStop?: () => void;
    isThinking?: boolean;
}

export default function MessageStream({
    messages,
    playingId,
    progress,
    onPlay,
    onStop,
    isThinking = false
}: MessageStreamProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const { avatarUrl } = useUserStore(); // Get current avatar

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            {messages.map((msg) => (
                <ChatMessageBubble
                    key={msg.id}
                    {...msg}
                    userAvatarUrl={msg.role === 'user' ? avatarUrl : undefined}
                    isAudioPlaying={playingId === msg.id}
                    audioProgress={playingId === msg.id ? progress : 0}
                    onPlayAudio={() => onPlay?.(msg.content, msg.id)}
                    onStopAudio={onStop}
                />
            ))}

            {/* Thinking Indicator */}
            {isThinking && (
                <div className="flex gap-4 justify-start">
                    <div className="w-8 h-8 rounded-full bg-pearl-aqua flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-pearl-aqua/50">
                        <Activity size={16} />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-bubblegum-pink/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-bubblegum-pink/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-bubblegum-pink/60 rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-sm text-slate-400 font-medium">Analizando...</span>
                    </div>
                </div>
            )}

            <div ref={bottomRef} className="h-4" />
        </div>
    );
}
