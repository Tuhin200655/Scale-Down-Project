import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Plus, Settings } from 'lucide-react';

// Mock types for now
interface Conversation {
    id: string;
    title: string;
}

interface SidebarProps {
    conversations?: Conversation[];
    current?: string;
    onCreate?: () => void;
    onSwitch?: (id: string) => void;
}

export default function Sidebar({
    conversations = [],
    current,
    onCreate,
    onSwitch,
}: SidebarProps) {
    return (
        <div className="hidden h-full w-[250px] flex-col border-r bg-muted/20 md:flex">
            <div className="p-4">
                <Button
                    onClick={onCreate}
                    className="w-full justify-start gap-2"
                    variant="outline"
                >
                    <Plus className="h-4 w-4" />
                    New Chat
                </Button>
            </div>
            <ScrollArea className="flex-1 px-4">
                <div className="flex flex-col gap-2">
                    {conversations.map((chat) => (
                        <Button
                            key={chat.id}
                            variant={current === chat.id ? 'secondary' : 'ghost'}
                            className="justify-start gap-2"
                            onClick={() => onSwitch?.(chat.id)}
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span className="truncate">{chat.title}</span>
                        </Button>
                    ))}
                    {conversations.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground py-4">
                            No conversations yet
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="p-4 border-t">
                <Button variant="ghost" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                </Button>
            </div>
        </div>
    );
}
