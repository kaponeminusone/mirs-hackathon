import React from 'react';
import { MessageSquare, Calendar, Bell } from 'lucide-react';
import { useNotificationStore } from '@/core/store/notificationStore';
import { motion } from 'framer-motion';

interface SidebarNavigationProps {
    activeTab: 'chats' | 'calendar' | 'notifications';
    onTabChange: (tab: 'chats' | 'calendar' | 'notifications') => void;
}

export default function SidebarNavigation({ activeTab, onTabChange }: SidebarNavigationProps) {
    const hasUnread = useNotificationStore(state => state.hasUnread);

    return (
        <div className="px-4 pb-2 mt-2 border-b border-slate-700">
            <div className="flex gap-1">
                <button
                    onClick={() => onTabChange('chats')}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${activeTab === 'chats'
                        ? 'text-blue-400'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-t-lg'
                        }`}
                >
                    <MessageSquare size={18} />
                    <span className="hidden sm:inline">Chats</span>
                    {activeTab === 'chats' && (
                        <motion.div
                            layoutId="active-tab-indicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                        />
                    )}
                </button>
                <button
                    onClick={() => onTabChange('calendar')}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${activeTab === 'calendar'
                        ? 'text-blue-400' // Lighter blue for dark mode contrast
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-t-lg'
                        }`}
                >
                    <Calendar size={18} />
                    <span className="hidden sm:inline">Calendario</span>
                    {activeTab === 'calendar' && (
                        <motion.div
                            layoutId="active-tab-indicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                        />
                    )}
                </button>
                <button
                    onClick={() => onTabChange('notifications')}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${activeTab === 'notifications'
                        ? 'text-blue-400'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-t-lg'
                        }`}
                >
                    <div className="relative">
                        <Bell size={18} />
                        {hasUnread() && (
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-slate-900"></span>
                            </span>
                        )}
                    </div>
                    <span className="hidden sm:inline">Avisos</span>
                    {activeTab === 'notifications' && (
                        <motion.div
                            layoutId="active-tab-indicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                        />
                    )}
                </button>
            </div>
        </div>
    );
}
