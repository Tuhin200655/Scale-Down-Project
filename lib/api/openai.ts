import OpenAI from 'openai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn('Missing GEMINI_API_KEY environment variable');
}

// Initialize OpenAI client with Gemini base URL
export const openai = new OpenAI({
    apiKey: apiKey || 'dummy-key',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
});

export const GEMINI_MODEL = 'gemini-2.5-flash';
