import { Message } from '@/types';

const ELVEX_API_KEY = process.env.ELVEX_API_KEY || 'placeholder';
const ELVEX_ASSISTANT_ID = process.env.ELVEX_ASSISTANT_ID || 'placeholder';
const ELVEX_VERSION = process.env.ELVEX_VERSION || 'placeholder';

const ELVEX_BASE_URL = 'https://api.elvex.ai';

/**
 * Check if we're using placeholder credentials (development mode).
 */
function isUsingPlaceholders(): boolean {
  return (
    ELVEX_API_KEY === 'placeholder' ||
    ELVEX_ASSISTANT_ID === 'placeholder' ||
    ELVEX_VERSION === 'placeholder'
  );
}

/**
 * Generate a mock response for development when credentials aren't configured.
 */
function getMockResponse(messages: Message[]): string {
  const lastMessage = messages[messages.length - 1];
  const responses = [
    "Thank you for your question about the Visit California RFP. I'd be happy to help you with that.",
    "That's a great point. Let me provide some additional context about our capabilities for this project.",
    "Based on our experience with similar tourism campaigns, here's what I'd recommend for the Visit California initiative.",
    "I understand your requirements. Let me outline how we can address each of those points in our proposal.",
    "Great question! Our approach to this RFP focuses on innovative digital strategies tailored for California tourism.",
  ];
  const index = messages.length % responses.length;

  if (lastMessage?.content.toLowerCase().includes('hello') || lastMessage?.content.toLowerCase().includes('hi')) {
    return "Hello! Welcome to the Visit California RFP Assistant. I'm here to help you with questions about the RFP process, proposal details, and project specifications. How can I assist you today?";
  }

  return responses[index];
}

/**
 * Send messages to the Elvex text generation API and get a response.
 * Falls back to mock responses when credentials are not configured.
 */
export async function generateTextResponse(messages: Message[]): Promise<string> {
  // Use mock responses when placeholder credentials are detected
  if (isUsingPlaceholders()) {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1500));
    return getMockResponse(messages);
  }

  const url = `${ELVEX_BASE_URL}/v0/apps/${ELVEX_ASSISTANT_ID}/versions/${ELVEX_VERSION}/text/generate`;

  // Send the last user message as the prompt
  const lastUserMessage = messages.filter((m) => m.role === 'user').pop();
  const prompt = lastUserMessage?.content || '';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ELVEX_API_KEY}`,
    },
    body: JSON.stringify({ prompt }),
    signal: AbortSignal.timeout(120000), // 120 second timeout
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'No error body');
    throw new Error(
      `Elvex API error: ${response.status} ${response.statusText} - ${errorBody}`
    );
  }

  const data = await response.json();

  // Elvex returns { data: { response, messages, modified_messages, app, referenced_chunks }, meta }
  // The assistant's reply is in data.response (string)
  if (data.data?.response) {
    return data.data.response;
  }

  // Fallback: check for assistant message in data.messages
  if (data.data?.messages && Array.isArray(data.data.messages)) {
    const assistantMessages = data.data.messages.filter(
      (m: { role: string; content: string }) => m.role === 'assistant'
    );
    const lastAssistant = assistantMessages[assistantMessages.length - 1];
    if (lastAssistant?.content) {
      return lastAssistant.content;
    }
  }

  // Other fallbacks
  if (typeof data === 'string') {
    return data;
  }
  if (data.response) {
    return data.response;
  }
  if (data.text) {
    return data.text;
  }

  throw new Error('Unexpected response format from Elvex API');
}
