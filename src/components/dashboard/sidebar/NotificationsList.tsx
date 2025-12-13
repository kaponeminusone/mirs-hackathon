"use client";

import React from 'react';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNotificationStore } from '@/core/store/notificationStore';

export default function NotificationsList() {
    const { notifications, markAsRead } = useNotificationStore();

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recientes</h3>
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`p-3 rounded-xl border border-slate-100 ${notif.read ? 'bg-white' : 'bg-blue-50/30'} flex gap-3 transition-all duration-200 cursor-pointer active:scale-[0.98] hover:shadow-sm`}
                        onClick={() => !notif.read && markAsRead(notif.id)}
                    >
                        {/* Icon based on notification type */}
                        <div className="self-center">
                            {notif.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                            {notif.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                            {notif.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>

                        {/* Notification content */}
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800">{notif.title}</p>
                            <p className="text-xs text-slate-600 leading-snug">{notif.message}</p>
                        </div>

                        {/* Unread indicator */}
                        {!notif.read && (
                            <div className="self-center">
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
