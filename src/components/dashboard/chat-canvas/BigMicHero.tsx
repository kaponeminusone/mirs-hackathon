"use client";

import React from 'react';
import { Mic } from 'lucide-react';
import { motion } from 'framer-motion';

interface BigMicHeroProps {
    onActivate: () => void;
    isRecording?: boolean;
    isProcessing?: boolean;
}

export default function BigMicHero({ onActivate, isRecording = false, isProcessing = false }: BigMicHeroProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 bg-slate-50 relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-[500px] h-[500px] rounded-full blur-3xl opacity-50 transition-colors duration-500 ${isRecording ? 'bg-red-100' : 'bg-blue-100/50'}`} />
            </div>

            <div className="z-10 flex flex-col items-center gap-8">
                <motion.button
                    onClick={onActivate}
                    className="relative group cursor-pointer outline-none"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Pulsing rings */}
                    <motion.div
                        className={`absolute inset-0 rounded-full opacity-20 ${isRecording ? 'bg-red-400' : 'bg-blue-400'}`}
                        animate={{
                            scale: isRecording ? [1, 1.2, 1] : [1, 1.5, 1],
                            opacity: [0.2, 0, 0.2]
                        }}
                        transition={{
                            duration: isRecording ? 1.5 : 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className={`absolute inset-4 rounded-full opacity-20 ${isRecording ? 'bg-red-500' : 'bg-blue-500'}`}
                        animate={{
                            scale: isRecording ? [1, 1.1, 1] : [1, 1.2, 1],
                            opacity: [0.2, 0.1, 0.2]
                        }}
                        transition={{
                            duration: isRecording ? 1.5 : 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                        }}
                    />

                    {/* Main button */}
                    <div className={`relative w-40 h-40 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isRecording
                            ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-200'
                            : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200 group-hover:shadow-2xl group-hover:shadow-blue-300'
                        }`}>
                        <Mic size={64} className="text-white drop-shadow-md" />
                    </div>
                </motion.button>

                <div className="text-center space-y-2 max-w-md px-4">
                    <h1 className="text-2xl font-bold text-slate-800">
                        {isRecording ? 'Listening...' : isProcessing ? 'Thinking...' : 'Ready to Assist'}
                    </h1>
                    <p className="text-slate-500">
                        {isRecording
                            ? 'Speak clearly into the microphone. Tap to stop.'
                            : 'Tap the microphone to start a new triage session or type your query below.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
