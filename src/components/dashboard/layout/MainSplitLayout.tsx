"use client";

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Import icons
import SidebarHeader from '../sidebar/SidebarHeader';
import SidebarNavigation from '../sidebar/SidebarNavigation';
import ChatHistoryList from '../sidebar/ChatHistoryList';
import AppointmentsCalendar from '../sidebar/AppointmentsCalendar';
import ChatCanvasContainer from '../chat-canvas/ChatCanvasContainer';

import NotificationsList from '../sidebar/NotificationsList';

export default function MainSplitLayout() {
    const [activeTab, setActiveTab] = useState<'chats' | 'calendar' | 'notifications'>('chats');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans relative">

            {/* Mobile Menu Button - Visible only on mobile */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden absolute top-4 left-4 z-40 p-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm text-slate-600 hover:text-blue-600 active:scale-95 transition-all"
            >
                <Menu size={24} />
            </button>

            {/* Sidebar Overlay (Backdrop) for Mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                flex flex-col border-r border-slate-700 bg-slate-800 shadow-xl shadow-slate-900/20
                transition-transform duration-300 ease-in-out
                
                /* Desktop Styles */
                md:translate-x-0 md:relative md:w-[35%] md:min-w-[320px] md:max-w-[480px] md:z-10 md:flex
                
                /* Mobile Styles */
                fixed inset-y-0 left-0 w-[85%] max-w-[320px] z-50
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full relative">
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>

                    <SidebarHeader />
                    <SidebarNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                    {/* Content Area */}
                    {activeTab === 'chats' && <ChatHistoryList />}
                    {activeTab === 'calendar' && <AppointmentsCalendar />}
                    {activeTab === 'notifications' && <NotificationsList />}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative flex flex-col min-w-0 bg-slate-50">
                {/* Dot Pattern Background */}
                <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}>
                </div>

                <div className="flex-1 relative z-10 flex flex-col h-full overflow-hidden">
                    <ChatCanvasContainer />
                </div>
            </main>
        </div>
    );
}
