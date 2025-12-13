import { create } from 'zustand';

interface UserState {
    name: string;
    role: string;
    email: string;
    phone: string;
    identification: string;
    updateProfile: (data: Partial<Omit<UserState, 'updateProfile'>>) => void;
}

export const useUserStore = create<UserState>((set) => ({
    name: 'Juan Pérez',
    role: 'Paciente',
    email: 'juan.perez@email.com',
    phone: '+1 (555) 987-6543',
    identification: '12345678',
    updateProfile: (data) => set((state) => ({ ...state, ...data })),
}));
