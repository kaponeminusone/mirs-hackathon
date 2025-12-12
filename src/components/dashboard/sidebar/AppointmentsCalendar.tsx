import React from 'react';
import { Calendar as CalendarIcon, MapPin, Stethoscope } from 'lucide-react';

interface Appointment {
    id: string;
    title: string;
    doctor: string;
    time: string;
    location: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: '1',
        title: 'Consulta Cardiología',
        doctor: 'Dr. Valerio',
        time: '11:30 AM',
        location: 'Consultorio 302',
    },
    {
        id: '2',
        title: 'Chequeo General',
        doctor: 'Dra. Silva',
        time: '02:00 PM',
        location: 'Consultorio 104',
    },
    {
        id: '3',
        title: 'Seguimiento Neurología',
        doctor: 'Dr. Mendez',
        time: '04:15 PM',
        location: 'Consultorio 210',
    },
];

export default function AppointmentsCalendar() {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Hoy, 12 Dic</h3>

                {MOCK_APPOINTMENTS.map((apt) => (
                    <div
                        key={apt.id}
                        className="flex gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/50 transition-colors cursor-pointer"
                    >
                        <div className="flex flex-col items-center justify-start pt-1">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Stethoscope size={14} />
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-slate-700 text-sm">{apt.title}</span>
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                    {apt.time}
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 mb-1">{apt.doctor}</p>
                            <div className="flex items-center gap-1 text-slate-400">
                                <MapPin size={12} />
                                <span className="text-xs">{apt.location}</span>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Mañana</h3>
                    <div className="p-4 text-center rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                        No hay citas programadas
                    </div>
                </div>
            </div>
        </div>
    );
}
