"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Heart,
    FileText,
    AlertCircle,
    ArrowLeft,
    Database,
    Thermometer,
    Stethoscope,
    Download,
    Share2,
    Printer,
    File
} from 'lucide-react';
import { useDoctorViewStore } from '@/core/store/doctorViewStore';
import dynamic from 'next/dynamic';

const HeartRateChart = dynamic(
    () => import('./PatientVitalsCharts').then((mod) => mod.HeartRateChart),
    { ssr: false }
);

const BloodPressureChart = dynamic(
    () => import('./PatientVitalsCharts').then((mod) => mod.BloodPressureChart),
    { ssr: false }
);

// Mock Data
const mockHistory = {
    1: {
        name: "Juan Perez",
        age: 45,
        bloodType: "O+",
        allergies: "Penicilina",
        eps: "SaludTotal",
        lastVitals: [
            { time: '08:00', bp: 135, hr: 82 },
            { time: '12:00', bp: 138, hr: 85 },
            { time: '16:00', bp: 130, hr: 80 },
            { time: '20:00', bp: 132, hr: 81 },
        ],
        currentVitals: { hr: 81, bp: "132/85", temp: 36.8 }
    },
    20: {
        name: "Juan Ariza",
        age: 38,
        bloodType: "A+",
        allergies: "Ninguna",
        eps: "SaludTotal",
        lastVitals: [
            { time: '08:00', bp: 110, hr: 65 },
            { time: '12:00', bp: 115, hr: 80 },
            { time: '16:00', bp: 112, hr: 72 },
            { time: '20:00', bp: 110, hr: 68 },
        ],
        currentVitals: { hr: 68, bp: "110/70", temp: 36.5 }
    },
    // Fallback
    default: {
        name: "Paciente Seleccionado",
        age: 30,
        bloodType: "A+",
        allergies: "Ninguna",
        eps: "SaludTotal",
        lastVitals: [
            { time: '08:00', bp: 120, hr: 70 },
        ],
        currentVitals: { hr: 70, bp: "120/80", temp: 37.0 }
    }
};

export default function PatientHistory() {
    const { selectedPatientId, setView } = useDoctorViewStore();
    const patientData = mockHistory[selectedPatientId as keyof typeof mockHistory] || mockHistory.default;

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setView('calendar')}
                        className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            {patientData.name}
                            <span className="text-xs font-normal px-2 py-1 rounded bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                                <Database size={12} /> Afiliado a {patientData.eps}
                            </span>
                        </h1>
                        <p className="text-slate-500 text-sm">ID: MIRS-{1000 + (selectedPatientId || 0)} • {patientData.age} años • {patientData.bloodType}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="flex-1 flex gap-6 overflow-hidden">

                {/* Center: PDF Viewer */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800">Historia_Clinica_Unificada.pdf</h3>
                                <p className="text-xs text-slate-500">Documento Oficial</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><Printer size={18} /></button>
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><Share2 size={18} /></button>
                            <button className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium px-4">
                                <Download size={16} /> Descargar
                            </button>
                        </div>
                    </div>

                    {/* PDF Content */}
                    <div className="flex-1 bg-slate-100 overflow-hidden relative">
                        {String(selectedPatientId) === '1' ? (
                            // Use actual iframe for Patient 1
                            <iframe
                                src="/PACIENTE1.pdf"
                                className="w-full h-full border-none"
                                title="Historia Clinica"
                            />
                        ) : (
                            // Use Mock UI for others (Patient 20)
                            <div className="h-full overflow-y-auto flex justify-center p-8">
                                <div className="w-full max-w-3xl bg-white shadow-lg min-h-[800px] p-12 text-slate-800">
                                    <div className="border-b border-slate-200 pb-8 mb-8 flex justify-between items-start">
                                        <div>
                                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Historia Clínica Unificada</h1>
                                            <p className="text-slate-500">MIRS AI Health System</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-900">{patientData.eps}</p>
                                            <p className="text-sm text-slate-500">Folio: #87923-X</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <section>
                                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Anamnesis</h4>
                                            <p className="leading-relaxed text-slate-600">
                                                Paciente masculino de {patientData.age} años, acude a consulta por cuadro de dolor abdominal epigástrico
                                                tipo ardor, asociado a ingesta de alimentos irritantes. Refiere pirosis ocasional y sensación de plenitud postprandial.
                                                No melenas, no hematemesis. Antecedentes de gastritis manejada con IBP ocasional.
                                            </p>
                                        </section>

                                        <section>
                                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Examen Físico</h4>
                                            <ul className="list-disc list-inside space-y-2 text-slate-600">
                                                <li>Abdomen: Ruidos intestinales presentes, dolor leve a la palpación en epigastrio. No masas ni megalias. Murphy negativo.</li>
                                                <li>Cardiopulmonar: Sin alteraciones.</li>
                                                <li>Signos vitales estables.</li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Plan y Manejo</h4>
                                            <p className="leading-relaxed text-slate-600 mb-4">
                                                Impresión diagnóstica: Gastritis aguda/CR. Enfermedad por reflujo gastroesofágico.
                                            </p>
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                <p className="text-sm text-blue-800 font-medium">Orden Médica:</p>
                                                <ul className="list-decimal list-inside text-sm text-blue-700 mt-2">
                                                    <li>Esomeprazol 40mg cada 24h por 30 días.</li>
                                                    <li>Dietas baja en grasas y condimentos.</li>
                                                    <li>Endoscopia digestiva alta (programar ambulatorio).</li>
                                                </ul>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar: Vitals */}
                <div className="w-80 flex flex-col gap-4 shrink-0">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Activity size={18} className="text-blue-500" /> Signos Vitales
                        </h3>

                        <div className="space-y-6">
                            {/* HR */}
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm text-slate-500">Frecuencia Cardíaca</span>
                                    <span className="text-xl font-bold text-slate-800">{patientData.currentVitals.hr} <span className="text-xs text-slate-400 font-normal">bpm</span></span>
                                </div>
                                <div className="h-24 bg-red-50 rounded-xl overflow-hidden border border-red-100">
                                    <HeartRateChart data={patientData.lastVitals} />
                                </div>
                            </div>

                            {/* BP */}
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm text-slate-500">Presión Arterial</span>
                                    <span className="text-xl font-bold text-slate-800">{patientData.currentVitals.bp} <span className="text-xs text-slate-400 font-normal">mmHg</span></span>
                                </div>
                                <div className="h-24 bg-blue-50 rounded-xl overflow-hidden border border-blue-100">
                                    <BloodPressureChart data={patientData.lastVitals} />
                                </div>
                            </div>

                            {/* Temp */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Thermometer size={18} className="text-amber-500" />
                                    <span className="text-sm text-slate-600">Temperatura</span>
                                </div>
                                <span className="font-bold text-slate-800">{patientData.currentVitals.temp}°C</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex-1">
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Stethoscope size={18} className="text-purple-500" /> Notas Rápidas
                        </h3>
                        <textarea
                            className="w-full h-32 p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none text-slate-700 placeholder:text-slate-400"
                            placeholder="Agregar nota de evolución..."
                        />
                        <button className="w-full mt-3 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                            Guardar Nota
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
