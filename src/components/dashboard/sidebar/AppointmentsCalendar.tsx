import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, User, Calendar as CalendarIcon } from 'lucide-react';
import { useUserStore } from '@/core/store/userStore';

export interface Appointment {
    id: string;
    title: string;
    doctor: string;
    time: string;
    location: string;
    date?: string; // Optional date 'YYYY-MM-DD' for logic if needed later
    type?: 'checkup' | 'followup' | 'emergency';
}

import { appointmentService } from '@/core/services/appointmentService';

export default function AppointmentsCalendar() {
    const { currentPersonaId } = useUserStore();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    React.useEffect(() => {
        const fetchAppointments = async () => {
            setIsLoading(true);
            setError(null);

            // Should we clear appointments while loading new ones? Yes, usually better UX.
            setAppointments([]);

            try {
                // Use the dynamic ID from the store
                const data = await appointmentService.getAppointmentsByPatientId(currentPersonaId);
                setAppointments(data);
            } catch (err) {
                console.error("Failed to fetch appointments", err);
                setError("No se pudo cargar la información de citas.");
                setAppointments([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, [currentPersonaId]); // Refetch when persona changes

    // Calendar Logic
    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    const renderCalendarDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);

        // Padding for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`pad-${i}`} className="h-6 w-6"></div>);
        }

        // Days
        for (let i = 1; i <= totalDays; i++) {
            const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            // Use en-CA for YYYY-MM-DD format in local time
            const dateString = currentDayDate.toLocaleDateString('en-CA');

            const isToday = i === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
            const hasAppointment = appointments.some(apt => apt.date === dateString);

            days.push(
                <button
                    key={i}
                    onClick={() => { /* Optional: Filter list by day */ }}
                    className={`h-6 w-6 rounded-full text-[10px] flex items-center justify-center relative transition-all
                        ${isToday
                            ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30'
                            : hasAppointment
                                ? 'bg-slate-800 text-blue-400 font-semibold ring-1 ring-blue-500/50' // Highlight for appointment
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    {i}
                    {hasAppointment && !isToday && (
                        <span className="absolute bottom-0.5 w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse"></span>
                    )}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mini Calendar Widget - Compact Mode */}
            <div className="p-3 border-b border-slate-700 bg-slate-800/30">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-200">
                        {monthNames[currentDate.getMonth()]} <span className="text-slate-500 font-normal">{currentDate.getFullYear()}</span>
                    </h3>
                    <div className="flex gap-0.5">
                        <button onClick={prevMonth} className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                            <ChevronLeft size={14} />
                        </button>
                        <button onClick={nextMonth} className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-y-1 gap-x-0 mb-1 place-items-center">
                    {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, idx) => (
                        <div key={`${day}-${idx}`} className="h-5 w-full flex items-center justify-center text-[9px] font-medium text-slate-500">
                            {day}
                        </div>
                    ))}
                    {renderCalendarDays()}
                </div>
            </div>

            {/* Appointment List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                <div className="flex items-center justify-between px-1 pt-2">
                    <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                        Citas: {monthNames[currentDate.getMonth()]}
                    </h4>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                        {appointments.filter(apt => {
                            if (!apt.date) return false;
                            const aptDate = new Date(apt.date + 'T00:00:00'); // Force local midnight parsing from YYYY-MM-DD string
                            return aptDate.getMonth() === currentDate.getMonth() && aptDate.getFullYear() === currentDate.getFullYear();
                        }).length} Citas
                    </span>
                </div>

                {isLoading ? (
                    <div className="p-4 text-center text-xs text-slate-500 animate-pulse">
                        Cargando citas...
                    </div>
                ) : error ? (
                    <div className="p-4 text-center text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg mx-2">
                        {error}
                    </div>
                ) : (
                    <>
                        {appointments.filter(apt => {
                            if (!apt.date) return true; // Show if no date (fallback)
                            const aptDate = new Date(apt.date + 'T00:00:00');
                            return aptDate.getMonth() === currentDate.getMonth() && aptDate.getFullYear() === currentDate.getFullYear();
                        }).map((apt) => (
                            <div
                                key={apt.id}
                                className="group relative p-4 rounded-xl border border-slate-700/50 bg-slate-700/20 hover:bg-slate-700/40 hover:border-slate-600 transition-all duration-200 cursor-pointer hover:translate-x-1"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h5 className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                                            {apt.title}
                                        </h5>
                                        <div className="flex flex-col gap-0.5 mt-1">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                <User size={12} className="text-slate-500" />
                                                <span>{apt.doctor}</span>
                                            </div>
                                            {apt.date && (
                                                <span className="text-[10px] text-slate-500 pl-4">
                                                    {new Date(apt.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-bold text-slate-200 bg-slate-700/50 px-2 py-1 rounded-md border border-slate-600">
                                            {apt.time}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
                                    <MapPin size={12} className="text-slate-500" />
                                    <span className="text-xs text-slate-400 truncate max-w-[200px]">
                                        {apt.location}
                                    </span>
                                </div>

                                {/* Decorative side accent */}
                                <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-500/50 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        ))}

                        {appointments.filter(apt => {
                            if (!apt.date) return true;
                            const aptDate = new Date(apt.date + 'T00:00:00');
                            return aptDate.getMonth() === currentDate.getMonth() && aptDate.getFullYear() === currentDate.getFullYear();
                        }).length === 0 && (
                                <div className="p-4 text-center text-xs text-slate-500 italic mt-4 opacity-70">
                                    No hay citas para {monthNames[currentDate.getMonth()]}.
                                </div>
                            )}
                    </>
                )}
            </div>
        </div>
    );
}
