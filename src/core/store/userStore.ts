import { create } from 'zustand';
import { Appointment } from '@/components/dashboard/sidebar/AppointmentsCalendar';
import { Persona, PERSONA_1, PERSONA_20 } from '../mocks/mockPersonas';
import { useNotificationStore } from './notificationStore'; // We will use this to sync notifications? No, store-to-store is tricky.
// Better: userStore holds the "current persona ID" and we do a "useEffect" or a "Manager" component?
// Or we just update everything in the `setPersona` action?
// Zustand allows calling other stores if we treat them outside the hook? Or we just export the store api?

interface UserState {
    name: string;
    role: string;
    email: string;
    phone: string;
    identification: string;
    avatarUrl?: string;
    appointments: Appointment[];
    currentPersonaId: string;

    updateProfile: (data: Partial<Omit<UserState, 'updateProfile' | 'setPersona'>>) => void;
    setPersona: (id: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    // Default to Persona 1
    ...PERSONA_1,
    currentPersonaId: '1',
    appointments: PERSONA_1.appointments,

    updateProfile: (data) => set((state) => ({ ...state, ...data })),

    setPersona: (id) => {
        const targetPersona = id === '20' ? PERSONA_20 : PERSONA_1;

        set({
            ...targetPersona,
            currentPersonaId: id,
            appointments: targetPersona.appointments
        });

        // We also need to update Notifications.
        // Since we can't easily import another hook here without breaking rules,
        // we might handle the notification sync in the UI component (PatientSwitcher) 
        // OR we can use the window event or just simple external store access if we export the store instance properly.
        // But for simplicity, let's keep the notification update in the Component layer for now, OR:
        // Import the store instance directly (not the hook).
    },
}));
