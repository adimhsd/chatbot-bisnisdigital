import { createOpenAI } from '@ai-sdk/openai';

// Create a custom provider instance for Groq
// Groq is compatible with the OpenAI SDK
export const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
});

// Default model to use
export const defaultModel = 'llama-3.1-8b-instant';
// Alternative robust model
// export const defaultModel = 'llama-3.3-70b-versatile';
