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

const levelConfigs: Record<TriageLevel, { style: string; dot: string; label: string }> = {
    RED: { style: 'bg-red-500/10 text-red-400 border-red-500/20', dot: 'bg-red-500', label: 'Crítico' },
    ORANGE: { style: 'bg-orange-500/10 text-orange-400 border-orange-500/20', dot: 'bg-orange-500', label: 'Urgente' },
    YELLOW: { style: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-500', label: 'Moderado' },
    GREEN: { style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500', label: 'Leve' },
    BLUE: { style: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-500', label: 'Estándar' },
};

export default function HistoryItem({ session, isActive, onSelect, onDelete }: HistoryItemProps) {
    const config = levelConfigs[session.triageLevel];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => onSelect(session.id)}
            className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border mb-2
                ${isActive
                    ? 'translate-x-2 bg-slate-700/60 border-slate-600 shadow-md ring-1 ring-slate-600/50'
                    : 'hover:translate-x-1 bg-slate-700/20 border-slate-700/50 hover:bg-slate-700/40 hover:border-slate-600'
                }`}
        >
            {/* Header: Title & Date */}
            <div className="flex justify-between items-start mb-1.5 gap-2">
                <h4 className={`text-sm font-medium pr-2 truncate w-full transition-colors ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                    {session.summary}
                </h4>
                <span className="text-[10px] text-slate-500 whitespace-nowrap pt-0.5">
                    {session.date.split(',')[0]}
                </span>
            </div>

            {/* Body: Snippet */}
            <p className="text-slate-400 text-xs line-clamp-2 mb-3 leading-relaxed font-normal">
                {session.messages?.[0]?.content || "Nueva conversación de triaje..."}
            </p>

            {/* Footer: Badge & Actions */}
            <div className="flex items-center justify-between h-5">
                {/* Triage Badge */}
                <span className={`border text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1.5 ${config.style}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${session.triageLevel === 'RED' ? 'animate-pulse' : ''}`}></span>
                    {config.label}
                </span>

                {/* Delete Action (Visible on Hover) */}
                <button
                    onClick={(e) => onDelete(session.id, e)}
                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-slate-700/50 rounded"
                    title="Eliminar historial"
                >
                    <Trash2 size={13} />
                </button>
            </div>
        </motion.div>
    );
}
