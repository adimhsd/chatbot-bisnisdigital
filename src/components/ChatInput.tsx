'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isComposing) return;

    const message = input.trim();
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await onSendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, unless Shift+Enter is pressed (for new line)
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        120
      ) + 'px';
    }
  }, [input]);

  return (
    <div className="border-t border-gray-200 dark:border-slate-800 pt-4">
      <div className="relative flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="Tanyakan sesuatu tentang Prodi Bisnis Digital..."
          disabled={isLoading}
          rows={1}
          className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 resize-none max-h-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <i className="fas fa-spinner animate-spin"></i>
          ) : (
            <i className="fas fa-paper-plane"></i>
          )}
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Powered by Google Gemini & Firestore Knowledge Base
      </p>
    </div>
  );
}
