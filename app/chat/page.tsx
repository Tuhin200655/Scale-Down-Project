import ChatWindow from '@/components/chat/ChatWindow';
import Sidebar from '@/components/chat/Sidebar';
import { MobileSidebar } from '@/components/chat/MobileSidebar';
import { createClient } from '@/lib/supabase/server';
import { LoginCard } from '@/components/auth/LoginCard';

export const dynamic = 'force-dynamic';

export default async function ChatPage() {
    let user = null;
    let envError = false;

    try {
        const supabase = await createClient();
        const { data } = await supabase.auth.getUser();
        user = data.user;
    } catch (e) {
        console.error('Supabase connection failed (likely missing env vars on Vercel):', e);
        envError = true;
    }

    if (envError) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-950 text-white p-4 text-center">
                <div className="max-w-md space-y-4">
                    <h1 className="text-2xl font-bold text-red-500">Deployment Error</h1>
                    <p className="text-zinc-400">
                        The application is missing required environment variables to connect to Supabase.
                    </p>
                    <p className="text-zinc-400 text-sm bg-zinc-900 p-4 rounded-lg text-left font-mono">
                        Make sure to add the following to your Vercel project settings under Environment Variables:
                        <br /><br />
                        1. NEXT_PUBLIC_SUPABASE_URL<br />
                        2. NEXT_PUBLIC_SUPABASE_ANON_KEY<br />
                        3. GEMINI_API_KEY
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex h-screen w-full overflow-hidden bg-linear-to-br from-[#7a00cc] via-[#3300b3] to-[#000080]">
            {/* Animated Premium Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">

                {/* 2D Mesh/Dots overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIiBmaWxsPSJyZ2JhKDEyOCwgMTI4LCAxMjgsIDAuMSkiLz4KPC9zdmc+')] mask-[linear-gradient(to_bottom,white,transparent)] opacity-40 dark:opacity-20" />

                {/* Floating 2D Elements */}
                <div className="absolute top-[15%] left-[5%] w-64 h-64 bg-violet-400/20 dark:bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

                <div className="absolute top-[25%] left-[20%] rotate-12 opacity-50 dark:opacity-30 blur-[1px]">
                    <div className="px-3 py-1 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-indigo-500/20 dark:border-indigo-400/20 rounded-full text-xs font-medium text-indigo-600 dark:text-indigo-400 shadow-xl">✨ AI Powered</div>
                </div>
                <div className="absolute top-[10%] right-[25%] -rotate-6 opacity-40 dark:opacity-20 blur-[1px]">
                    <div className="px-3 py-1 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-violet-500/20 dark:border-violet-400/20 rounded-full text-xs font-medium text-violet-600 dark:text-violet-400 shadow-xl">🚀 Lightning Fast</div>
                </div>
                <div className="absolute bottom-[15%] left-[30%] rotate-3 opacity-30 dark:opacity-10 blur-[2px]">
                    <div className="w-16 h-16 bg-linear-to-tr from-indigo-500/40 to-violet-500/40 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl transform rotate-12" />
                </div>
            </div>

            {/* Content Container with Glassmorphism */}
            <div className="relative z-10 flex h-full w-full">
                {!user ? (
                    <div className="flex w-full items-center justify-center p-4">
                        <LoginCard />
                    </div>
                ) : (
                    <>
                        <Sidebar user={user} />
                        <main className="flex-1 flex flex-col h-full bg-background/40 backdrop-blur-xl border-l shadow-2xl relative">
                            {/* Mobile Header */}
                            <div className="md:hidden flex items-center justify-between p-3 border-b border-white/10 bg-[#2e1065]/80 backdrop-blur-md z-40 shrink-0">
                                <div className="flex items-center gap-2">
                                    <MobileSidebar user={user} />
                                    <span className="font-bold text-white tracking-tight">Gadget Bot</span>
                                </div>
                            </div>

                            <div className="flex-1 p-0 md:p-6 overflow-hidden relative">
                                <ChatWindow user={user} />
                            </div>
                        </main>
                    </>
                )}
            </div>
        </div>
    );
}
