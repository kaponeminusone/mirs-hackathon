"use client";

import React, { useState } from 'react';
import { User, Activity, Volume2, PauseCircle, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ChatMessageBubbleProps {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
    isAudioPlaying?: boolean;
    audioProgress?: number;
    onPlayAudio?: () => void;
    onStopAudio?: () => void;
}

export default function ChatMessageBubble({
    id,
    role,
    content,
    timestamp,
    isAudioPlaying = false,
    audioProgress = 0,
    onPlayAudio,
    onStopAudio
}: ChatMessageBubbleProps) {
    const isUser = role === 'user';
    const [isHovered, setIsHovered] = useState(false);

    const handleAudioClick = () => {
        if (isAudioPlaying) {
            onStopAudio?.();
        } else {
            onPlayAudio?.();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* AI Avatar */}
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-blue-200">
                    <Activity size={16} />
                </div>
            )}

            <div className={`flex max-w-[80%] rounded-2xl shadow-sm border relative overflow-hidden ${isUser
                ? 'bg-white border-blue-100 text-slate-700 rounded-tr-none p-4'
                : 'bg-white border-slate-100 text-slate-700 rounded-tl-none'
                }`}>

                {/* AI Control Column (Left Side) */}
                {!isUser && (
                    <div className="w-12 bg-slate-50 border-r border-slate-100 flex flex-col items-center py-3 gap-2 shrink-0">
                        {/* Play/Pause Control */}
                        <button
                            onClick={handleAudioClick}
                            className={`p-1 rounded-full transition-colors ${isAudioPlaying
                                    ? 'text-emerald-600 bg-emerald-100'
                                    : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100'
                                }`}
                        >
                            {isAudioPlaying ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
                        </button>

                        {/* Vertical Progress Bar */}
                        <div className="flex-1 w-1 bg-slate-200 rounded-full overflow-hidden flex flex-col justify-end">
                            <motion.div
                                className="w-full bg-emerald-500"
                                style={{ height: `${isAudioPlaying ? audioProgress : 0}%` }}
                                transition={{ ease: "linear", duration: 0.1 }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex-1 p-4 min-w-0">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block text-right">
                        {timestamp}
                    </span>
                </div>
            </div>

            {/* User Avatar */}
            {isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-1">
                    <User size={16} />
                </div>
            )}
        </motion.div>
    );
}
