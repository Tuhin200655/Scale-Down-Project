import { Message } from '@/lib/types/chat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatMessageProps {
    message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <div
            className={cn(
                'flex w-full items-start gap-4 p-4',
                isUser ? 'flex-row-reverse' : 'flex-row'
            )}
        >
            <Avatar>
                <AvatarFallback>{isUser ? 'U' : 'AI'}</AvatarFallback>
                <AvatarImage src={isUser ? '/user-avatar.png' : '/bot-avatar.png'} />
            </Avatar>
            <div
                className={cn(
                    'flex flex-col gap-2 rounded-lg p-4 max-w-[80%]',
                    isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                )}
            >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-50">
                    {new Date(message.createdAt).toLocaleTimeString()}
                </span>
            </div>
        </div>
    );
}
