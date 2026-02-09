import { NextRequest, NextResponse } from 'next/server';
import { generateTextResponse } from '@/lib/elvex';
import { Message } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body as { messages: Message[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      );
    }

    // Validate message format
    for (const msg of messages) {
      if (!msg.role || !msg.content || !['user', 'assistant'].includes(msg.role)) {
        return NextResponse.json(
          { error: 'Invalid message format: each message must have a valid role and content' },
          { status: 400 }
        );
      }
    }

    // Count user messages to enforce rate limit server-side
    const userMessageCount = messages.filter((m) => m.role === 'user').length;
    if (userMessageCount > 20) {
      return NextResponse.json(
        { error: 'Conversation limit reached. Maximum 20 user messages per conversation.' },
        { status: 429 }
      );
    }

    const response = await generateTextResponse(messages);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof Error) {
      // Handle timeout errors
      if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'The request timed out. Please try again.' },
          { status: 504 }
        );
      }

      // Handle network errors
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return NextResponse.json(
          { error: 'Unable to reach the AI service. Please check your connection and try again.' },
          { status: 502 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
