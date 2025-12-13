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
    name: 'Dr. Roberto Mendoza',
    specialty: 'Cardiología',
    email: 'roberto.mendoza@mirs.com',
    phone: '+1 (555) 123-4567',
    identification: 'DOC-98765',
    updateProfile: (data) => set((state) => ({ ...state, ...data })),
}));
