"use client";

import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, LogIn } from 'lucide-react';
import { useState } from 'react';

export function LoginCard() {
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    const handleLogin = async () => {
        setIsLoading(true);
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="flex items-center justify-center h-full w-full">
            <Card className="w-full max-w-md bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-white/20 dark:border-zinc-800/50 shadow-2xl">
                <CardHeader className="text-center space-y-2 pb-6">
                    <div className="w-16 h-16 bg-linear-to-tr from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Bot className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-violet-500">
                        Welcome to Gadget Bot
                    </CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400">
                        Sign In to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg hover:shadow-indigo-500/25 transition-all"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <LogIn className="w-4 h-4 mr-2" />
                                Continue with Google
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
