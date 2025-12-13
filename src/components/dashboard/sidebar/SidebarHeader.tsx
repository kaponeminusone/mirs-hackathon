import React, { useState } from 'react';
import { User, Bell, PlusCircle } from 'lucide-react';
import { useChatStore } from '@/core/store/chatStore';
import { useUserStore } from '@/core/store/userStore';
import UserProfileModal from '@/components/dashboard/profile/UserProfileModal';
import PatientSwitcher from '../layout/PatientSwitcher';

export default function SidebarHeader() {
    const setActiveSession = useChatStore(state => state.setActiveSession);
    const { name, role, avatarUrl } = useUserStore();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>

            <div className="flex flex-col gap-4 p-4 border-b border-slate-700 bg-slate-800">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="flex items-center gap-3 hover:bg-slate-800 p-1.5 -ml-1.5 rounded-xl transition-colors text-left group w-full"
                    >
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={name}
                                className="h-10 w-10 rounded-full border-2 border-slate-700 group-hover:border-blue-500 transition-colors object-cover bg-slate-800"
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700 group-hover:border-blue-500 group-hover:text-blue-400 transition-colors">
                                <User size={20} />
                            </div>
                        )}
                        <div>
                            <h2 className="text-sm font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">{name}</h2>
                            <p className="text-xs text-slate-400">{role}</p>
                        </div>
                    </button>

                </div>

                <div className="mx-auto w-full">
                    <PatientSwitcher />
                </div>
            </div>

            <UserProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </>
    );
}
