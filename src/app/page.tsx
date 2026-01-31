import { useChat } from 'ai/react';
import { Message } from 'ai';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { messages, input, handleInputChange, append, isLoading } = useChat({
    api: '/api/chat',
  });

  const handleSendMessage = async (userMessage: string) => {
    await append({
      role: 'user',
      content: userMessage,
    });
  };

  // Map ai/react messages to the format expected by ChatWindow
  // useChat messages have 'createdAt', ChatWindow expects 'timestamp'
  const uiMessages = messages.map((m: Message) => ({
    id: m.id,
    role: m.role as 'user' | 'assistant',
    content: m.content,
    timestamp: m.createdAt || new Date(),
  }));

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-slate-900">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col overflow-hidden">
        <ChatWindow messages={uiMessages} />
        {/* ChatInput expects onSendMessage but we can just pass a wrapper around append. 
            Ideally ChatInput should use handleInputChange too but we can keep its internal state for now 
            to minimize changes. */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}
