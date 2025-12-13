import React from 'react';
import DoctorSidebar from '../sidebar/DoctorSidebar';
import DoctorCalendar from '../calendar/DoctorCalendar';

export default function DoctorLayout() {
    return (
        <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans">
            <DoctorSidebar />

            <main className="flex-1 p-6 overflow-hidden">
                <DoctorCalendar />
            </main>
        </div>
    );
}
