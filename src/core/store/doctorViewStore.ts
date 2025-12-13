import { create } from 'zustand';

type ViewMode = 'calendar' | 'patient_history';

interface DoctorViewState {
    activeView: ViewMode;
    selectedPatientId: number | null;
    setView: (view: ViewMode) => void;
    selectPatient: (id: number) => void;
}

export const useDoctorViewStore = create<DoctorViewState>((set) => ({
    activeView: 'calendar',
    selectedPatientId: null,
    setView: (view) => set({ activeView: view }),
    selectPatient: (id) => set({ selectedPatientId: id, activeView: 'patient_history' }),
}));
