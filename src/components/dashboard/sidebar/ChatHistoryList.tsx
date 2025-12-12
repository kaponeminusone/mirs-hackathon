import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';

interface ChatSession {
    id: string;
    patientName: string;
    triageLevel: 'Urgent' | 'Standard' | 'Critical';
    time: string;
    preview: string;
}

const MOCK_SESSIONS: ChatSession[] = [
    {
        id: '1',
        patientName: 'Sarah Connor',
        triageLevel: 'Urgent',
        time: '10:42 AM',
        preview: 'reporting severe abdominal pain...',
    },
    {
        id: '2',
        patientName: 'John Smith',
        triageLevel: 'Standard',
        time: '09:15 AM',
        preview: 'follow-up on previous concussion...',
    },
    {
        id: '3',
        patientName: 'Kyle Reese',
        triageLevel: 'Critical',
        time: 'Yesterday',
        preview: 'multiple trauma indications...',
    },
    {
        id: '4',
        patientName: 'Ellen Ripley',
        triageLevel: 'Standard',
        time: 'Yesterday',
        preview: 'routine checkup request...',
    },
];

const levelColors = {
    Urgent: 'bg-orange-100 text-orange-700 border-orange-200',
    Standard: 'bg-green-100 text-green-700 border-green-200',
    Critical: 'bg-red-100 text-red-700 border-red-200',
};

export default function ChatHistoryList() {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-3">
                {MOCK_SESSIONS.map((session) => (
                    <div
                        key={session.id}
                        className="group flex flex-col gap-2 p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <span className="font-semibold text-slate-700 text-sm">{session.patientName}</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock size={12} /> {session.time}
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-1">{session.preview}</p>

                        <div className="flex items-center justify-between mt-1">
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${levelColors[session.triageLevel]}`}>
                                {session.triageLevel}
                            </span>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
