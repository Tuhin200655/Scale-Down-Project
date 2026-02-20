import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            onSend(input);
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex w-full items-center gap-2 p-1 md:p-2 border-none bg-black/20 md:bg-transparent rounded-full shadow-inner">
            <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className="flex-1 bg-transparent border-none text-white placeholder:text-white/50 focus-visible:ring-0 shadow-none px-4"
            />
            <Button onClick={handleSend} disabled={disabled || !input.trim()} size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-white shrink-0">
                <Send className="h-4 w-4" />
            </Button>
        </div>
    );
}
