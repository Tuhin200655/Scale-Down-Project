import { NextRequest, NextResponse } from 'next/server';
import { openai, GEMINI_MODEL } from '@/lib/api/openai';

export async function POST(req: NextRequest) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Server misconfigured', details: 'GEMINI_API_KEY is missing' },
                { status: 500 }
            );
        }

        const { message } = await req.json();

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        const completion = await openai.chat.completions.create({
            model: GEMINI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant for gadget information.',
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
        });

        const responseContent = completion.choices[0].message.content;

        return NextResponse.json({ response: responseContent });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
