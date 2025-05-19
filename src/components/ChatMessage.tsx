
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn("message", isUser ? "user-message" : "ai-message")}>
      <div className="font-semibold mb-1">
        {isUser ? 'You' : 'AI Assistant'}
      </div>
      <div className="whitespace-pre-wrap">
        {message.content}
      </div>
    </div>
  );
};
