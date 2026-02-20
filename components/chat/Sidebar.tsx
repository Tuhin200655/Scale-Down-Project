"use client";

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogOut, MessageSquare, Plus, Pencil, Check, X, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';

export default function Sidebar({ user, isMobile = false }: { user?: any, isMobile?: boolean }) {
    const router = useRouter();
    const supabase = createClient();
    const { chats, setChats, activeChatId, setActiveChatId, updateChatTitle, deleteChat } = useChatStore();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [chatToDelete, setChatToDelete] = useState<{ id: string; title: string } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const confirmDelete = async () => {
        if (!chatToDelete) return;
        const id = chatToDelete.id;
        deleteChat(id);
        setChatToDelete(null);

        try {
            const response = await fetch(`/api/chat?chatId=${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete chat');
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };

    useEffect(() => {
        let mounted = true;
        const fetchChats = async () => {
            const { data, error } = await supabase
                .from('chats')
                .select('id, title')
                .order('created_at', { ascending: false });

            if (data && !error && mounted) {
                setChats(data);
                // Optionally set active chat to the first one if none is selected
                if (data.length > 0 && !activeChatId) {
                    setActiveChatId(data[0].id);
                }
            }
        };

        fetchChats();
        return () => { mounted = false; };
    }, [supabase, setChats]); // INTENTIONAL: We don't want to re-run this if activeChatId changes.

    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingId]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    const startEditing = (e: React.MouseEvent, id: string, currentTitle: string) => {
        e.stopPropagation();
        setEditingId(id);
        setEditTitle(currentTitle);
    };

    const saveEdit = async (e?: React.MouseEvent | React.FocusEvent | React.KeyboardEvent) => {
        if (e) e.stopPropagation();
        if (!editingId || !editTitle.trim()) {
            setEditingId(null);
            return;
        }

        const idToUpdate = editingId;
        const newTitle = editTitle.trim();

        // Optimistic update
        updateChatTitle(idToUpdate, newTitle);
        setEditingId(null);

        try {
            const response = await fetch('/api/chat', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatId: idToUpdate, title: newTitle }),
            });

            if (!response.ok) {
                throw new Error('Failed to update title');
            }
        } catch (error) {
            console.error('Error updating chat title:', error);
            // Optionally revert on failure by re-fetching or storing previous title
        }
    };

    const cancelEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(null);
    };

    return (
        <div className={`h-full flex-col border-r border-white/10 bg-[#2e1065] text-white ${isMobile ? 'flex w-full' : 'hidden md:flex w-[260px]'}`}>
            <div className={`p-4 ${isMobile ? 'pr-16' : ''}`}>
                <Button
                    onClick={() => setActiveChatId(null)}
                    className="w-full justify-start gap-2 bg-black/40 hover:bg-black/60 text-white border-none rounded-2xl h-12 transition-all shadow-none"
                    variant="default"
                >
                    <Plus className="h-4 w-4" />
                    New Chat
                </Button>
            </div>
            <ScrollArea className="flex-1 px-4">
                <div className="flex flex-col gap-2 mt-2">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className={`group flex items-center gap-2 rounded-2xl transition-all pr-2 ${activeChatId === chat.id ? 'bg-black/30' : 'hover:bg-black/20'}`}
                        >
                            <Button
                                variant="ghost"
                                className="flex-1 justify-start gap-3 h-12 px-4 hover:bg-transparent text-white/90 overflow-hidden"
                                onClick={() => setActiveChatId(chat.id)}
                            >
                                <MessageSquare className="h-4 w-4 opacity-70 shrink-0" />
                                {editingId === chat.id ? (
                                    <input
                                        ref={inputRef}
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') saveEdit(e);
                                            if (e.key === 'Escape') setEditingId(null);
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        onBlur={(e) => saveEdit(e)}
                                        className="flex-1 bg-transparent border-none focus:outline-hidden text-sm w-full truncate text-white min-w-0"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="truncate block text-left font-medium text-sm w-full min-w-0">{chat.title}</span>
                                )}
                            </Button>

                            {/* Action Buttons */}
                            {editingId === chat.id ? (
                                <div className="flex items-center gap-1 shrink-0">
                                    <button onClick={saveEdit} className="p-1 hover:text-green-500 transition-colors z-10">
                                        <Check className="h-3.5 w-3.5" />
                                    </button>
                                    <button onMouseDown={cancelEdit} className="p-1 hover:text-red-500 transition-colors z-10">
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <div className={`flex items-center gap-1 shrink-0 transition-opacity ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <button
                                        onClick={(e) => startEditing(e, chat.id, chat.title)}
                                        className="p-1.5 text-white/50 hover:text-white transition-colors z-10 rounded-md hover:bg-white/10"
                                        title="Rename chat"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setChatToDelete({ id: chat.id, title: chat.title }); }}
                                        className="p-1.5 text-white/50 hover:text-red-400 transition-colors z-10 rounded-md hover:bg-white/10"
                                        title="Delete chat"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {chats.length === 0 && (
                        <div className="text-center text-sm text-foreground/50 py-8 font-medium">
                            No conversations yet
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="p-4 border-t border-white/20 dark:border-white/10 flex flex-col gap-3 bg-linear-to-br from-[#1e004a] via-[#2a0b5c] to-[#11002b] shadow-[inset_0_2px_15px_rgba(0,0,0,0.2)]">
                {user && (
                    <div className="flex items-center gap-3 px-2 py-1 mb-1">
                        <img
                            src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                            alt={user.user_metadata?.full_name || 'User'}
                            className="w-10 h-10 rounded-full border border-white/20 shadow-sm bg-white/50 object-cover"
                            referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col text-sm overflow-hidden">
                            <span className="font-semibold truncate text-white">
                                {user.user_metadata?.full_name || 'User'}
                            </span>
                            <span className="text-xs truncate text-white/70">
                                {user.email}
                            </span>
                        </div>
                    </div>
                )}
                <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 dark:hover:bg-red-500/10 rounded-xl transition-all"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Sign Out</span>
                </Button>
            </div>

            {/* Delete Confirmation Modal */}
            {chatToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-zinc-950 border border-white/10 p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-white">Delete Chat?</h3>
                        <p className="text-white/70 text-sm">
                            Are you sure you want to delete <span className="font-semibold text-white">"{chatToDelete.title}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3 mt-4">
                            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setChatToDelete(null)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
