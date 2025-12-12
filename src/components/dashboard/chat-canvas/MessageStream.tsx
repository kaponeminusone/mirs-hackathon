"use client";

import React, { useEffect, useRef } from 'react';

export interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
}

import ChatMessageBubble from './ChatMessageBubble';

interface MessageStreamProps {
    messages: Message[];
    playingId?: string | null;
    progress?: number;
    onPlay?: (text: string, id: string) => void;
    onStop?: () => void;
}

export default function MessageStream({
    messages,
    playingId,
    progress,
    onPlay,
    onStop
}: MessageStreamProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50/50">
            {messages.map((msg) => (
                <ChatMessageBubble
                    key={msg.id}
                    {...msg}
                    isAudioPlaying={playingId === msg.id}
                    audioProgress={playingId === msg.id ? progress : 0}
                    onPlayAudio={() => onPlay?.(msg.content, msg.id)}
                    onStopAudio={onStop}
                />
            ))}
            <div ref={bottomRef} className="h-4" />
        </div>
    );
}
