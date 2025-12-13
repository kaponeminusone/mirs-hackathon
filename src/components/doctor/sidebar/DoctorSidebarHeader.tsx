"use client";

import React, { useState } from 'react';
import { User, Bell, PlusCircle } from 'lucide-react';
import { useDoctorStore } from '@/core/store/doctorStore';
import DoctorProfileModal from '../profile/DoctorProfileModal';

export default function DoctorSidebarHeader() {
    const { name, specialty } = useDoctorStore();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col gap-4 p-4 border-b border-slate-100 bg-white">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="flex items-center gap-3 hover:bg-slate-50 p-1.5 -ml-1.5 rounded-xl transition-colors text-left group"
                    >
                        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:border-indigo-200 transition-colors">
                            <User size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{name}</h2>
                            <p className="text-xs text-slate-500">{specialty}</p>
                        </div>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
                    </button>
                </div>

                {/* New Appointment Button - Prominent CTA */}
                <button
                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm border border-indigo-600"
                >
                    <PlusCircle size={18} />
                    <span>Nueva Cita</span>
                </button>
            </div>

            <DoctorProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </>
    );
}
