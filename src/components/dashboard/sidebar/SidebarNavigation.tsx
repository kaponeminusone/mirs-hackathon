import React from 'react';
import { MessageSquare, Calendar, Bell } from 'lucide-react';
import { useNotificationStore } from '@/core/store/notificationStore';

interface SidebarNavigationProps {
    activeTab: 'chats' | 'calendar' | 'notifications';
    onTabChange: (tab: 'chats' | 'calendar' | 'notifications') => void;
}

export default function SidebarNavigation({ activeTab, onTabChange }: SidebarNavigationProps) {
    const hasUnread = useNotificationStore(state => state.hasUnread);

    return (
        <div className="px-4 pb-2 bg-white mt-2">
            <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                    onClick={() => onTabChange('chats')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'chats'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <MessageSquare size={16} />
                    <span className="hidden sm:inline">Chats</span>
                </button>
                <button
                    onClick={() => onTabChange('calendar')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'calendar'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Calendar size={16} />
                    <span className="hidden sm:inline">Calendario</span>
                </button>
                <button
                    onClick={() => onTabChange('notifications')}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'notifications'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <div className="relative">
                        <Bell size={16} />
                        {hasUnread() && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        )}
                    </div>
                    <span className="hidden sm:inline">Avisos</span>
                </button>
            </div>
        </div>
    );
}
