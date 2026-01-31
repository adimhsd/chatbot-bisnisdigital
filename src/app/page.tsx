'use client';

import { useState, useCallback } from 'react';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import Navbar from '@/components/Navbar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      // Create user message ID
      const msgId = Date.now().toString();
      const userMsgId = 'msg-'.concat(msgId);
      const newUserMessage: Message = {
        id: userMsgId,
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setIsLoading(true);

      try {
        // Send to API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              { role: 'user', content: userMessage },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const responseText = await response.text();
        let assistantContent = '';

        try {
          const parsed = JSON.parse(responseText);
          assistantContent = parsed.content || responseText;
        } catch {
          assistantContent = responseText;
        }

        const assistantMsgId = 'msg-'.concat((Date.now() + 1).toString());
        const assistantMessage: Message = {
          id: assistantMsgId,
          role: 'assistant',
          content: assistantContent,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMsgId = 'msg-'.concat((Date.now() + 2).toString());
        const errorMessage: Message = {
          id: errorMsgId,
          role: 'assistant',
          content:
            'Maaf, terjadi kesalahan dalam memproses pertanyaan Anda. Silakan coba lagi.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-slate-900">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col overflow-hidden">
        <ChatWindow messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}
