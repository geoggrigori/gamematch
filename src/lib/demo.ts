/**
 * Offline "guest" mode.
 *
 * Lets anyone explore the full app — swipe, matches and chat — with realistic
 * sample data and WITHOUT creating an account or even a configured backend.
 * The app talks to the backend through exactly two seams: `useAuth` (session)
 * and `lib/api` (every Supabase call). Both check `isDemo()` and short-circuit
 * to the data below, so the pages themselves stay backend-agnostic.
 */
import type { MatchSummary, Message, Profile } from "./types";

const DEMO_KEY = "gamematch_demo";

/** Synthetic id for the signed-in guest. */
export const DEMO_USER_ID = "demo-me";

export function isDemo(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DEMO_KEY) === "1";
}

export function enableDemo(): void {
  window.localStorage.setItem(DEMO_KEY, "1");
}

export function disableDemo(): void {
  window.localStorage.removeItem(DEMO_KEY);
  // Drop any in-session edits so the next guest starts fresh.
  profileOverride = null;
  msgStore = null;
}

const iso = (msAgo: number) => new Date(Date.now() - msAgo).toISOString();
const MIN = 60_000;
const DAY = 24 * 60 * MIN;

// ---- The guest's own profile (editable during the session) ----

const BASE_ME: Profile = {
  id: DEMO_USER_ID,
  username: "visitante",
  nickname: "Visitante",
  bio: "Explorando o GameMatch em modo demonstração. Bora marcar uma ranked? 🎮",
  age: 22,
  location: "São José dos Campos, SP",
  avatar_emoji: "🎮",
  current_game: "Valorant",
  top_games: ["Valorant", "League of Legends", "CS2"],
  interests: ["FPS", "MOBA", "Competitivo"],
  is_online: true,
  created_at: iso(30 * DAY),
  updated_at: iso(0),
};

let profileOverride: Profile | null = null;

export function getDemoMe(): Profile {
  return profileOverride ?? BASE_ME;
}

export function setDemoMe(patch: Partial<Profile>): Profile {
  profileOverride = { ...getDemoMe(), ...patch, updated_at: new Date().toISOString() };
  return profileOverride;
}

// ---- Candidate deck ----

export const DEMO_CANDIDATES: Profile[] = [
  {
    id: "demo-1", username: "lunaplays", nickname: "Luna", age: 23,
    location: "São Paulo, SP", avatar_emoji: "🦊", current_game: "Valorant",
    bio: "Duelista raivosa, main Jett. Procuro alguém pra subir de Ouro a Imortal sem tiltar. 😤",
    top_games: ["Valorant", "Apex Legends", "Overwatch 2"],
    interests: ["FPS", "Competitivo", "Discord"], is_online: true,
    created_at: iso(40 * DAY), updated_at: iso(2 * MIN),
  },
  {
    id: "demo-2", username: "kaito_dev", nickname: "Kaito", age: 27,
    location: "Curitiba, PR", avatar_emoji: "🐉", current_game: "League of Legends",
    bio: "Jungler de coração. Gosto de macro, objetivos e de uma boa call. Steam aberta de madrugada.",
    top_games: ["League of Legends", "Teamfight Tactics", "Dota 2"],
    interests: ["MOBA", "Estratégia", "Ranked"], is_online: true,
    created_at: iso(120 * DAY), updated_at: iso(15 * MIN),
  },
  {
    id: "demo-3", username: "bibavibes", nickname: "Bibi", age: 21,
    location: "Belo Horizonte, MG", avatar_emoji: "🌸", current_game: null,
    bio: "Cozy gamer 🌿 Stardew, Animal Crossing e umas partidinhas de Fall Guys pra relaxar.",
    top_games: ["Stardew Valley", "Animal Crossing", "Fall Guys"],
    interests: ["Cozy", "Indie", "Co-op"], is_online: false,
    created_at: iso(90 * DAY), updated_at: iso(3 * DAY),
  },
  {
    id: "demo-4", username: "raffa_tank", nickname: "Raffa", age: 29,
    location: "Rio de Janeiro, RJ", avatar_emoji: "🛡️", current_game: "Counter-Strike 2",
    bio: "IGL nas horas vagas. Calmo no clutch, gritão no eco. Bora scrim?",
    top_games: ["CS2", "Valorant", "Rainbow Six Siege"],
    interests: ["FPS", "Tático", "Time"], is_online: true,
    created_at: iso(200 * DAY), updated_at: iso(40 * MIN),
  },
  {
    id: "demo-5", username: "nina.gg", nickname: "Nina", age: 24,
    location: "Porto Alegre, RS", avatar_emoji: "⚡", current_game: "Overwatch 2",
    bio: "Support main que carrega no Mercy mas também mata de Tracer. Mic on, sempre. 🎙️",
    top_games: ["Overwatch 2", "Valorant", "Marvel Rivals"],
    interests: ["FPS", "Suporte", "Competitivo"], is_online: false,
    created_at: iso(60 * DAY), updated_at: iso(1 * DAY),
  },
  {
    id: "demo-6", username: "thiagosouls", nickname: "Thiago", age: 31,
    location: "Recife, PE", avatar_emoji: "⚔️", current_game: "Elden Ring",
    bio: "Souls enjoyer. Já platinei tudo da FromSoftware. Posso te ajudar naquele boss. 💀",
    top_games: ["Elden Ring", "Dark Souls 3", "Sekiro"],
    interests: ["RPG", "Soulslike", "PvE"], is_online: true,
    created_at: iso(300 * DAY), updated_at: iso(10 * MIN),
  },
  {
    id: "demo-7", username: "mel_speed", nickname: "Mel", age: 20,
    location: "Florianópolis, SC", avatar_emoji: "🏎️", current_game: "Rocket League",
    bio: "Champ 2 em 2v2. Aéreos duvidosos mas a vibe é boa. Toparia uma série hoje à noite?",
    top_games: ["Rocket League", "Fortnite", "Fall Guys"],
    interests: ["Casual", "Co-op", "Diversão"], is_online: true,
    created_at: iso(45 * DAY), updated_at: iso(25 * MIN),
  },
  {
    id: "demo-8", username: "gustarpg", nickname: "Gusta", age: 26,
    location: "Goiânia, GO", avatar_emoji: "🧙", current_game: "Baldur's Gate 3",
    bio: "Mestre de RPG de mesa que virou viciado em BG3. Procuro grupo pra campanha longa.",
    top_games: ["Baldur's Gate 3", "Divinity OS2", "The Witcher 3"],
    interests: ["RPG", "História", "Co-op"], is_online: false,
    created_at: iso(150 * DAY), updated_at: iso(2 * DAY),
  },
  {
    id: "demo-9", username: "yumi_ow", nickname: "Yumi", age: 22,
    location: "Campinas, SP", avatar_emoji: "👾", current_game: "Marvel Rivals",
    bio: "Acabei de migrar do Overwatch. Main Magneto, adoro um dive. Add aí pra duo! 🦸‍♀️",
    top_games: ["Marvel Rivals", "Overwatch 2", "Valorant"],
    interests: ["FPS", "Hero Shooter", "Competitivo"], is_online: true,
    created_at: iso(20 * DAY), updated_at: iso(5 * MIN),
  },
];

