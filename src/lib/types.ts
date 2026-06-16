export interface Profile {
  id: string;
  username: string;
  nickname: string;
  bio: string;
  age: number | null;
  location: string;
  avatar_emoji: string;
  current_game: string | null;
  top_games: string[];
  interests: string[];
  is_online: boolean;
  created_at: string;
  updated_at: string;
}

export interface MatchSummary {
  match_id: string;
  matched_at: string;
  other_profile: Profile;
  last_message: string | null;
  last_message_at: string | null;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface SwipeResult {
  matched: boolean;
  match_id: string | null;
}
