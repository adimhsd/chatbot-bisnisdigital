import { streamText } from 'ai';
import { groq } from '@/lib/groq';
import { retrieveRelevantDocuments, buildRAGContext } from '@/lib/rag';
import { SYSTEM_PROMPT } from '@/utils/constants';

export const runtime = 'nodejs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: Message[] };

    if (!messages || messages.length === 0) {
      return new Response('No messages provided', { status: 400 });
    }

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role !== 'user') {
      return new Response('Last message must be from user', { status: 400 });
    }

    const userQuery = lastUserMessage.content;

    // Retrieve relevant documents from Firestore
    let ragContext = '';
    try {
      const relevantDocs = await retrieveRelevantDocuments(userQuery, 5);
      ragContext = buildRAGContext(relevantDocs);
    } catch (error) {
      console.warn('Failed to retrieve RAG context:', error);
      ragContext = 'Tidak ada dokumen konteks yang tersedia saat ini.';
    }

    // Build the prompt with RAG context
    const systemPromptWithContext = `${SYSTEM_PROMPT}

KONTEKS DOKUMEN YANG RELEVAN:
${ragContext}`;

    // Use streamText with Groq (Llama 3)
    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPromptWithContext,
      messages: messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      temperature: 0.7,
    });

    // Return the stream as response
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
