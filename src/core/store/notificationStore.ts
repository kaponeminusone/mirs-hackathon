import { create } from 'zustand';

export interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    type: 'success' | 'info' | 'warning';
    read: boolean;
}

interface NotificationState {
    notifications: Notification[];
    markAsRead: (id: number) => void;
    hasUnread: () => boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 2,
        title: 'Resultados Disponibles',
        message: 'Los análisis de sangre ya están listos.',
        time: 'Ayer',
        type: 'info',
        read: false
    },
    {
        id: 3,
        title: 'Recordatorio',
        message: 'Mañana tienes chequeo general.',
        time: 'Ayer',
        type: 'warning',
        read: true
    }
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: MOCK_NOTIFICATIONS,
    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        )
    })),
    hasUnread: () => get().notifications.some(n => !n.read)
}));
