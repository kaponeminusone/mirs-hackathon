import { create } from 'zustand';
import { ChatSession, MOCK_HISTORY } from '../mocks/mockHistory';

interface ChatState {
    sessions: ChatSession[];
    activeSessionId: string | null;
    isLoading: boolean;
    isMuted: boolean; // Global mute state
    currentPatientId: string; // '1' or '20'
    addSession: (session: ChatSession) => void;
    updateSession: (id: string, updates: Partial<ChatSession>) => void; // Update title/messages
    deleteSession: (id: string) => void;
    setActiveSession: (id: string | null) => Promise<void>;
    setPatientId: (id: string) => void;
    toggleMute: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    sessions: MOCK_HISTORY,
    activeSessionId: null,
    isLoading: false,
    isMuted: false, // Default un-muted
    currentPatientId: '1',

    setPatientId: (id) => set({ currentPatientId: id }),

    addSession: (session) => set((state) => ({
        // Ensure the session has the correct patient ID attached (safety check)
        sessions: [{ ...session, patientId: state.currentPatientId }, ...state.sessions],
        activeSessionId: session.id
    })),

    // Selector: We need to filter sessions by currentPatientId when consuming them in UI
    // But Zustand state is "global".
    // We will just store ALL sessions, but we assume the UI will filter them? 
    // Or we provide a "filteredSessions" getter?
    // Let's modify the sessions array? No, we might lose data.
    // Let's rely on the `ChatHistoryList` to filter using `currentPatientId`.
    // Wait, the user said "clasifica los chats para que no se compartan".
    // So the store should probably hold everything but exposing filtered list is nice.
    // Or simpler: `ChatHistoryList` does the filtering.
    // I will add `patientId` to `ChatSession` type if it's not there.

    updateSession: (id, updates) => set((state) => ({
        sessions: state.sessions.map(s => s.id === id ? { ...s, ...updates } : s)
    })),

    deleteSession: (id) => set((state) => ({
        sessions: state.sessions.filter(s => s.id !== id),
        activeSessionId: state.activeSessionId === id ? null : state.activeSessionId
    })),

    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

    setActiveSession: async (id) => {
        if (id === get().activeSessionId && id !== null) return;

        if (id === null) {
            set({ activeSessionId: null });
            return;
        }

        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 600));
        set({ activeSessionId: id, isLoading: false });
    }
}));

// Alias for the requested store name
export const useMIRSStore = useChatStore;
