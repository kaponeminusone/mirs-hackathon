import React from 'react';
import { User, Bell, PlusCircle } from 'lucide-react';
import { useChatStore } from '@/core/store/chatStore';

export default function SidebarHeader() {
    const setActiveSession = useChatStore(state => state.setActiveSession);

    return (
        <div className="flex flex-col gap-4 p-4 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                        <User size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-slate-800">Dr. Alex Mercer</h2>
                        <p className="text-xs text-slate-500">Medicina de Urgencias</p>
                    </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Bell size={20} />
                </button>
            </div>

            {/* New Request Button - Prominent CTA */}
            <button
                onClick={() => setActiveSession(null)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm shadow-slate-200"
            >
                <PlusCircle size={18} />
                <span>Nueva Petición</span>
            </button>
        </div>
    );
}
