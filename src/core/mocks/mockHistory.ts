export type TriageLevel = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'BLUE';

export interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
}

export interface ChatSession {
    id: string;
    date: string;
    summary: string;
    triageLevel: TriageLevel;
    patientName: string; // Keeping this for UI consistency if needed, or derived
    messages: Message[];
}

export const MOCK_HISTORY: ChatSession[] = [
    {
        id: '1',
        date: 'Hoy, 10:42 AM',
        summary: 'Dolor torácico opresivo con irradiación...',
        triageLevel: 'RED',
        patientName: 'Roberto Gómez',
        messages: [
            { id: '1a', role: 'user', content: 'Tengo un dolor fuerte en el pecho que se va al brazo izquierdo.', timestamp: '10:40 AM' },
            { id: '1b', role: 'ai', content: 'Entiendo. ¿Del 1 al 10, qué tan intenso es el dolor?', timestamp: '10:40 AM' },
            { id: '1c', role: 'user', content: 'Como un 9, es muy opresivo.', timestamp: '10:41 AM' },
            { id: '1d', role: 'ai', content: 'Esto podría ser una emergencia cardíaca. Se ha asignado prioridad ROJA. Por favor mantenga la calma, un médico va en camino.', timestamp: '10:42 AM' }
        ]
    },
    {
        id: '2',
        date: 'Hoy, 09:15 AM',
        summary: 'Fiebre alta persistente y rigidez...',
        triageLevel: 'ORANGE',
        patientName: 'Maria Silva',
        messages: []
    },
    {
        id: '3',
        date: 'Ayer, 04:30 PM',
        summary: 'Migraña intensa con fotofobia...',
        triageLevel: 'YELLOW',
        patientName: 'Carlos Ruiz',
        messages: []
    },
    {
        id: '4',
        date: 'Ayer, 02:00 PM',
        summary: 'Consulta de control hipertensión...',
        triageLevel: 'GREEN',
        patientName: 'Ana Campos',
        messages: []
    },
    {
        id: '5',
        date: '10 Dic, 11:00 AM',
        summary: 'Solicitud de renovación de receta...',
        triageLevel: 'BLUE',
        patientName: 'Luis Torres',
        messages: []
    }
];
