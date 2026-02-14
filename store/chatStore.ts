import { create } from 'zustand';
import { ChatState } from '@/lib/types/chat';

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    isLoading: false,
    addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
    setIsLoading: (isLoading) => set({ isLoading }),
}));
