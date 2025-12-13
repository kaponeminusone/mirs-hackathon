"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Activity, Shield, Clock, ChevronRight, Sparkles, Brain } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const cardVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 50, damping: 20 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const yBackground1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yBackground2 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const yBackground3 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden relative">

      {/* Parallax Background Decoratives */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div style={{ y: yBackground1 }} className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-400/20 blur-[120px]" />
        <motion.div style={{ y: yBackground2 }} className="absolute top-[30%] -right-[20%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-[120px]" />
        <motion.div style={{ y: yBackground3 }} className="absolute bottom-[0%] left-[20%] w-[40%] h-[40%] rounded-full bg-emerald-400/20 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed w-full bg-white/70 backdrop-blur-xl border-b border-white/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/mirs.svg"
                  alt="MIRS Logo"
                  fill
                  className="object-contain" // Preserves aspect ratio
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight leading-none">MIRS</span>
                <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">Medical Intelligence Response System</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/chat" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">
                Soy Paciente
              </Link>
              <Link href="/doctor" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">
                Soy Doctor
              </Link>
              <Link
                href="/chat"
                className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Inicia Sesión con MIRS
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
        >
          <div className="text-center max-w-6xl mx-auto">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 border border-blue-100 backdrop-blur-sm text-blue-800 text-sm font-bold mb-6 shadow-sm">
              Asistente de Respuesta Médica Avanzada
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-[6rem] sm:text-[9rem] md:text-[11rem] lg:text-[13rem] font-black tracking-tighter leading-[0.8] mb-4 select-none"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-slate-900 via-slate-800 to-slate-500 drop-shadow-sm filter">
                MIRS
              </span>
            </motion.h1>

            <motion.h2 variants={fadeInUp} className="text-xl md:text-3xl lg:text-4xl font-light text-slate-500 tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-10">
              Medical Intelligence <span className="font-bold text-slate-900">Response System</span>
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              Diagnósticos preliminares por voz y gestión inteligente de tu salud.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                href="/chat"
                className="group relative bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-bold overflow-hidden shadow-2xl shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-1 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2">
                  Evaluar mi Condición
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link
                href="#features"
                className="group px-8 py-4 rounded-full text-lg font-bold text-slate-700 bg-white/50 hover:bg-white border border-white/50 hover:border-white shadow-lg shadow-slate-200/50 transition-all hover:-translate-y-1"
              >
                Descubrir MIRS
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Parallax Break Section */}
      <div className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 z-0 bg-fixed bg-center bg-cover"
          style={{ backgroundImage: 'url("/fondo.avif")' }}
        />
        <div className="absolute inset-0 bg-slate-900/60 z-10" /> {/* Overlay */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Tecnología que Entiende tu Salud</h2>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto font-light">
            Algoritmos diseñados para escuchar, analizar y actuar cuando más lo necesitas.
          </p>
        </motion.div>
      </div>

      {/* Bento Grid Features */}
      <div id="features" className="py-24 relative z-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]"
          >
            {/* Feature 1: Speech to Speech (Large - Spans 2 cols) */}
            <motion.div variants={cardVariant} className="md:col-span-2 group relative rounded-[2.5rem] overflow-hidden bg-white border border-white/60 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60" />

              <div className="relative h-full flex flex-col md:flex-row p-8 md:p-12 gap-8 items-center">
                <div className="flex-1 z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-6 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> IA Generativa
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">Evaluación por Voz</h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-8">
                    Habla con MIRS. Nuestra IA escucha, transcribe y analiza tus síntomas en tiempo real, creando un pre-diagnóstico preciso al instante.
                  </p>
                </div>
                <div className="flex-1 w-full relative h-[250px] md:h-full">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50">
                    <Image
                      src="/images/screenshots/voice_ui_final.png"
                      alt="Interfaz de Voz"
                      fill
                      className="object-cover object-top transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Clinical Analysis (Regular) */}
            <motion.div variants={cardVariant} className="md:col-span-1 group relative rounded-[2.5rem] overflow-hidden bg-white border border-white/60 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative h-full flex flex-col p-8">
                <div className="relative w-full h-48 mb-6 z-0 rounded-2xl overflow-hidden shadow-md border border-slate-100">
                  <Image
                    src="/images/screenshots/analysis_chat_ui.png"
                    alt="Resultados y Análisis"
                    fill
                    className="object-cover object-top transform group-hover:scale-105 group-hover:translate-y-1 transition-transform duration-700"
                  />
                </div>
                <div className="z-10 mt-auto">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">Análisis Profundo</h3>
                  <p className="text-slate-600">
                    MIRS cruza tu historial clínico con síntomas actuales para detectar patrones invisibles.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Smart Scheduling (Regular) */}
            <motion.div variants={cardVariant} className="md:col-span-1 group relative rounded-[2.5rem] overflow-hidden bg-white border border-white/60 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative h-full flex flex-col p-8">
                <div className="z-10">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">Agenda Inteligente</h3>
                  <p className="text-slate-600 mb-6">
                    Asignación automática de citas con el especialista correcto según tu urgencia.
                  </p>
                </div>
                <div className="relative w-full flex-1 min-h-[180px] rounded-2xl overflow-hidden shadow-md border border-slate-100">
                  <Image
                    src="/images/screenshots/calendar_ui.png"
                    alt="Calendario"
                    fill
                    className="object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </motion.div>

            {/* Feature 4: Auto Authorizations (Large - Spans 2 cols) */}
            <motion.div variants={cardVariant} className="md:col-span-2 group relative rounded-[2.5rem] overflow-hidden bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-indigo-900/30 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] -ml-20 -mb-20" />

              <div className="relative h-full flex flex-col md:flex-row-reverse p-8 md:p-12 gap-8 items-center">
                <div className="flex-1 z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold mb-6 uppercase tracking-wider">
                    <Shield className="w-3 h-3" /> Sin Burocracia
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">Autorizaciones Instantáneas</h3>
                  <p className="text-slate-300 text-lg leading-relaxed mb-8">
                    Olvídate del papeleo. El motor MIRS valida tu diagnóstico y emite las órdenes necesarias en segundos.
                  </p>
                  <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md transition-colors font-medium text-white flex items-center gap-2">
                    Ver como funciona <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 w-full relative h-[250px] md:h-full">
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                    <Image
                      src="/images/landing/auth.png"
                      alt="Autorizaciones"
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 relative z-10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top Section: Partners & Power */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Project Identity */}
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="relative w-8 h-8 opacity-80">
                  <Image
                    src="/mirs.svg"
                    alt="MIRS Logo"
                    fill
                    className="object-contain brightness-0 invert transition-all"
                  />
                </div>
                <span className="text-xl font-bold text-slate-200 tracking-tight">MIRS</span>
              </div>
              <p className="text-sm leading-relaxed mb-6 opacity-80">
                Sistema de respuesta médica inteligente diseñado para revolucionar la atención primaria mediante IA generativa.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full w-fit">
                Powered by Google Gemini
              </div>
            </div>

            {/* Organization */}
            <div className="col-span-1 lg:col-span-1">
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                Organizado Por
              </h3>
              <div className="h-16 w-48 relative opacity-80 hover:opacity-100 transition-opacity">
                <Image
                  src="/logo-econova.png"
                  alt="Econova & Ecopetrol Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>

            {/* Team */}
            <div className="col-span-1 lg:col-span-1">
              <h3 className="text-white font-semibold mb-6">Equipo de Desarrollo</h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://github.com/kaponeminusone/mirs-hackathon" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors group">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <span className="font-mono text-[10px] font-bold">NH</span>
                    </div>
                    Nicolas Henao
                  </a>
                </li>
                <li>
                  <a href="https://github.com/GreisonCastilla" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors group">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <span className="font-mono text-[10px] font-bold">GC</span>
                    </div>
                    Greison Castilla
                  </a>
                </li>
                <li>
                  <a href="https://github.com/AngelEspinosaDev/mirs-back" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors group">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <span className="font-mono text-[10px] font-bold">AE</span>
                    </div>
                    Angel Espinosa
                  </a>
                </li>
              </ul>
            </div>

            {/* Location */}
            <div className="col-span-1 lg:col-span-1">
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                Ubicación del Evento
              </h3>
              <address className="not-italic text-sm space-y-2 opacity-80">
                <p className="font-medium text-slate-300">Unicolombo, Sede Cuatro Vientos</p>
                <p>Av. Pedro de Heredia, Cra. 50 #31-51</p>
                <p>Cartagena, Colombia</p>
              </address>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
            <p>&copy; 2025 MIRS Project. Hackathon Edition.</p>
            <p className="flex items-center gap-1">
              MIRS: Mucho Insomnio Resistimos Siempre
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

