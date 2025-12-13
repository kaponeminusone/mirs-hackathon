"use client";

import React, { useState } from 'react';
import { User, Activity, Volume2, PauseCircle, PlayCircle, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface ChatMessageBubbleProps {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
    imageUrl?: string;
    isAudioPlaying?: boolean;
    audioProgress?: number;
    onPlayAudio?: () => void;
    onStopAudio?: () => void;
    userAvatarUrl?: string; // Add optional avatar URL
    triageLevel?: 'RED' | 'ORANGE' | 'GREEN' | 'BLUE' | 'YELLOW';
    type?: 'default' | 'recommendation' | 'text';
    options?: Array<{ label: string; action: string; }>;
}

export default function ChatMessageBubble({
    id,
    role,
    content,
    timestamp,
    imageUrl,
    isAudioPlaying = false,
    audioProgress = 0,
    onPlayAudio,
    onStopAudio,
    triageLevel,
    type,
    options
}: ChatMessageBubbleProps) {
    const isUser = role === 'user';
    const [isHovered, setIsHovered] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const getTriageStyles = () => {
        if (isUser) return 'bg-white border-pearl-aqua text-taupe-grey rounded-tr-none shadow-pearl-aqua/10';

        switch (triageLevel) {
            case 'RED': return 'bg-white border-red-500 shadow-md shadow-red-500/10 text-taupe-grey rounded-tl-none';
            case 'ORANGE': return 'bg-white border-orange-400 shadow-md shadow-orange-400/10 text-taupe-grey rounded-tl-none';
            case 'GREEN': return 'bg-white border-green-500 shadow-md shadow-green-500/10 text-taupe-grey rounded-tl-none';
            case 'BLUE': return 'bg-white border-blue-400 shadow-md shadow-blue-400/10 text-taupe-grey rounded-tl-none';
            default: return 'bg-white border-slate-100 text-taupe-grey rounded-tl-none';
        }
    };

    const handleAudioClick = () => {
        if (isAudioPlaying) {
            onStopAudio?.();
        } else {
            onPlayAudio?.();
        }
    };

    return (
        <>
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 mt-1 shadow-md ${triageLevel === 'RED' ? 'bg-red-500 shadow-red-500/40' :
                        triageLevel === 'ORANGE' ? 'bg-orange-500 shadow-orange-500/40' :
                            triageLevel === 'GREEN' ? 'bg-green-500 shadow-green-500/40' :
                                'bg-pearl-aqua shadow-pearl-aqua/50'
                        }`}>
                        <Activity size={16} />
                    </div>
                )}

                <div className={`flex flex-col max-w-[80%] z-10`}>

                    {/* Integrated Bubble with Audio/Text */}
                    <div className={`flex rounded-2xl shadow-sm border relative overflow-hidden ${getTriageStyles()}`}>

                        {/* AI Control Column (Left Side) */}
                        {!isUser && (
                            <div className="w-12 bg-slate-50 border-r border-slate-100 flex flex-col items-center py-3 gap-2 shrink-0">
                                <button
                                    onClick={handleAudioClick}
                                    className={`p-1 rounded-full transition-colors ${isAudioPlaying
                                        ? 'text-bubblegum-pink bg-cornsilk'
                                        : 'text-taupe-grey/40 hover:text-bubblegum-pink hover:bg-cornsilk'
                                        }`}
                                >
                                    {isAudioPlaying ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
                                </button>
                                <div className="flex-1 w-1 bg-slate-200 rounded-full overflow-hidden flex flex-col justify-end">
                                    <motion.div
                                        className="w-full bg-bubblegum-pink"
                                        style={{ height: `${isAudioPlaying ? audioProgress : 0}%` }}
                                        transition={{ ease: "linear", duration: 0.1 }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex-1 min-w-0 flex flex-col">
                            {/* Image Header (Hero Animation Source) */}
                            {imageUrl && (
                                <div
                                    className="relative w-full h-48 sm:h-64 cursor-zoom-in bg-slate-100 border-b border-slate-100 group overflow-hidden"
                                    onClick={() => setIsZoomed(true)}
                                >
                                    <motion.img
                                        layoutId={`image-${id}`}
                                        src={imageUrl}
                                        alt="Context"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        whileHover={{ scale: 1.05 }}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                        <Maximize2 className="text-white drop-shadow-md" size={24} />
                                    </div>
                                </div>
                            )}

                            {/* Content Body */}
                            <div className="p-4">
                                <div className="text-sm leading-relaxed break-words text-slate-600">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-pearl-aqua mb-2 mt-1" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-base font-bold text-slate-700 mb-2 mt-3" {...props} />,
                                            h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-slate-700 mb-1 mt-2" {...props} />,
                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                            li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-semibold text-slate-800" {...props} />,
                                        }}
                                    >
                                        {content}
                                    </ReactMarkdown>
                                </div>

                                {options && options.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                className="px-4 py-2 bg-slate-100 hover:bg-pearl-aqua hover:text-white text-slate-600 text-xs rounded-lg transition-colors font-medium active:scale-95"
                                                onClick={() => console.log('Option clicked:', opt.action)}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <span className="text-[10px] text-slate-400 mt-2 block text-right">
                                    {timestamp}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Avatar */}
                {isUser && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-1">
                        <User size={16} />
                    </div>
                )}
            </motion.div>

            {/* Apple-style Hero Animation Lightbox */}
            <AnimatePresence>
                {isZoomed && imageUrl && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
                        onClick={() => setIsZoomed(false)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-white/10 rounded-full p-2 z-50 hover:bg-white/20"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsZoomed(false);
                            }}
                        >
                            <X size={24} />
                        </button>

                        <div className="relative w-full h-full max-w-5xl max-h-[90vh] flex items-center justify-center pointer-events-none">
                            <motion.img
                                layoutId={`image-${id}`}
                                src={imageUrl}
                                alt="Zoomed Context"
                                className="max-w-full max-h-full rounded-lg shadow-2xl object-contain pointer-events-auto cursor-zoom-out"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsZoomed(false);
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
