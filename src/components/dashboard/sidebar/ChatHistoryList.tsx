import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/core/store/chatStore';
import HistoryItem from './HistoryItem';
import { Plus } from 'lucide-react';

export default function ChatHistoryList() {
    // Determine which store alias to use (using chatStore logic as requested via aliases)
    const { sessions, deleteSession, setActiveSession, activeSessionId, currentPatientId } = useChatStore();

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de eliminar este historial de triaje?')) {
            deleteSession(id);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-3 space-y-1"> {/* Reduced padding and gap for list feel */}
                {/* New Chat Placeholder / Action */}
                {/* New Chat Placeholder / Action */}
                <button
                    onClick={() => setActiveSession(null)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 mb-2 group border border-transparent ${activeSessionId === null
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 hover:border-slate-700/50'
                        }`}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${activeSessionId === null ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800/50 text-slate-500 group-hover:bg-slate-700/50 group-hover:text-slate-300'
                        }`}>
                        <Plus size={18} />
                    </div>
                    <div>
                        <span className="text-sm font-semibold block">Nueva Consulta</span>
                        <span className="text-xs opacity-70">Iniciar nuevo triaje</span>
                    </div>
                </button>

                <AnimatePresence mode="popLayout">
                    {sessions
                        .filter(s => !s.patientId || s.patientId === currentPatientId)
                        .length === 0 ? (
                        <div className="text-center text-slate-600 text-sm py-8 italic">
                            No hay historiales de triaje recientes
                        </div>
                    ) : (
                        sessions
                            .filter(s => !s.patientId || s.patientId === currentPatientId)
                            .map((session) => (
                                <HistoryItem
                                    key={session.id}
                                    session={session}
                                    isActive={activeSessionId === session.id}
                                    onSelect={(id) => setActiveSession(id)}
                                    onDelete={handleDelete}
                                />
                            ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
