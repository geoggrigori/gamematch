-- ============================================================================
-- GameMatch — database schema (Supabase / Postgres)
-- Run this in the Supabase SQL Editor (one time) for your project.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles: one row per user, linked to Supabase Auth
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique not null,
  nickname     text not null default 'Gamer',
  bio          text not null default '',
  age          int,
  location     text not null default '',
  avatar_emoji text not null default '🎮',
  current_game text,
  top_games    text[] not null default '{}',
  interests    text[] not null default '{}',
  is_online    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select to authenticated using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert to authenticated with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update to authenticated using (auth.uid() = id);

-- Auto-create a profile whenever a new auth user signs up, deriving a unique
-- username from the email local-part.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_username text;
  final_username text;
  suffix int := 0;
begin
  base_username := regexp_replace(lower(split_part(new.email, '@', 1)), '[^a-z0-9_]', '', 'g');
  if base_username = '' then base_username := 'gamer'; end if;
  final_username := base_username;
  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username, nickname)
  values (
    new.id,
    final_username,
    coalesce(new.raw_user_meta_data->>'nickname', base_username)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- swipes: a like/pass from one user toward another
-- ----------------------------------------------------------------------------
create table if not exists public.swipes (
  id         uuid primary key default gen_random_uuid(),
  swiper_id  uuid not null references public.profiles(id) on delete cascade,
  target_id  uuid not null references public.profiles(id) on delete cascade,
  liked      boolean not null,
  super_like boolean not null default false,
  created_at timestamptz not null default now(),
  unique (swiper_id, target_id)
);

alter table public.swipes enable row level security;

drop policy if exists "swipes_select_own" on public.swipes;
create policy "swipes_select_own"
  on public.swipes for select to authenticated using (auth.uid() = swiper_id);

drop policy if exists "swipes_insert_own" on public.swipes;
create policy "swipes_insert_own"
  on public.swipes for insert to authenticated with check (auth.uid() = swiper_id);

-- ----------------------------------------------------------------------------
-- matches: created when two users like each other (stored with user_a < user_b)
-- ----------------------------------------------------------------------------
create table if not exists public.matches (
  id         uuid primary key default gen_random_uuid(),
  user_a     uuid not null references public.profiles(id) on delete cascade,
  user_b     uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_a, user_b),
  check (user_a < user_b)
);

alter table public.matches enable row level security;

drop policy if exists "matches_select_own" on public.matches;
create policy "matches_select_own"
  on public.matches for select to authenticated
  using (auth.uid() = user_a or auth.uid() = user_b);

-- ----------------------------------------------------------------------------
-- messages: chat messages within a match
-- ----------------------------------------------------------------------------
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  match_id   uuid not null references public.matches(id) on delete cascade,
  sender_id  uuid not null references public.profiles(id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_match_created_idx
  on public.messages (match_id, created_at);

alter table public.messages enable row level security;

drop policy if exists "messages_select_in_match" on public.messages;
create policy "messages_select_in_match"
  on public.messages for select to authenticated using (
    exists (
      select 1 from public.matches m
      where m.id = match_id and (m.user_a = auth.uid() or m.user_b = auth.uid())
    )
  );

drop policy if exists "messages_insert_in_match" on public.messages;
create policy "messages_insert_in_match"
  on public.messages for insert to authenticated with check (
    sender_id = auth.uid() and exists (
      select 1 from public.matches m
      where m.id = match_id and (m.user_a = auth.uid() or m.user_b = auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- record_swipe: insert a swipe and, on a mutual like, create the match.
-- Returns { matched: bool, match_id: uuid|null }.
-- ----------------------------------------------------------------------------
create or replace function public.record_swipe(
  p_target uuid,
  p_liked  boolean,
  p_super  boolean default false
)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_match_id uuid;
  v_a uuid;
  v_b uuid;
  v_reciprocal boolean;
begin
  if v_me is null then raise exception 'Not authenticated'; end if;
  if v_me = p_target then raise exception 'Cannot swipe yourself'; end if;

  insert into public.swipes (swiper_id, target_id, liked, super_like)
  values (v_me, p_target, p_liked, p_super)
  on conflict (swiper_id, target_id)
  do update set liked = excluded.liked, super_like = excluded.super_like;

  if not p_liked then
    return jsonb_build_object('matched', false, 'match_id', null);
  end if;

  select exists (
    select 1 from public.swipes s
    where s.swiper_id = p_target and s.target_id = v_me and s.liked
  ) into v_reciprocal;

  if not v_reciprocal then
    return jsonb_build_object('matched', false, 'match_id', null);
  end if;

  if v_me < p_target then v_a := v_me; v_b := p_target;
  else v_a := p_target; v_b := v_me; end if;

  insert into public.matches (user_a, user_b)
  values (v_a, v_b)
  on conflict (user_a, user_b) do nothing
  returning id into v_match_id;

  if v_match_id is null then
    select id into v_match_id from public.matches where user_a = v_a and user_b = v_b;
  end if;

  return jsonb_build_object('matched', true, 'match_id', v_match_id);
end;
$$;

-- ----------------------------------------------------------------------------
-- get_candidates: profiles to swipe on (not me, not already swiped)
-- ----------------------------------------------------------------------------
create or replace function public.get_candidates(p_limit int default 20)
returns setof public.profiles
language sql
security definer set search_path = public
as $$
  select p.* from public.profiles p
  where p.id <> auth.uid()
    and not exists (
      select 1 from public.swipes s
      where s.swiper_id = auth.uid() and s.target_id = p.id
    )
  order by p.is_online desc, p.created_at desc
  limit p_limit;
$$;

-- ----------------------------------------------------------------------------
-- get_my_matches: my matches with the other person's profile + last message
-- ----------------------------------------------------------------------------
create or replace function public.get_my_matches()
returns table (
  match_id        uuid,
  matched_at      timestamptz,
  other_profile   jsonb,
  last_message    text,
  last_message_at timestamptz
)
language sql
security definer set search_path = public
as $$
  select
    m.id,
    m.created_at,
    to_jsonb(op.*) as other_profile,
    lm.content,
    lm.created_at
  from public.matches m
  join public.profiles op
    on op.id = case when m.user_a = auth.uid() then m.user_b else m.user_a end
  left join lateral (
    select content, created_at
    from public.messages msg
    where msg.match_id = m.id
    order by created_at desc
    limit 1
  ) lm on true
  where m.user_a = auth.uid() or m.user_b = auth.uid()
  order by coalesce(lm.created_at, m.created_at) desc;
$$;

-- ----------------------------------------------------------------------------
-- Realtime: broadcast new messages
-- ----------------------------------------------------------------------------
alter publication supabase_realtime add table public.messages;
