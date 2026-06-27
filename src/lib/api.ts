import { supabase } from "./supabase";
import type { MatchSummary, Message, Profile, SwipeResult } from "./types";
import {
  addDemoMessage,
  DEMO_CANDIDATES,
  DEMO_MATCHES,
  getDemoMe,
  getDemoMessages,
  isDemo,
  setDemoMe,
} from "./demo";

/** Load the current user's profile (or null if not signed in / not found). */
export async function getMyProfile(): Promise<Profile | null> {
  if (isDemo()) return getDemoMe();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

/** Update the current user's profile. */
export async function updateMyProfile(
  patch: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>,
): Promise<Profile> {
  if (isDemo()) return setDemoMe(patch);
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Não autenticado");
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", auth.user.id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Profile;
}

/** Candidate profiles to swipe on (excludes me and anyone I've already swiped). */
export async function getCandidates(limit = 20): Promise<Profile[]> {
  if (isDemo()) return DEMO_CANDIDATES.slice(0, limit);
  const { data, error } = await supabase.rpc("get_candidates", { p_limit: limit });
  if (error) throw error;
  return (data ?? []) as Profile[];
}

/** Record a like/pass; returns whether it produced a mutual match. */
export async function recordSwipe(
  targetId: string,
  liked: boolean,
  superLike = false,
): Promise<SwipeResult> {
  if (isDemo()) {
    // Likes match ~45% of the time so the demo feels alive; passes never do.
    const matched = liked && Math.random() < 0.45;
    return { matched, match_id: matched ? `demo-match-${targetId}` : null };
  }
  const { data, error } = await supabase.rpc("record_swipe", {
    p_target: targetId,
    p_liked: liked,
    p_super: superLike,
  });
  if (error) throw error;
  return data as SwipeResult;
}

/** My matches, each with the other person's profile and last message. */
export async function getMyMatches(): Promise<MatchSummary[]> {
  if (isDemo()) return DEMO_MATCHES;
  const { data, error } = await supabase.rpc("get_my_matches");
  if (error) throw error;
  return (data ?? []) as MatchSummary[];
}

/** Messages for a match, oldest first. */
export async function getMessages(matchId: string): Promise<Message[]> {
  if (isDemo()) return getDemoMessages(matchId);
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Message[];
}

/** Send a message in a match. */
export async function sendMessage(
  matchId: string,
  content: string,
): Promise<Message> {
  if (isDemo()) return addDemoMessage(matchId, content);
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Não autenticado");
  const { data, error } = await supabase
    .from("messages")
    .insert({ match_id: matchId, sender_id: auth.user.id, content })
    .select("*")
    .single();
  if (error) throw error;
  return data as Message;
}
