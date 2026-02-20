export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  chats: { id: string; title: string }[];
  setChats: (chats: { id: string; title: string }[]) => void;
  addChat: (chat: { id: string; title: string }) => void;
  updateChatTitle: (id: string, title: string) => void;
  deleteChat: (id: string) => void;
}
