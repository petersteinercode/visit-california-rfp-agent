'use client';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ConversationProvider } from './context/ConversationContext';
import ChatInterface from './components/ChatInterface';
import LoginScreen from './components/LoginScreen';

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <ConversationProvider>
      <ChatInterface />
    </ConversationProvider>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
