import React from 'react';
import DoctorSidebarHeader from './DoctorSidebarHeader';
import { LayoutGrid, Calendar, MessageSquare, Settings } from 'lucide-react';

export default function DoctorSidebar() {
    return (
        <aside className="w-[320px] flex flex-col border-r border-slate-200 bg-white h-full">
            <DoctorSidebarHeader />

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-2 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-700">
                        <Calendar size={18} />
                        Agenda
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <MessageSquare size={18} />
                        Pacientes
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <LayoutGrid size={18} />
                        Reportes
                    </button>
                </nav>
            </div>

            <div className="p-4 border-t border-slate-200">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <Settings size={18} />
                    Configuración
                </button>
            </div>
        </aside>
    );
}
