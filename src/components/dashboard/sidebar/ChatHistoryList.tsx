import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/core/store/chatStore';
import HistoryItem from './HistoryItem';

export default function ChatHistoryList() {
    // Determine which store alias to use (using chatStore logic as requested via aliases)
    const { sessions, deleteSession, setActiveSession, activeSessionId } = useChatStore();

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de eliminar este historial de triaje?')) {
            deleteSession(id);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-3">
                <AnimatePresence mode="popLayout">
                    {sessions.length === 0 ? (
                        <div className="text-center text-slate-400 text-sm py-8">
                            No hay historiales de triaje
                        </div>
                    ) : (
                        sessions.map((session) => (
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
