"use client";

import React, { useState } from 'react';
import {
    Users,
    Calendar,
    Settings,
    LogOut,
    Activity,
    Search,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import DoctorSidebarHeader from './DoctorSidebarHeader';
import Image from 'next/image';

const mockPatients = [
    { id: 1, name: "Juan Perez", condition: "Hipertensión", urgency: "Alta" },
    { id: 20, name: "Juan Ariza", condition: "Gastritis Crónica", urgency: "Media" },
];

import { useDoctorViewStore } from '@/core/store/doctorViewStore';

export default function DoctorSidebar() {
    const { activeView, setView, selectPatient } = useDoctorViewStore();
    const [activeTab, setActiveTab] = useState('patients'); // Keep local tab state for sidebar UI

    return (
        <aside className="w-80 h-full bg-white border-r border-slate-200 flex flex-col relative z-20 shadow-sm">
            <DoctorSidebarHeader />

            {/* Navigation / Mode Switcher */}
            <div className="px-4 py-4 border-b border-slate-100">
                <div className="flex gap-2 p-1 bg-slate-100/80 rounded-lg">
                    <button
                        onClick={() => { setActiveTab('patients'); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'patients' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Users className="w-4 h-4" /> Pacientes
                    </button>
                    <button
                        onClick={() => { setActiveTab('calendar'); setView('calendar'); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${activeView === 'calendar' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Calendar className="w-4 h-4" /> Agenda
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar paciente..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 transition-all"
                    />
                </div>

                {/* Patient List */}
                {activeTab === 'patients' && (
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Pacientes Asignados</h3>
                        {mockPatients.map((patient) => (
                            <motion.div
                                key={patient.id}
                                onClick={() => selectPatient(patient.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer group hover:border-indigo-100 hover:bg-white hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                                            {patient.name.charAt(0)}{patient.name.split(' ')[1]?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{patient.name}</p>
                                            <p className="text-xs text-slate-500">ID: MIRS-{1000 + patient.id}</p>
                                        </div>
                                    </div>
                                    {patient.urgency === 'Alta' && (
                                        <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm animate-pulse" />
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs px-2 py-1 rounded-md bg-white text-slate-500 border border-slate-100 group-hover:border-indigo-50">
                                        {patient.condition}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all text-sm font-medium group">
                    <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}
