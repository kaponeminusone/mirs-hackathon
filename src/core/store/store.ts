import { create } from 'zustand';

interface SessionState {
    patientId: string | null;
    setPatientId: (id: string) => void;
    // Add more state slices here as needed
}

export const useSessionStore = create<SessionState>((set) => ({
    patientId: null,
    setPatientId: (id) => set({ patientId: id }),
}));
