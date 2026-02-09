import { ConversationProvider } from './context/ConversationContext';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  return (
    <ConversationProvider>
      <ChatInterface />
    </ConversationProvider>
  );
}
