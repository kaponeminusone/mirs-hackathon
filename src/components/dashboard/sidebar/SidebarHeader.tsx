import React from 'react';
import { User, Bell } from 'lucide-react';

export default function SidebarHeader() {
    return (
        <div className="flex flex-col gap-4 p-4 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                        <User size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-slate-800">Dr. Alex Mercer</h2>
                        <p className="text-xs text-slate-500">Emergency Medicine</p>
                    </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Bell size={20} />
                </button>
            </div>

            <div className="flex gap-2">
                <button className="flex-1 py-1.5 px-3 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 text-center">
                    Pending (4)
                </button>
                <button className="flex-1 py-1.5 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-center">
                    Completed
                </button>
            </div>
        </div>
    );
}
