import { create } from 'zustand';

export interface Notification {
    id: string; // Changed to string to match mockPersonas
    title: string;
    message: string;
    // time: string; // Removed or optional if not in mockPersonas? Mock has no time field in my previous write.
    // Wait, mockPersonas `Notification` type was imported from here.
    // I need to check mockPersonas usage.
    // In mockPersonas I wrote: { id: '1', title: '...', message: '...', type: 'info', read: false }
    // I missed `time`. I should either add time to mock or make it optional.
    // Let's make time optional here.
    time?: string;
    type: 'success' | 'info' | 'warning';
    read: boolean;
}

interface NotificationState {
    notifications: Notification[];
    markAsRead: (id: string) => void;
    hasUnread: () => boolean;
    setNotifications: (notifications: Notification[]) => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '2',
        title: 'Resultados Disponibles',
        message: 'Los análisis de sangre ya están listos.',
        time: 'Ayer',
        type: 'info',
        read: false
    }
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: MOCK_NOTIFICATIONS,
    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        )
    })),
    hasUnread: () => get().notifications.some(n => !n.read),
    setNotifications: (notifications) => set({ notifications })
}));
