'use client';

import { useRef, useEffect, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatWindow({ messages }: { messages: Message[] }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto space-y-4 pr-4 mb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-robot text-3xl text-blue-600 dark:text-blue-400"></i>
            </div>
            <h2 className="text-xl font-semibold mb-2">Selamat datang!</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm">
              Saya BisDig Buddy, asisten virtual Prodi Bisnis Digital UNIKU.
              Tanyakan apa saja tentang prodi kami!
            </p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-fadeIn ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${
                message.role === 'user'
                  ? 'bg-slate-700 dark:bg-slate-600'
                  : 'bg-blue-600 dark:bg-blue-700'
              }`}
            >
              <i
                className={`fas text-xs ${
                  message.role === 'user' ? 'fa-user' : 'fa-robot'
                }`}
              ></i>
            </div>

            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-tl-none border border-gray-200 dark:border-slate-700'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </p>
              <p
                className={`text-xs mt-2 ${
                  message.role === 'user'
                    ? 'text-blue-100'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
