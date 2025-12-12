import { create } from 'zustand';
import { ChatSession, MOCK_HISTORY } from '../mocks/mockHistory';

interface ChatState {
    sessions: ChatSession[];
    activeSessionId: string | null;
    isLoading: boolean;
    isMuted: boolean; // Global mute state
    addSession: (session: ChatSession) => void;
    updateSession: (id: string, updates: Partial<ChatSession>) => void; // Update title/messages
    deleteSession: (id: string) => void;
    setActiveSession: (id: string | null) => Promise<void>;
    toggleMute: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    sessions: MOCK_HISTORY,
    activeSessionId: null,
    isLoading: false,
    isMuted: false, // Default un-muted

    addSession: (session) => set((state) => ({
        sessions: [session, ...state.sessions],
        activeSessionId: session.id
    })),

    updateSession: (id, updates) => set((state) => ({
        sessions: state.sessions.map(s => s.id === id ? { ...s, ...updates } : s)
    })),

    deleteSession: (id) => set((state) => ({
        sessions: state.sessions.filter(s => s.id !== id),
        activeSessionId: state.activeSessionId === id ? null : state.activeSessionId
    })),

    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

    setActiveSession: async (id) => {
        // If clicking same session, do nothing? Or reload? Let's just set it for now.
        if (id === get().activeSessionId && id !== null) return;

        if (id === null) {
            set({ activeSessionId: null });
            return;
        }

        // Simulate API Mock Loading
        set({ isLoading: true });

        // Faking a network request...
        await new Promise(resolve => setTimeout(resolve, 600)); // slightly faster

        set({ activeSessionId: id, isLoading: false });
    }
}));

// Alias for the requested store name
export const useMIRSStore = useChatStore;
