import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SessionContextType = {
  session: string | null;
  isLoading: boolean;
  signIn: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const SESSION_KEY = '@taskmaster:session';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(SESSION_KEY);
        setSession(stored);
        console.log('🔑 SESSION LOADED:', stored);
      } catch (e) {
        console.log('❌ Erro lendo sessão:', e);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function signIn(username: string) {
    await AsyncStorage.setItem(SESSION_KEY, username);
    setSession(username);
  }

  async function signOut() {
    await AsyncStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  return (
    <SessionContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession deve ser usado dentro de SessionProvider');
  return ctx;
}
