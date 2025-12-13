import { create } from 'zustand';

interface DoctorState {
    name: string;
    specialty: string;
    email: string;
    phone: string;
    identification: string;
    updateProfile: (data: Partial<Omit<DoctorState, 'updateProfile'>>) => void;
}

export const useDoctorStore = create<DoctorState>((set) => ({
    name: 'Dr. Santiago Medina',
    specialty: 'Gastroenterología',
    email: 'santiago.medina@mirs.com',
    phone: '+57 300 123 4567',
    identification: 'DOC-1001',
    updateProfile: (data) => set((state) => ({ ...state, ...data })),
}));
