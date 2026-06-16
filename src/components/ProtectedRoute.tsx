import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { isSupabaseConfigured } from "@/lib/supabase";

/** Gate a route behind authentication; redirect to /welcome when signed out. */
export default function ProtectedRoute({ children }: { children: ReactElement }) {
  const { session, loading } = useAuth();

  // Without Supabase configured there is no backend yet — send users to the
  // welcome screen instead of letting data-driven pages error out.
  if (!isSupabaseConfigured) return <Navigate to="/welcome" replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Carregando…
      </div>
    );
  }

  if (!session) return <Navigate to="/welcome" replace />;
  return children;
}
