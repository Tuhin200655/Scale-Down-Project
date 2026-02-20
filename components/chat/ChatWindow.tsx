'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { LoadingBubble } from './LoadingBubble';
import { EmptyState } from './EmptyState';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createClient } from '@/lib/supabase/client';

export default function ChatWindow({ user }: { user: any }) {
    const { messages, setMessages, addMessage, isLoading, setIsLoading, activeChatId, setActiveChatId, addChat } = useChatStore();
    const scrollRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();
    const userId = user?.id;

    // Fetch chat history when activeChatId changes
    useEffect(() => {
        let mounted = true;

        const loadHistory = async () => {
            if (!activeChatId) {
                setMessages([]);
                return;
            }

            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_id', activeChatId)
                .order('created_at', { ascending: true });

            if (data && !error && mounted) {
                setMessages(
                    data.map((msg: any) => ({
                        id: msg.id,
                        role: msg.role,
                        content: msg.content,
                        createdAt: new Date(msg.created_at),
                    }))
                );
            }
        };

        loadHistory();

        return () => { mounted = false; };
    }, [activeChatId, supabase, setMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        // We will optimistically add the user message to UI
        const optimisticId = Date.now().toString();
        addMessage({
            id: optimisticId,
            role: 'user',
            content,
            createdAt: new Date(),
        });

        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content, chatId: activeChatId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Failed to fetch response';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.details || errorJson.error || errorMessage;
                } catch {
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            // Set the active chat ID if a new one was created
            if (data.chatId && data.chatId !== activeChatId) {
                setActiveChatId(data.chatId);
                if (data.chatTitle) {
                    addChat({ id: data.chatId, title: data.chatTitle });
                }
            }

            // The API response now handles saving both the user message and bot response
            addMessage({
                id: data.responseId || Date.now().toString() + '-bot',
                role: 'assistant',
                content: data.response,
                createdAt: new Date(),
            });
        } catch (error) {
            console.error('Error sending message:', error);
            addMessage({
                id: Date.now().toString() + '-error',
                role: 'assistant',
                content: 'Sorry, something went wrong. Please try again.',
                createdAt: new Date(),
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto border-none md:border md:border-white/20 dark:md:border-white/10 rounded-none md:rounded-2xl shadow-none md:shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-transparent md:bg-white/40 dark:md:bg-zinc-950/40 md:backdrop-blur-xl">
            <div className="flex-1 overflow-hidden p-2 md:p-4">
                <ScrollArea className="h-full pr-2 md:pr-4">
                    <div className="flex flex-col gap-4">
                        {messages.length === 0 ? (
                            <div className="h-full min-h-[500px] flex items-center justify-center">
                                <EmptyState />
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} user={user} />
                            ))
                        )}
                        {isLoading && <LoadingBubble />}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>
            </div>
            <div className="p-2 md:p-4 border-t border-white/10 bg-black/10 md:bg-white/30 dark:md:bg-zinc-950/30 rounded-none md:rounded-b-2xl backdrop-blur-md">
                <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            </div>
        </div>
    );
}
