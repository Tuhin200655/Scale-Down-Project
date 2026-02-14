import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function LoadingBubble() {
    return (
        <div className="flex w-full items-start gap-4 p-4 flex-row">
            <Avatar>
                <AvatarFallback>AI</AvatarFallback>
                <AvatarImage src="/bot-avatar.png" />
            </Avatar>
            <div className="flex flex-col gap-2 rounded-lg p-4 max-w-[80%] bg-muted text-muted-foreground">
                <div className="flex items-center gap-1 h-6">
                    <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-current rounded-full animate-bounce"></span>
                </div>
            </div>
        </div>
    );
}
