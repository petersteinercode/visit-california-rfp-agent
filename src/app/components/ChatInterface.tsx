'use client';

import React from 'react';
import { useConversation } from '../context/ConversationContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ResetButton from './ResetButton';

function MessageCounter() {
  const { state, maxMessages } = useConversation();

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`text-xs font-medium tabular-nums ${
          state.isLimitReached
            ? 'text-red-600'
            : state.messageCount >= maxMessages - 5
            ? 'text-amber-600'
            : 'text-gray-400'
        }`}
        aria-label={`${state.messageCount} of ${maxMessages} messages used`}
      >
        {state.messageCount}/{maxMessages}
      </span>
    </div>
  );
}

export default function ChatInterface() {
  return (
    <div className="flex flex-col h-screen max-h-screen bg-white">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3 md:px-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-sm md:text-base font-semibold text-gray-900 leading-tight">
                Visit California RFP
              </h1>
              <p className="text-xs text-gray-500 hidden md:block">
                AI-Powered RFP Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MessageCounter />
            <ResetButton />
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-hidden max-w-4xl mx-auto w-full flex flex-col">
        <MessageList />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 max-w-4xl mx-auto w-full">
        <MessageInput />
      </div>
    </div>
  );
}
