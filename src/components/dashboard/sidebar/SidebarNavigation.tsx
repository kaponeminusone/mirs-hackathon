import React from 'react';
import { MessageSquare, Calendar } from 'lucide-react';

interface SidebarNavigationProps {
    activeTab: 'chats' | 'calendar';
    onTabChange: (tab: 'chats' | 'calendar') => void;
}

export default function SidebarNavigation({ activeTab, onTabChange }: SidebarNavigationProps) {
    return (
        <div className="px-4 pb-2 bg-white">
            <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                    onClick={() => onTabChange('chats')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'chats'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <MessageSquare size={16} />
                    <span>Chats</span>
                </button>
                <button
                    onClick={() => onTabChange('calendar')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'calendar'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Calendar size={16} />
                    <span>Calendar</span>
                </button>
            </div>
        </div>
    );
}
