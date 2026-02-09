# Visit California RFP Agent

A chat interface that connects to the Elvex API for RFP-related conversations, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Chat Interface**: Clean, modern chat UI with message display and input
- **Conversation History**: Full message history maintained in session (client-side)
- **Message Limit**: 20 user messages per conversation with visible counter
- **Reset Functionality**: Manual conversation reset with confirmation
- **Session Persistence**: Conversation survives page refresh via sessionStorage
- **Responsive Design**: Mobile and desktop responsive layout
- **Loading States**: Typing indicators and loading spinners
- **Error Handling**: API timeout, network errors, and rate limit notifications

## Architecture

```
/src
  /app
    /api
      /chat/route.ts       - Proxy for Elvex API (keeps credentials secure)
    /components
      ChatInterface.tsx     - Main container
      MessageList.tsx       - Message display with typing indicator
      MessageInput.tsx      - User input with auto-resize
      ResetButton.tsx       - Conversation reset with confirmation
    /context
      ConversationContext.tsx - React Context for state management
    page.tsx                - Root page
    layout.tsx              - Root layout
    globals.css             - Global styles
  /lib
    elvex.ts               - Elvex API client
    types.ts               - Re-exported types
  /types
    index.ts               - Shared TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

| Variable | Description |
|---|---|
| `ELVEX_API_KEY` | Your Elvex API key |
| `ELVEX_ASSISTANT_ID` | The Elvex assistant ID |
| `ELVEX_VERSION` | The Elvex version identifier |

> **Note**: When credentials are set to `placeholder`, the app uses mock responses for development.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Deployment

Designed for deployment on **Vercel**:

1. Push to your repository
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Vercel Environment Variables

- `ELVEX_API_KEY`
- `ELVEX_ASSISTANT_ID`
- `ELVEX_VERSION`

## Key Design Decisions

- **No Database**: Conversations are ephemeral by design, stored only in client session
- **API Proxy**: All Elvex API calls go through the Next.js API route to keep credentials secure
- **Full History on Each Request**: Elvex doesn't store messages; the complete conversation array is sent with each API call
- **20-Message Limit**: Enforced both client-side and server-side
- **React Context**: Used for state management (no external dependencies needed)
- **sessionStorage**: Persists conversation across page refreshes within the same tab

## Pending Information

Before production deployment:

1. Elvex `assistant_id` and `version` values
2. Elvex API authentication credentials
3. Visual design references and brand assets
4. Final styling specifications
