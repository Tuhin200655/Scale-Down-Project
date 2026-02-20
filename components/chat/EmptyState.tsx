"use client";

import { motion } from 'framer-motion';
import { Bot, Sparkles, Zap, Shield } from 'lucide-react';

export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-md w-full flex flex-col items-center"
            >
                {/* 3D Floating Robot Logo */}
                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        rotateX: [0, 5, 0],
                        rotateY: [0, -10, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    whileHover={{ scale: 1.05, rotateZ: 5 }}
                    className="relative mb-8 cursor-pointer group perspective-1000"
                >
                    <div className="absolute inset-0 bg-linear-to-tr from-indigo-500 to-violet-500 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                    <div className="relative w-32 h-32 bg-linear-to-tr from-indigo-500 to-violet-500 rounded-3xl shadow-2xl flex items-center justify-center border-2 border-white/20 overflow-hidden transform-style-3d">
                        {/* Inner reflection */}
                        <div className="absolute inset-0 bg-linear-to-b from-white/30 to-transparent opacity-50" />

                        <Bot className="w-16 h-16 text-white drop-shadow-lg" strokeWidth={1.5} />
                    </div>
                </motion.div>

                {/* Welcome Text */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold mb-3 tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-violet-500">
                        Ready to assist you
                    </h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Hello, I'm Gadget Bot, your AI assistant.
                    </p>
                </motion.div>

                {/* Feature Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-3 w-full"
                >
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 dark:border-white/5 text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Smart Responses</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 dark:border-white/5 text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                        <Zap className="w-4 h-4 text-indigo-500" />
                        <span>Lightning Fast</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 dark:border-white/5 text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span>Private & Secure</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
