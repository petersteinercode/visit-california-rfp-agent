'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const APPROVED_DOMAINS = ['codeandtheory.com', 'visitcalifornia.com'];
const VALID_PASSWORD = 'stagwellmachine2026';
const STORAGE_KEY = 'vc-rfp-auth';

interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredAuth(): AuthState {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, userEmail: null };
  }
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.isAuthenticated && parsed.userEmail) {
        return { isAuthenticated: true, userEmail: parsed.userEmail };
      }
    }
  } catch {
    // Ignore parse errors
  }
  return { isAuthenticated: false, userEmail: null };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userEmail: null,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    setAuthState(getStoredAuth());
    setIsHydrated(true);
  }, []);

  const login = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();

    // Validate email format
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // Validate domain
    const domain = trimmedEmail.split('@')[1];
    if (!APPROVED_DOMAINS.includes(domain)) {
      return { success: false, error: 'Email domain not authorized. Access is limited to approved organizations.' };
    }

    // Validate password
    if (password !== VALID_PASSWORD) {
      return { success: false, error: 'Incorrect password.' };
    }

    // Success
    const newState: AuthState = { isAuthenticated: true, userEmail: trimmedEmail };
    setAuthState(newState);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setAuthState({ isAuthenticated: false, userEmail: null });
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  // Don't render children until hydrated to avoid flash
  if (!isHydrated) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
