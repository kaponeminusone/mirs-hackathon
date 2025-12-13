"use client";

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MoreHorizontal, Brain, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const urgencyConfig = {
    'Alta': { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle },
    'Media': { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
    'Baja': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle },
};

// Mock Appointments mapped by day
const appointmentsByDay: Record<number, any[]> = {
    13: [
        { id: 1, patient: "Ana Maria Garcia", time: "09:00 AM", type: "Consulta General", aiAnalysis: { urgency: "Alta", reason: "Posible crisis hipertensiva" } },
        { id: 2, patient: "Carlos Rodriguez", time: "10:30 AM", type: "Control Diabetes", aiAnalysis: { urgency: "Media", reason: "Niveles de glucosa inestables" } },
        { id: 4, patient: "Javier Lopez", time: "03:30 PM", type: "Urgencia Menor", aiAnalysis: { urgency: "Alta", reason: "Dolor torácico atípico" } },
    ],
    14: [
        { id: 3, patient: "Sofia Martinez", time: "02:00 PM", type: "Lectura de Exámenes", aiAnalysis: { urgency: "Baja", reason: "Chequeo de rutina" } },
    ]
};

export default function DoctorCalendar() {
    const [selectedDay, setSelectedDay] = useState(13);
    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
    const startDayOffset = 3; // Wednesday starts 1st for example

    const appointments = appointmentsByDay[selectedDay] || [];

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header: Doctor Info & Availability */}
            <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-slate-200 border-2 border-white shadow-md overflow-hidden relative">
                        {/* Placeholder Avatar */}
                        <div className="absolute inset-0 flex items-center justify-center bg-indigo-600 text-white text-xl font-bold">
                            DR
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Dr. Roberto Mendoza</h1>
                        <p className="text-slate-500 text-sm">Cardiología Intervencionista</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Disponibilidad Hoy</p>
                    <div className="flex items-center gap-2 justify-end">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-lg font-semibold text-slate-800">08:00 AM - 05:00 PM</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left: Calendar Grid */}
                <div className="flex-[2] bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <CalendarIcon size={20} className="text-indigo-500" /> Diciembre 2024
                        </h2>
                        <div className="flex gap-1">
                            <button className="p-1 hover:bg-slate-100 rounded"><ChevronLeft size={20} className="text-slate-400" /></button>
                            <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={20} className="text-slate-400" /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                        {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map(day => (
                            <div key={day} className="text-xs font-semibold text-slate-400 uppercase py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 flex-1 auto-rows-fr">
                        {Array.from({ length: startDayOffset }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}
                        {daysInMonth.map(day => {
                            const hasApts = appointmentsByDay[day]?.length;
                            const isSelected = selectedDay === day;
                            const isToday = day === 13; // Simulated Today

                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(day)}
                                    className={`
                                        relative rounded-xl flex flex-col items-center justify-center transition-all border
                                        ${isSelected
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105 z-10'
                                            : 'bg-slate-50 text-slate-700 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50'
                                        }
                                        ${isToday && !isSelected ? 'ring-2 ring-indigo-400 ring-offset-2' : ''}
                                    `}
                                >
                                    <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-700'}`}>{day}</span>
                                    {hasApts ? (
                                        <div className="flex gap-0.5 mt-1">
                                            {appointmentsByDay[day].slice(0, 3).map((_, i) => (
                                                <span key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-indigo-300' : 'bg-indigo-500'}`} />
                                            ))}
                                        </div>
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Selected Day Appointments */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col overflow-hidden">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                        Agenda del {selectedDay} Dic
                        <span className="text-xs font-normal bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{appointments.length} Citas</span>
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {appointments.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                                <Clock size={40} className="mb-4 opacity-20" />
                                <p>Citas disponibles para<br />programación</p>
                            </div>
                        ) : (
                            appointments.map((apt, index) => {
                                const urgency = urgencyConfig[apt.aiAnalysis.urgency as keyof typeof urgencyConfig];
                                const UrgencyIcon = urgency.icon;

                                return (
                                    <motion.div
                                        key={apt.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-indigo-100 transition-colors group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-slate-800 text-lg">{apt.time.split(' ')[0]} <span className="text-xs font-normal text-slate-500">{apt.time.split(' ')[1]}</span></span>
                                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${urgency.bg} ${urgency.color} ${urgency.border}`}>
                                                <UrgencyIcon size={10} /> {apt.aiAnalysis.urgency}
                                            </div>
                                        </div>
                                        <h4 className="font-semibold text-slate-700 mb-1 group-hover:text-indigo-600 transition-colors">{apt.patient}</h4>
                                        <p className="text-xs text-slate-500 mb-3">{apt.type}</p>

                                        <div className="bg-white p-2 rounded-lg border border-slate-200/50">
                                            <p className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1 mb-1">
                                                <Brain size={10} /> AI Insight
                                            </p>
                                            <p className="text-xs text-slate-600 leading-snug">{apt.aiAnalysis.reason}</p>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