// ---- Existing matches + their chat history ----

const candidate = (id: string) => DEMO_CANDIDATES.find((c) => c.id === id)!;

export const DEMO_MATCHES: MatchSummary[] = [
  {
    match_id: "match-1", matched_at: iso(2 * DAY), other_profile: candidate("demo-1"),
    last_message: "bora ranked hoje? tô precisando subir 😅", last_message_at: iso(12 * MIN),
  },
  {
    match_id: "match-2", matched_at: iso(5 * DAY), other_profile: candidate("demo-6"),
    last_message: "te mando o build do boss depois", last_message_at: iso(3 * 60 * MIN),
  },
  {
    match_id: "match-3", matched_at: iso(1 * DAY), other_profile: candidate("demo-7"),
    last_message: null, last_message_at: null,
  },
];

const BASE_MESSAGES: Record<string, Message[]> = {
  "match-1": [
    { id: "m1-1", match_id: "match-1", sender_id: "demo-1", content: "eai! vi que vc joga valorant tbm 👀", created_at: iso(2 * DAY) },
    { id: "m1-2", match_id: "match-1", sender_id: DEMO_USER_ID, content: "boa! qual seu elo?", created_at: iso(2 * DAY - 5 * MIN) },
    { id: "m1-3", match_id: "match-1", sender_id: "demo-1", content: "ouro 3 subindo kkk e vc?", created_at: iso(1 * DAY) },
    { id: "m1-4", match_id: "match-1", sender_id: DEMO_USER_ID, content: "platina, bora fazer duo", created_at: iso(1 * DAY - 2 * MIN) },
    { id: "m1-5", match_id: "match-1", sender_id: "demo-1", content: "bora ranked hoje? tô precisando subir 😅", created_at: iso(12 * MIN) },
  ],
  "match-2": [
    { id: "m2-1", match_id: "match-2", sender_id: DEMO_USER_ID, content: "cara, tô preso na Rainha Onírica do Elden Ring", created_at: iso(5 * DAY) },
    { id: "m2-2", match_id: "match-2", sender_id: "demo-6", content: "ah essa é tranquila, faz sangramento nela", created_at: iso(5 * DAY - 3 * MIN) },
    { id: "m2-3", match_id: "match-2", sender_id: "demo-6", content: "te mando o build do boss depois", created_at: iso(3 * 60 * MIN) },
  ],
  "match-3": [],
};

let msgStore: Record<string, Message[]> | null = null;

function store(): Record<string, Message[]> {
  if (!msgStore) {
    msgStore = {};
    for (const [k, v] of Object.entries(BASE_MESSAGES)) msgStore[k] = v.map((m) => ({ ...m }));
  }
  return msgStore;
}

export function getDemoMessages(matchId: string): Message[] {
  return store()[matchId] ?? [];
}

export function addDemoMessage(matchId: string, content: string): Message {
  const msg: Message = {
    id: `demo-msg-${Date.now()}`,
    match_id: matchId,
    sender_id: DEMO_USER_ID,
    content,
    created_at: new Date().toISOString(),
  };
  const s = store();
  s[matchId] = [...(s[matchId] ?? []), msg];
  return msg;
}
