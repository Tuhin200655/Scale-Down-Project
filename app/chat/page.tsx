import ChatWindow from '@/components/chat/ChatWindow';
import Sidebar from '@/components/chat/Sidebar';

export default function ChatPage() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full">
                <div className="flex-1 p-4 md:p-6 overflow-hidden">
                    <ChatWindow />
                </div>
            </main>
        </div>
    );
}
