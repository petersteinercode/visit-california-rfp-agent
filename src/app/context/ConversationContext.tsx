'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { Message, ConversationState } from '@/types';

const MAX_MESSAGES = 20;
const SESSION_STORAGE_KEY = 'visit-california-rfp-conversation';

// --- Actions ---

type ConversationAction =
  | { type: 'ADD_USER_MESSAGE'; payload: { content: string } }
  | { type: 'ADD_ASSISTANT_MESSAGE'; payload: { content: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_CONVERSATION' }
  | { type: 'RESTORE_STATE'; payload: ConversationFullState };

interface ConversationFullState extends ConversationState {
  isLoading: boolean;
  error: string | null;
}

const initialState: ConversationFullState = {
  messages: [],
  messageCount: 0,
  isLimitReached: false,
  isLoading: false,
  error: null,
};

// --- Reducer ---

function conversationReducer(
  state: ConversationFullState,
  action: ConversationAction
): ConversationFullState {
  switch (action.type) {
    case 'ADD_USER_MESSAGE': {
      const newMessage: Message = {
        role: 'user',
        content: action.payload.content,
        timestamp: Date.now(),
      };
      const newCount = state.messageCount + 1;
      return {
        ...state,
        messages: [...state.messages, newMessage],
        messageCount: newCount,
        isLimitReached: newCount >= MAX_MESSAGES,
        error: null,
      };
    }
    case 'ADD_ASSISTANT_MESSAGE': {
      const newMessage: Message = {
        role: 'assistant',
        content: action.payload.content,
        timestamp: Date.now(),
      };
      return {
        ...state,
        messages: [...state.messages, newMessage],
        isLoading: false,
      };
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'RESET_CONVERSATION':
      return { ...initialState };
    case 'RESTORE_STATE':
      return { ...action.payload };
    default:
      return state;
  }
}

// --- Context ---

interface ConversationContextType {
  state: ConversationFullState;
  sendMessage: (content: string) => Promise<void>;
  resetConversation: () => void;
  maxMessages: number;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

// --- Provider ---

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(conversationReducer, initialState);
  const isHydrated = useRef(false);

  // Restore state from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ConversationFullState;
        // Don't restore loading or error states
        dispatch({
          type: 'RESTORE_STATE',
          payload: { ...parsed, isLoading: false, error: null },
        });
      }
    } catch {
      // Ignore sessionStorage errors (e.g., in private browsing)
    }
    isHydrated.current = true;
  }, []);

  // Persist state to sessionStorage on changes
  useEffect(() => {
    if (!isHydrated.current) return;
    try {
      const toStore: ConversationFullState = {
        ...state,
        isLoading: false,
        error: null,
      };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(toStore));
    } catch {
      // Ignore sessionStorage errors
    }
  }, [state]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (state.isLimitReached || state.isLoading) return;

      const trimmed = content.trim();
      if (!trimmed) return;

      // Add user message
      dispatch({ type: 'ADD_USER_MESSAGE', payload: { content: trimmed } });
      dispatch({ type: 'SET_LOADING', payload: true });

      // Build updated messages array including the new user message
      const updatedMessages: Message[] = [
        ...state.messages,
        { role: 'user' as const, content: trimmed, timestamp: Date.now() },
      ];

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(
            data.error || `Request failed with status ${response.status}`
          );
        }

        const data = await response.json();
        dispatch({ type: 'ADD_ASSISTANT_MESSAGE', payload: { content: data.response } });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred. Please try again.';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
    },
    [state.messages, state.isLimitReached, state.isLoading]
  );

  const resetConversation = useCallback(() => {
    dispatch({ type: 'RESET_CONVERSATION' });
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return (
    <ConversationContext.Provider
      value={{ state, sendMessage, resetConversation, maxMessages: MAX_MESSAGES }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
}
