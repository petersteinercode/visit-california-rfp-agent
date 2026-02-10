'use client';

import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '@/types';
import { useConversation } from '../context/ConversationContext';

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 justify-start">
      <div className="max-w-[80%]">
        <div className="flex items-center gap-1.5 py-2" role="status" aria-label="Assistant is typing">
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex items-start justify-end">
        <div className="max-w-[85%] bg-grey-line text-white rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-start">
      <div className="max-w-[90%] prose-chat text-white">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="max-w-md">
        <p className="font-aeonik-fono text-gray-400" style={{ fontSize: '20px', lineHeight: '28px' }}>
          Ask a question about the Visit California RFP to get started.
        </p>
      </div>
    </div>
  );
}

export default function MessageList() {
  const { state } = useConversation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or loading state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages, state.isLoading]);

  if (state.messages.length === 0 && !state.isLoading) {
    return (
      <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col">
        <EmptyState />
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-5 py-6 space-y-5"
      role="log"
      aria-label="Conversation messages"
      aria-live="polite"
    >
      {state.messages.map((message, index) => (
        <MessageBubble key={`${message.timestamp}-${index}`} message={message} />
      ))}
      {state.isLoading && <TypingIndicator />}
    </div>
  );
}
