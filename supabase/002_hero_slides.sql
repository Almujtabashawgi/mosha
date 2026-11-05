-- =====================================================================
--  Mosha website — Homepage slider (الواجهة)
--  Run ONCE in: Supabase Dashboard → SQL Editor → New query → Run
--  Requires setup.sql to have been run first. Safe to re-run.
-- =====================================================================

create table if not exists public.hero_slides (
  id          bigint generated always as identity primary key,
  image       text not null check (char_length(image) between 1 and 1000),
  title       text not null default '' check (char_length(title) <= 160),
  title_ar    text not null default '' check (char_length(title_ar) <= 160),
  subtitle    text not null default '' check (char_length(subtitle) <= 400),
  subtitle_ar text not null default '' check (char_length(subtitle_ar) <= 400),
  -- optional: open this product's details when the slide button is clicked
  product_id  bigint,
  -- optional: internal page to open instead, e.g. /offers or /sector/energy
  link        text not null default '' check (link = '' or link ~ '^/[A-Za-z0-9/_?=&-]*$'),
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.hero_slides enable row level security;

drop policy if exists "hero: public read active" on public.hero_slides;
drop policy if exists "hero: admin read all"     on public.hero_slides;
drop policy if exists "hero: admin insert"       on public.hero_slides;
drop policy if exists "hero: admin update"       on public.hero_slides;
drop policy if exists "hero: admin delete"       on public.hero_slides;

-- Visitors only see active slides
create policy "hero: public read active"
  on public.hero_slides for select
  using (is_active);

create policy "hero: admin read all"
  on public.hero_slides for select to authenticated
  using (public.is_admin());

create policy "hero: admin insert"
  on public.hero_slides for insert to authenticated
  with check (public.is_admin());

create policy "hero: admin update"
  on public.hero_slides for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "hero: admin delete"
  on public.hero_slides for delete to authenticated
  using (public.is_admin());

-- Live updates: changes in the dashboard appear on the site immediately
do $$
begin
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'hero_slides') then
    execute 'alter publication supabase_realtime add table public.hero_slides';
  end if;
end $$;

-- Done ✅
