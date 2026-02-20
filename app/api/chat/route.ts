import { NextRequest, NextResponse } from 'next/server';
import { openai, GEMINI_MODEL } from '@/lib/api/openai';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Server misconfigured', details: 'GEMINI_API_KEY is missing' },
                { status: 500 }
            );
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message, chatId: clientChatId } = await req.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        let currentChatId = clientChatId;
        let currentChatTitle = undefined;

        // If no chatId is provided, create a new chat session
        if (!currentChatId) {
            const { count } = await supabase
                .from('chats')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            const chatNumber = (count || 0) + 1;
            const newTitle = `Response ${chatNumber}`;

            const { data: newChat, error: chatError } = await supabase
                .from('chats')
                .insert({ user_id: user.id, title: newTitle })
                .select('id, title')
                .single();

            if (chatError) throw chatError;
            currentChatId = newChat.id;
            currentChatTitle = newChat.title;
        }

        const currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // 1. Save user message to database
        await supabase.from('messages').insert({
            user_id: user.id,
            chat_id: currentChatId,
            role: 'user',
            content: message,
        });

        // 2. Fetch recent conversation history for context (last 10 messages)
        const { data: history } = await supabase
            .from('messages')
            .select('role, content')
            .eq('chat_id', currentChatId)
            .order('created_at', { ascending: false })
            .limit(10);

        // Reverse to get chronological order for the LLM
        const formattedHistory = (history || []).reverse().map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
        })) as { role: 'user' | 'assistant', content: string }[];

        // 3. Get AI Completion
        const completion = await openai.chat.completions.create({
            model: GEMINI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful assistant for gadget information.\n\nSystem Note: Today is ${currentDate}. Do not state this date in your response unless it is strictly necessary to answer the user's specific question (e.g., if they ask about recent releases or today's date).`,
                },
                ...formattedHistory, // Pass history into context
                {
                    role: 'user',
                    content: message,
                },
            ],
        });

        const responseContent = completion.choices[0].message.content || 'Sorry, I could not generate a response.';

        // 4. Save AI response to database
        const { data: insertedMsg } = await supabase.from('messages').insert({
            user_id: user.id,
            chat_id: currentChatId,
            role: 'assistant',
            content: responseContent,
        }).select('id').single();

        return NextResponse.json({
            response: responseContent,
            responseId: insertedMsg?.id,
            chatId: currentChatId,
            chatTitle: currentChatTitle
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { chatId, title } = await req.json();

        if (!chatId || !title) {
            return NextResponse.json({ error: 'Missing chatId or title' }, { status: 400 });
        }

        const { error } = await supabase
            .from('chats')
            .update({ title })
            .eq('id', chatId)
            .eq('user_id', user.id); // Ensure user owns the chat

        if (error) {
            console.error('Update Chat Error:', error);
            return NextResponse.json({ error: 'Failed to rename chat' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // We can pass chatId as a query param instead of body since DELETE body is sometimes stripped by proxies
        const { searchParams } = new URL(req.url);
        const chatId = searchParams.get('chatId');

        if (!chatId) {
            return NextResponse.json({ error: 'Missing chatId' }, { status: 400 });
        }

        const { error } = await supabase
            .from('chats')
            .delete()
            .eq('id', chatId)
            .eq('user_id', user.id);

        if (error) {
            console.error('Delete Chat Error:', error);
            return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
