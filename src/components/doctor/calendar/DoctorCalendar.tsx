import React from 'react';
import { Clock, MapPin, User, MoreVertical } from 'lucide-react';

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7 AM to 7 PM

const APPOINTMENTS = [
    {
        id: 1,
        patient: 'Ana García',
        type: 'Consulta General',
        startTime: 9, // 9:00 AM
        duration: 1, // 1 hour
        color: 'bg-blue-100 border-blue-200 text-blue-700',
    },
    {
        id: 2,
        patient: 'Carlos López',
        type: 'Revisión Cardiología',
        startTime: 10.5, // 10:30 AM
        duration: 1.5, // 1.5 hours
        color: 'bg-emerald-100 border-emerald-200 text-emerald-700',
    },
    {
        id: 3,
        patient: 'María Rodriguez',
        type: 'Entrega de Resultados',
        startTime: 14, // 2:00 PM
        duration: 0.5, // 30 mins
        color: 'bg-amber-100 border-amber-200 text-amber-700',
    }
];

export default function DoctorCalendar() {
    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Agenda del Día</h2>
                    <p className="text-sm text-slate-500">Jueves, 12 de Diciembre 2024</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Hoy</button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto relative">
                <div className="min-h-[800px] p-4 relative">
                    {/* Time Grid */}
                    {HOURS.map((hour) => (
                        <div key={hour} className="flex h-20 border-b border-slate-100 group">
                            <div className="w-16 flex-shrink-0 text-xs text-slate-400 -mt-2 -ml-2 group-hover:text-blue-500 transition-colors font-medium">
                                {hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                            </div>
                            <div className="flex-1 relative">
                                {/* Horizontal Guideline */}
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-slate-50 group-hover:bg-slate-100" />
                            </div>
                        </div>
                    ))}

                    {/* Appointments */}
                    {APPOINTMENTS.map((apt) => (
                        <div
                            key={apt.id}
                            className={`absolute left-20 right-4 p-3 rounded-lg border flex flex-col justify-center cursor-pointer hover:shadow-md transition-all ${apt.color}`}
                            style={{
                                top: `${(apt.startTime - 7) * 80 + 16}px`, // 80px per hour + 16px padding offset
                                height: `${apt.duration * 80}px`
                            }}
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-sm">{apt.patient}</span>
                                <Clock size={14} className="opacity-60" />
                            </div>
                            <span className="text-xs font-medium opacity-80">{apt.type}</span>
                        </div>
                    ))}

                    {/* Current Time Indicator (Mock) */}
                    <div className="absolute left-16 right-0 border-t-2 border-red-400 z-10 flex items-center" style={{ top: `${(10.25 - 7) * 80 + 16}px` }}> {/* 10:15 AM */}
                        <div className="w-2 h-2 rounded-full bg-red-500 -ml-1"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
