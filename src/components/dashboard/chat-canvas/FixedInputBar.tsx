"use client";

import React, { useState } from 'react';
import { Send, Mic, Paperclip, Volume2, VolumeX } from 'lucide-react';

interface FixedInputBarProps {
    onSendMessage: (message: string) => void;
    isRecording?: boolean;
    onToggleRecording?: () => void;
    isMuted?: boolean;
    onToggleMute?: () => void;
    liveTranscript?: string;
    onImageSelect?: (file: File) => void;
    selectedImagePreview?: string | null;
    isAnalyzingImage?: boolean;
    onClearImage?: () => void;
}

export default function FixedInputBar({
    onSendMessage,
    isRecording,
    onToggleRecording,
    isMuted = false,
    onToggleMute,
    liveTranscript = '',
    onImageSelect,
    selectedImagePreview,
    isAnalyzingImage = false,
    onClearImage
}: FixedInputBarProps) {
    const [input, setInput] = useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() || selectedImagePreview) {
            onSendMessage(input);
            setInput('');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onImageSelect) {
            onImageSelect(file);
        }
        // Reset so same file can be selected again
        if (e.target) e.target.value = '';
    };


    return (
        <div className="p-4 bg-white border-t border-slate-200">
            {/* Image Preview Area */}
            {selectedImagePreview && (
                <div className="max-w-4xl mx-auto mb-2 px-2">
                    <div className="relative inline-block">
                        <img
                            src={selectedImagePreview}
                            alt="Preview"
                            className={`h-20 w-auto rounded-lg border border-slate-200 shadow-sm ${isAnalyzingImage ? 'opacity-50' : ''}`}
                        />
                        {isAnalyzingImage ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <button
                                onClick={onClearImage}
                                className="absolute -top-2 -right-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-red-500 rounded-full p-1 border border-slate-200 shadow-sm transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        )}
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto grid grid-cols-[auto_1fr] md:flex md:items-end gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all shadow-sm"
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors row-start-2 col-start-1 md:row-auto md:col-auto"
                >
                    <Paperclip size={20} />
                </button>

                {isRecording ? (
                    <div className="flex-1 flex items-center px-2 py-3 row-start-1 col-span-2 md:row-auto md:col-auto w-full md:w-auto min-h-[48px] overflow-hidden">
                        <div className="flex items-center gap-3 w-full">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bubblegum-pink opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-bubblegum-pink"></span>
                            </span>
                            <p className="text-slate-700 truncate font-medium">
                                {liveTranscript || "Escuchando..."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Describa los síntomas o la condición actual..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 resize-none py-3 max-h-32 min-h-[48px] row-start-1 col-span-2 md:row-auto md:col-auto w-full md:w-auto outline-none"
                        rows={1}
                    />
                )}

                <div className="flex items-center gap-1 row-start-2 col-start-2 justify-self-end md:row-auto md:col-auto md:justify-self-auto">
                    {/* Global Mute Toggle */}
                    <button
                        type="button"
                        onClick={onToggleMute}
                        className={`p-3 rounded-xl transition-colors ${isMuted
                            ? 'text-slate-400 hover:text-slate-600 bg-slate-100'
                            : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                            }`}
                        title={isMuted ? "Activar lectura automática" : "Silenciar lectura automática"}
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>

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
                        disabled={!input.trim() && !selectedImagePreview}
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-200"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}
