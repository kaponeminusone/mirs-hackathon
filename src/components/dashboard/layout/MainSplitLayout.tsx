"use client";

import React, { useState } from 'react';
import SidebarHeader from '../sidebar/SidebarHeader';
import SidebarNavigation from '../sidebar/SidebarNavigation';
import ChatHistoryList from '../sidebar/ChatHistoryList';
import AppointmentsCalendar from '../sidebar/AppointmentsCalendar';
import ChatCanvasContainer from '../chat-canvas/ChatCanvasContainer';

export default function MainSplitLayout() {
    const [activeTab, setActiveTab] = useState<'chats' | 'calendar'>('chats');

    return (
        <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans">
            {/* Sidebar - 35% width */}
            <aside className="w-[35%] min-w-[320px] max-w-[480px] flex flex-col border-r border-slate-200 bg-white z-10 shadow-xl shadow-slate-200/50">
                <SidebarHeader />
                <SidebarNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Content Area */}
                {activeTab === 'chats' ? (
                    <ChatHistoryList />
                ) : (
                    <AppointmentsCalendar />
                )}
            </aside>

            {/* Main Canvas - 65% width */}
            <main className="flex-1 flex flex-col min-w-0 bg-white relative">
                <ChatCanvasContainer />
            </main>
        </div>
    );
}
