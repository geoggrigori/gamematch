import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { DEMO_USER_ID, disableDemo, enableDemo, isDemo } from "@/lib/demo";

/** Minimal stand-in session used while exploring in guest/demo mode. */
const DEMO_SESSION = {
  user: { id: DEMO_USER_ID, email: "visitante@gamematch.app" },
} as unknown as Session;

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  enterDemo: () => void;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState<boolean>(isDemo());

  function enterDemo() {
    enableDemo();
    setDemo(true);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return {
      error: error?.message ?? null,
      // If no session is returned, the project requires email confirmation.
      needsConfirmation: !error && !data.session,
    };
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    if (demo) {
      disableDemo();
      setDemo(false);
    }
    await supabase.auth.signOut();
  }

  // In demo mode a synthetic session keeps protected routes open and gives the
  // chat a stable "me" id, with no network involved.
  const effectiveSession = demo ? DEMO_SESSION : session;

  return (
    <AuthContext.Provider
      value={{
        session: effectiveSession,
        user: effectiveSession?.user ?? null,
        loading: demo ? false : loading,
        isDemo: demo,
        enterDemo,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
