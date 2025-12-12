"use client";

import React, { useState } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';

interface FixedInputBarProps {
    onSendMessage: (message: string) => void;
    isRecording?: boolean;
    onToggleRecording?: () => void;
}

export default function FixedInputBar({ onSendMessage, isRecording, onToggleRecording }: FixedInputBarProps) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="p-4 bg-white border-t border-slate-200">
            <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto flex items-end gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all shadow-sm"
            >
                <button
                    type="button"
                    className="p-3 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                >
                    <Paperclip size={20} />
                </button>

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder="Describe symptoms or ongoing condition..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 resize-none py-3 max-h-32 min-h-[48px]"
                    rows={1}
                />

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={onToggleRecording}
                        className={`p-3 rounded-xl transition-colors ${isRecording
                                ? 'bg-red-100 text-red-600 animate-pulse'
                                : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'
                            }`}
                    >
                        <Mic size={20} />
                    </button>
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-200"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}
