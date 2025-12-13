"use client";

import React from 'react';
import { useChatStore } from '@/core/store/chatStore';
import { useUserStore } from '@/core/store/userStore';
import { UserCheck, Users } from 'lucide-react';

export default function PatientSwitcher() {
    const { currentPatientId, setPatientId } = useChatStore();
    const { setPersona } = useUserStore();

    const handleSwitch = (id: string) => {
        setPersona(id);
        setPatientId(id);
    };

    return (
        <div className="flex items-center gap-2 bg-slate-700/30 p-1 rounded-lg border border-slate-700/50">
            <button
                onClick={() => handleSwitch('1')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${currentPatientId === '1'
                    ? 'bg-slate-600/80 text-emerald-400 shadow-sm border border-slate-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }`}
            >
                <UserCheck size={14} />
                <span>Juan (P1)</span>
            </button>
            <button
                onClick={() => handleSwitch('20')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${currentPatientId === '20'
                    ? 'bg-slate-600/80 text-blue-400 shadow-sm border border-slate-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }`}
            >
                <Users size={14} />
                <span>María (P20)</span>
            </button>
        </div>
    );
}
