import { Message } from '@/lib/types/chat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot } from 'lucide-react';

interface ChatMessageProps {
    message: Message;
    user?: any;
}

export function ChatMessage({ message, user }: ChatMessageProps) {
    const isUser = message.role === 'user';

    const userAvatarUrl = user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'user'}`;
    const userInitial = user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U';

    return (
        <div
            className={cn(
                'flex w-full items-start gap-4 p-4',
                isUser ? 'flex-row-reverse' : 'flex-row'
            )}
        >
            {isUser ? (
                <Avatar className="w-10 h-10 shrink-0 border border-white/20 shadow-sm">
                    <AvatarImage src={userAvatarUrl} referrerPolicy="no-referrer" />
                    <AvatarFallback className="bg-white/50">{userInitial}</AvatarFallback>
                </Avatar>
            ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-linear-to-tr from-indigo-500 to-violet-500 shadow-md shrink-0 border border-white/10">
                    <Bot className="w-6 h-6 text-white" />
                </div>
            )}
            <div
                className={cn(
                    'flex flex-col gap-2 rounded-2xl p-4 max-w-[85%]',
                    isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                )}
            >
                {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                ) : (
                    <div className="prose dark:prose-invert max-w-none text-sm break-words">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({ node, ...props }) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 last:mb-0 space-y-1.5" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 last:mb-0 space-y-1.5" {...props} />,
                                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0 tracking-tight" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mb-3 mt-4 first:mt-0 tracking-tight" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-base font-semibold mb-2 mt-3 first:mt-0" {...props} />,
                                h4: ({ node, ...props }) => <h4 className="text-sm font-semibold mb-2 mt-3 first:mt-0" {...props} />,
                                a: ({ node, ...props }) => <a className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors font-medium" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                                code: ({ node, inline, className, children, ...props }: any) => {
                                    return inline ? (
                                        <code className="bg-background/80 text-foreground rounded-md px-1.5 py-0.5 text-xs font-mono border border-border/50" {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <div className="relative my-4 rounded-lg bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 overflow-hidden">
                                            <div className="flex items-center px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
                                                <div className="flex gap-1.5">
                                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                                </div>
                                            </div>
                                            <div className="p-4 overflow-x-auto text-xs font-mono text-zinc-100">
                                                <code {...props}>{children}</code>
                                            </div>
                                        </div>
                                    )
                                },
                                blockquote: ({ node, ...props }) => (
                                    <blockquote className="border-l-4 border-primary/40 pl-4 py-1 italic text-muted-foreground mb-3 last:mb-0" {...props} />
                                ),
                                table: ({ node, ...props }) => (
                                    <div className="w-full overflow-x-auto mb-4 border rounded-lg">
                                        <table className="w-full text-sm text-left border-collapse" {...props} />
                                    </div>
                                ),
                                thead: ({ node, ...props }) => <thead className="bg-muted text-foreground font-semibold" {...props} />,
                                th: ({ node, ...props }) => <th className="px-4 py-2 border-b" {...props} />,
                                td: ({ node, ...props }) => <td className="px-4 py-2 border-b last:border-0" {...props} />,
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                )}
                <span className={cn(
                    "text-xs opacity-50 mt-1 flex",
                    isUser ? "justify-end" : "justify-start"
                )}>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
}
