"use client";

import React from 'react';
import DoctorSidebar from '../sidebar/DoctorSidebar';
import DoctorCalendar from '../calendar/DoctorCalendar';
import { useDoctorViewStore } from '@/core/store/doctorViewStore';
import PatientHistory from '../patient/PatientHistory';

export default function DoctorLayout() {
    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-800 selection:bg-indigo-500/30">
            <DoctorSidebar />

            <main className="flex-1 p-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-white/50 pointer-events-none" />
                <ContentSwitcher />
            </main>
        </div>
    );
}

function ContentSwitcher() {
    const { activeView } = useDoctorViewStore();
    return activeView === 'patient_history' ? <PatientHistory /> : <DoctorCalendar />;
}
