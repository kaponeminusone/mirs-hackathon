import React, { useState } from 'react';
import { User, Bell, PlusCircle } from 'lucide-react';
import { useChatStore } from '@/core/store/chatStore';
import { useUserStore } from '@/core/store/userStore';
import UserProfileModal from '@/components/dashboard/profile/UserProfileModal';

export default function SidebarHeader() {
    const setActiveSession = useChatStore(state => state.setActiveSession);
    const { name, role } = useUserStore();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col gap-4 p-4 border-b border-slate-200 bg-white">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="flex items-center gap-3 hover:bg-slate-50 p-1.5 -ml-1.5 rounded-xl transition-colors text-left group"
                    >
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 group-hover:border-blue-300 transition-colors">
                            <User size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{name}</h2>
                            <p className="text-xs text-slate-500">{role}</p>
                        </div>
                    </button>
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

            <UserProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </>
    );
}
