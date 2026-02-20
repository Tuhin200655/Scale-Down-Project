import { create } from 'zustand';
import { ChatState } from '@/lib/types/chat';

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    isLoading: false,
    activeChatId: null,
    chats: [],
    addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
    setMessages: (messages) => set({ messages }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setActiveChatId: (id) => set({ activeChatId: id }),
    setChats: (chats) => set({ chats }),
    addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
    updateChatTitle: (id, title) => set((state) => ({
        chats: state.chats.map((c) => c.id === id ? { ...c, title } : c)
    })),
    deleteChat: (id) => set((state) => ({
        chats: state.chats.filter((c) => c.id !== id),
        activeChatId: state.activeChatId === id ? null : state.activeChatId,
        messages: state.activeChatId === id ? [] : state.messages
    })),
}));
