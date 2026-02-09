export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ConversationState {
  messages: Message[];
  messageCount: number;
  isLimitReached: boolean;
}

export interface ElvexTextGenerateRequest {
  messages: { role: string; content: string }[];
}

export interface ElvexTextGenerateResponse {
  response: string;
}

export interface ChatApiRequest {
  messages: Message[];
}

export interface ChatApiResponse {
  response: string;
  error?: string;
}
