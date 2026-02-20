import { Bot } from 'lucide-react';

export function LoadingBubble() {
    return (
        <div className="flex w-full items-start gap-4 p-4 flex-row">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-linear-to-tr from-indigo-500 to-violet-500 shadow-md shrink-0 border border-white/10">
                <Bot className="w-6 h-6 text-white" />
            </div>
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
