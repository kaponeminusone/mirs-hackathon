"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Trash2 } from 'lucide-react';
import { ChatSession, TriageLevel } from '@/core/mocks/mockHistory';

interface HistoryItemProps {
    session: ChatSession;
    isActive: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string, e: React.MouseEvent) => void;
}

const levelConfigs: Record<TriageLevel, { bg: string; text: string; label: string }> = {
    RED: { bg: 'bg-red-100 border-red-200', text: 'text-red-700', label: 'Crítico' },
    ORANGE: { bg: 'bg-orange-100 border-orange-200', text: 'text-orange-700', label: 'Urgente' },
    YELLOW: { bg: 'bg-yellow-100 border-yellow-200', text: 'text-yellow-700', label: 'Moderado' },
    GREEN: { bg: 'bg-green-100 border-green-200', text: 'text-green-700', label: 'Leve' },
    BLUE: { bg: 'bg-blue-100 border-blue-200', text: 'text-blue-700', label: 'Estándar' },
};

export default function HistoryItem({ session, isActive, onSelect, onDelete }: HistoryItemProps) {
    const config = levelConfigs[session.triageLevel];

    return (
        <motion.div
            layout // Enable layout animation for smooth reordering
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => onSelect(session.id)}
            className={`group relative p-3 rounded-lg cursor-pointer transition-all border-l-4 border-b border-slate-100 ${isActive
                    ? 'bg-slate-50 border-l-slate-800' // Active: Light bg, Dark side accent
                    : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-200'
                }`}
        >
            <div className="flex flex-col gap-1.5 pl-1">
                <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                        {session.patientName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                        {session.date.split(',')[0]} {/* Just show date/time loosely */}
                    </span>
                </div>

                <p className={`text-xs line-clamp-2 ${isActive ? 'text-slate-600' : 'text-slate-500'}`}>
                    {session.summary}
                </p>

                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${config.bg.replace('bg-', 'bg-').replace('border-', '')} ${config.text.replace('text-', 'bg-')}`}></div>
                        <span className={`text-[10px] font-medium ${config.text}`}>
                            {config.label}
                        </span>
                    </div>

                    {/* Delete Button - Visible on Group Hover */}
                    <button
                        onClick={(e) => onDelete(session.id, e)}
                        className="p-1 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Eliminar"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
