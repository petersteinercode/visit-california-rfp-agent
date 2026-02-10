'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useConversation } from '../context/ConversationContext';

export default function MessageInput() {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { state, sendMessage } = useConversation();

  const isDisabled = state.isLimitReached || state.isLoading;
  const canSend = inputValue.trim().length > 0 && !isDisabled;

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!canSend) return;

      const message = inputValue.trim();
      setInputValue('');

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      await sendMessage(message);
    },
    [canSend, inputValue, sendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, []);

  if (state.isLimitReached) {
    return (
      <div className="px-4 py-4 border-t border-grey-line">
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl px-4 py-3 text-center">
          <p className="text-amber-300 text-sm">
            You&apos;ve reached the conversation limit. Please reset to start a new
            conversation or contact Code and Theory for further assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 border-t border-grey-line">
      {state.error && (
        <div className="mb-3 bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3">
          <p className="text-red-300 text-sm">{state.error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            disabled={isDisabled}
            rows={1}
            className="w-full resize-none rounded-xl border border-grey-line bg-dark-grey px-4 py-3 text-sm md:text-base text-white placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Message input"
          />
        </div>
        <button
          type="submit"
          disabled={!canSend}
          className="flex-shrink-0 w-11 h-11 rounded-full bg-brand-orange text-white flex items-center justify-center hover:bg-brand-orange/90 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-dark-grey disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand-orange transition-colors"
          aria-label="Send message"
        >
          {state.isLoading ? (
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-5 5m5-5l5 5" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
