"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export function MobileSidebar({ user }: { user?: any }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r-0 w-[260px] bg-transparent">
                <VisuallyHidden.Root>
                    <SheetTitle>Chat Sidebar</SheetTitle>
                    <SheetDescription>Navigation for chats</SheetDescription>
                </VisuallyHidden.Root>
                {/* 
                  We force it to display on mobile by overriding the hidden class from Sidebar.
                  However, Sidebar has `hidden md:flex`. We might need to adjust Sidebar 
                  or wrap it specifically. Let's pass a prop or just wrap it. 
                  Actually, since Sidebar has `hidden md:flex`, it won't show in the Sheet 
                  unless we override it or remove that class from Sidebar and handle hiding 
                  in the parent layout instead. Let's adjust Sidebar directly to accept a className.
                */}
                <div className="h-full w-full [&>div]:flex [&>div]:flex-col! [&>div]:h-full">
                    <Sidebar user={user} isMobile={true} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
