-- =====================================================================
--  Mosha website — database security & features
--  Run ONCE in: Supabase Dashboard → SQL Editor → New query → Run
--  Safe to re-run (idempotent).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Admin allow-list (only these Google accounts can manage the site)
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- No policies on purpose: nobody can read or change this table through the API.
-- Add or remove admins from this SQL editor only.

insert into public.admins (email) values
  ('almujtabashawgi@gmail.com'),
  ('mostafashawgi@gmail.com')
on conflict (email) do nothing;

-- True only when the caller signed in with a *Google* identity whose
-- email is in the allow-list. (Prevents someone registering an
-- unverified email/password account with an admin's address.)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from auth.identities i
    join public.admins a
      on lower(a.email) = lower(i.identity_data ->> 'email')
    where i.user_id = auth.uid()
      and i.provider = 'google'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- 2) Products: everyone can read, only admins can write
-- ---------------------------------------------------------------------
alter table public.products enable row level security;

-- Drop every existing policy on products (old ones may allow public writes)
do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'public' and tablename = 'products'
  loop
    execute format('drop policy %I on public.products', p.policyname);
  end loop;
end $$;

create policy "products: public read"
  on public.products for select
  using (true);

create policy "products: admin insert"
  on public.products for insert to authenticated
  with check (public.is_admin());

create policy "products: admin update"
  on public.products for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "products: admin delete"
  on public.products for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------
-- 3) Offers (العروض)
-- ---------------------------------------------------------------------
create table if not exists public.offers (
  id            bigint generated always as identity primary key,
  title         text not null check (char_length(title) between 1 and 160),
  title_ar      text not null check (char_length(title_ar) between 1 and 160),
  description   text not null default '' check (char_length(description) <= 2000),
  description_ar text not null default '' check (char_length(description_ar) <= 2000),
  image         text not null check (char_length(image) <= 1000),
  badge         text not null default '' check (char_length(badge) <= 40),
  badge_ar      text not null default '' check (char_length(badge_ar) <= 40),
  price_old     text not null default '' check (char_length(price_old) <= 60),
  price_new     text not null default '' check (char_length(price_new) <= 60),
  starts_at     timestamptz,
  ends_at       timestamptz,
  is_active     boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);
alter table public.offers enable row level security;

drop policy if exists "offers: public read live" on public.offers;
drop policy if exists "offers: admin read all"   on public.offers;
drop policy if exists "offers: admin insert"     on public.offers;
drop policy if exists "offers: admin update"     on public.offers;
drop policy if exists "offers: admin delete"     on public.offers;

-- Visitors only see offers that are active and inside their date window
create policy "offers: public read live"
  on public.offers for select
  using (
    is_active
    and (starts_at is null or starts_at <= now())
    and (ends_at   is null or ends_at   >  now())
  );

create policy "offers: admin read all"
  on public.offers for select to authenticated
  using (public.is_admin());

create policy "offers: admin insert"
  on public.offers for insert to authenticated
  with check (public.is_admin());

create policy "offers: admin update"
  on public.offers for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "offers: admin delete"
  on public.offers for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------
-- 4) Contact messages (backup of every message + spam rate-limit)
--    Written only by the server (/api/send-email with the service key).
-- ---------------------------------------------------------------------
create table if not exists public.messages (
  id         bigint generated always as identity primary key,
  name       text not null check (char_length(name) <= 100),
  email      text not null check (char_length(email) <= 200),
  phone      text not null default '' check (char_length(phone) <= 40),
  subject    text not null default '' check (char_length(subject) <= 60),
  message    text not null check (char_length(message) <= 5000),
  ip_hash    text,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists messages_ip_time_idx on public.messages (ip_hash, created_at desc);
alter table public.messages enable row level security;

drop policy if exists "messages: admin read"   on public.messages;
drop policy if exists "messages: admin update" on public.messages;
drop policy if exists "messages: admin delete" on public.messages;

create policy "messages: admin read"
  on public.messages for select to authenticated
  using (public.is_admin());

create policy "messages: admin update"
  on public.messages for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "messages: admin delete"
  on public.messages for delete to authenticated
  using (public.is_admin());
-- (no insert policy: visitors cannot write here directly)

-- ---------------------------------------------------------------------
-- 5) Image storage bucket "products": public read, admin-only upload,
--    5 MB max, images only
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

update storage.buckets
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','image/avif']
where id = 'products';

-- Drop old storage policies that mention the products bucket
do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'storage' and tablename = 'objects'
             and (coalesce(qual,'') ilike '%products%' or coalesce(with_check,'') ilike '%products%')
  loop
    execute format('drop policy %I on storage.objects', p.policyname);
  end loop;
end $$;

create policy "products bucket: admin upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'products' and public.is_admin());

create policy "products bucket: admin update"
  on storage.objects for update to authenticated
  using (bucket_id = 'products' and public.is_admin())
  with check (bucket_id = 'products' and public.is_admin());

create policy "products bucket: admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'products' and public.is_admin());

-- ---------------------------------------------------------------------
-- 6) Live updates for offers & messages (products already enabled)
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'products') then
    execute 'alter publication supabase_realtime add table public.products';
  end if;
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'offers') then
    execute 'alter publication supabase_realtime add table public.offers';
  end if;
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages') then
    execute 'alter publication supabase_realtime add table public.messages';
  end if;
end $$;

-- Done ✅
