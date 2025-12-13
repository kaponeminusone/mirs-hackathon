import { Appointment } from "@/components/dashboard/sidebar/AppointmentsCalendar";
import { Notification } from "@/core/store/notificationStore";

export interface Persona {
    id: string; // '1' or '20'
    name: string;
    role: string;
    email: string;
    phone: string;
    identification: string;
    avatarUrl?: string; // Optional for now
    appointments: Appointment[];
    notifications: Notification[];
}

export const PERSONA_1: Persona = {
    id: '1',
    name: 'Juan Pérez',
    role: 'Paciente Regular',
    email: 'juan.perez@email.com',
    phone: '+1 (555) 001-1234',
    identification: '12345678',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', // Swapped
    appointments: [
        { id: 'a1', title: 'Cardiología', doctor: 'Dr. Valdés', time: '10:00', location: 'Sala 304', date: new Date().toLocaleDateString('en-CA') }, // Today
        { id: 'a2', title: 'Chequeo General', doctor: 'Dra. Méndez', time: '15:30', location: 'Cons. 12', date: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-CA') }, // 2 days from now
        { id: 'a3', title: 'Análisis de Sangre', doctor: 'Lab. Central', time: '08:00', location: 'Piso 1', date: new Date(Date.now() + 86400000 * 5).toLocaleDateString('en-CA') }, // 5 days from now
    ],
    notifications: [
        { id: 'n1', title: 'Recordatorio de Cita', message: 'Mañana tienes cita con Cardiología', time: 'Hace 2h', isRead: false },
        { id: 'n2', title: 'Resultados Listos', message: 'Tus análisis de sangre están disponibles', time: 'Hace 5h', isRead: true },
    ],
};

export const PERSONA_20: Persona = {
    id: '20',
    name: 'María García',
    role: 'Paciente Crónico',
    email: 'maria.garcia@email.com',
    phone: '+1 (555) 999-8888',
    identification: '87654321',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan', // Swapped
    appointments: [
        {
            id: '3',
            title: 'Terapia de Rehabilitación',
            doctor: 'Lic. Méndez',
            time: '09:00 AM',
            location: 'Sala B',
            date: new Date().toLocaleDateString('en-CA') // Today
        },
        {
            id: '4',
            title: 'Consulta Nutrición',
            doctor: 'Nut. Torres',
            time: '04:00 PM',
            location: 'Consultorio 205',
            date: new Date(Date.now() + 86400000).toLocaleDateString('en-CA') // Tomorrow
        },
        { id: 'a3', title: 'Pediatría', doctor: 'Dr. Lopez', time: '09:00', location: 'Sala 101', date: new Date(Date.now() + 86400000).toLocaleDateString('en-CA') }, // Tomorrow
    ],
    notifications: [
        { id: '3', title: 'Alerta de Cita', message: 'Mañana tienes cita con Nutrición.', type: 'warning', read: false },
        { id: '4', title: 'Bienvenido', message: 'Bienvenido a tu portal de salud.', type: 'info', read: true },
        { id: 'n3', title: 'Vacunación', message: 'Recordatorio de vacuna anual', time: 'Ayer', isRead: false },
    ]
};
