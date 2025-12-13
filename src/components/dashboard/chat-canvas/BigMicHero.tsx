"use client";

import React from 'react';
import { Mic } from 'lucide-react';
import { motion } from 'framer-motion';

interface BigMicHeroProps {
    onActivate: () => void;
    isRecording?: boolean;
    isProcessing?: boolean;
    liveTranscript?: string;
}

export default function BigMicHero({ onActivate, isRecording = false, isProcessing = false, liveTranscript = '' }: BigMicHeroProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 bg-slate-50 relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-[500px] h-[500px] rounded-full blur-3xl opacity-50 transition-colors duration-500 ${isRecording ? 'bg-bubblegum-pink/30' : 'bg-pearl-aqua/30'}`} />
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
                        className={`absolute inset-0 rounded-full opacity-20 ${isRecording ? 'bg-bubblegum-pink' : 'bg-pearl-aqua'}`}
                        animate={{
                            scale: isRecording ? [1, 1.3, 1] : [1, 1.6, 1],
                            opacity: [0.3, 0, 0.3]
                        }}
                        transition={{
                            duration: isRecording ? 1 : 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className={`absolute inset-4 rounded-full opacity-20 ${isRecording ? 'bg-bubblegum-pink' : 'bg-pearl-aqua'}`}
                        animate={{
                            scale: isRecording ? [1, 1.15, 1] : [1, 1.3, 1],
                            opacity: [0.3, 0.1, 0.3]
                        }}
                        transition={{
                            duration: isRecording ? 1 : 2.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                        }}
                    />

                    {/* Main button */}
                    <div className={`relative w-40 h-40 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isRecording
                        ? 'bg-gradient-to-br from-bubblegum-pink to-red-400 shadow-bubblegum-pink/50'
                        : 'bg-gradient-to-br from-pearl-aqua to-teal-400 shadow-pearl-aqua/50 group-hover:shadow-2xl group-hover:shadow-pearl-aqua/60'
                        }`}>
                        <Mic size={64} className="text-white drop-shadow-md" />
                    </div>
                </motion.button>

                <div className="text-center space-y-2 max-w-md px-4">
                    <h1 className="text-2xl font-bold text-slate-800">
                        {isRecording ? 'Escuchando...' : isProcessing ? 'Pensando...' : 'Listo para Asistir'}
                    </h1>
                    <div className="min-h-[3rem] flex flex-col items-center justify-center">
                        {isRecording && liveTranscript ? (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xl font-medium text-bubblegum-pink"
                            >
                                "{liveTranscript}"
                            </motion.p>
                        ) : (
                            <p className="text-slate-500">
                                {isRecording
                                    ? 'Hable claramente al micrófono. Toque para detener.'
                                    : 'Toque el micrófono para iniciar una nueva sesión de triaje o escriba abajo.'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
