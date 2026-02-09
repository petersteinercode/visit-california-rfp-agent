'use client';

import React, { useState } from 'react';
import { useConversation } from '../context/ConversationContext';

export default function ResetButton() {
  const { resetConversation, state } = useConversation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    if (state.messages.length === 0) return;

    if (showConfirm) {
      resetConversation();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      // Auto-dismiss confirmation after 3 seconds
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  if (state.messages.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {showConfirm ? (
        <>
          <button
            onClick={handleReset}
            className="text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Confirm reset conversation"
          >
            Confirm Reset
          </button>
          <button
            onClick={handleCancel}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label="Cancel reset"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={handleReset}
          className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 flex items-center gap-1.5"
          aria-label="Reset conversation"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
            />
          </svg>
          New Chat
        </button>
      )}
    </div>
  );
}
