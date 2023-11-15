"use client";

import { api } from "@/trpc/react";
import type { ReactSetter } from "@/types";

import type { Session } from "lucia";
import type { ReactNode } from "react";
import { createContext, use, useContext, useEffect, useState } from "react";

type SessionContextType = {
  session: Session | null;
  setSession: ReactSetter<Session | null>;
  query: ReturnType<typeof api.auth.getSession.useQuery>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const query = api.auth.getSession.useQuery(undefined, {
    cacheTime: 60 * 1000,
  });

  useEffect(() => {
    if (query.error) {
      console.error(query.error);
      setSession(null);
      return;
    }

    setSession(query.data ?? null);
  }, [query]);

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        query,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useCartCount must be used within a CartCountProvider");
  }
  return context;
}

