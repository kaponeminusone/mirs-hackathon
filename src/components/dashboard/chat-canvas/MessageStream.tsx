"use client";

import React, { useEffect, useRef } from 'react';
import { User, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
}

interface MessageStreamProps {
    messages: Message[];
}

export default function MessageStream({ messages }: MessageStreamProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50/50">
            {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                return (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                        {/* AI Avatar */}
                        {!isUser && (
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-blue-200">
                                <Activity size={16} />
                            </div>
                        )}

                        <div
                            className={`max-w-[80%] rounded-2xl p-4 shadow-sm border ${isUser
                                ? 'bg-white border-blue-100 text-slate-700 rounded-tr-none'
                                : 'bg-white border-slate-100 text-slate-700 rounded-tl-none'
                                }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            <span className="text-[10px] text-slate-400 mt-2 block text-right">
                                {msg.timestamp}
                            </span>
                        </div>

                        {/* User Avatar */}
                        {isUser && (
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-1">
                                <User size={16} />
                            </div>
                        )}
                    </motion.div>
                );
            })}
            <div ref={bottomRef} className="h-4" />
        </div>
    );
}
