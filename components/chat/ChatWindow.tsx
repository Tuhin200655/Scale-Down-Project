'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { LoadingBubble } from './LoadingBubble';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ChatWindow() {
    const { messages, addMessage, isLoading, setIsLoading } = useChatStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        // Add user message immediately
        addMessage({
            id: Date.now().toString(),
            role: 'user',
            content,
            createdAt: new Date(),
        });

        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content }),
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

            addMessage({
                id: Date.now().toString() + '-bot',
                role: 'assistant',
                content: data.response, // Assuming API returns { response: string }
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
        <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto border rounded-lg shadow-sm bg-background">
            <div className="flex-1 overflow-hidden p-4">
                <ScrollArea className="h-full pr-4">
                    <div className="flex flex-col gap-4">
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full min-h-[300px] text-muted-foreground">
                                Start a conversation...
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} />
                            ))
                        )}
                        {isLoading && <LoadingBubble />}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>
            </div>
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
    );
}
