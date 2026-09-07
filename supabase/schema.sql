-- Blog posts table for sopian.id portfolio
-- Run this in your self-hosted Supabase SQL Editor

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null, -- markdown content
  cover_image text,
  tags text[] default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on every update
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
  before update on public.posts
  for each row
  execute function public.set_updated_at();

-- Index for fast slug lookups & published listing queries
create index if not exists idx_posts_slug on public.posts (slug);
create index if not exists idx_posts_status_published_at on public.posts (status, published_at desc);

-- Row Level Security: allow public read access to published posts only
alter table public.posts enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts
  for select
  using (status = 'published');

-- NOTE: Inserts/updates should be done via the Supabase Studio dashboard
-- (using the service_role key, which bypasses RLS) or via an authenticated
-- admin session. The anon key used by the frontend can only read published rows.
