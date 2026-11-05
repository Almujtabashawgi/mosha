-- =====================================================================
--  Mosha website — "image position" option for homepage slides
--  Run ONCE in: Supabase Dashboard → SQL Editor → New query → Run
--  Safe to re-run.
-- =====================================================================

alter table public.hero_slides
  add column if not exists focus text not null default 'center';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'hero_slides_focus_check') then
    alter table public.hero_slides
      add constraint hero_slides_focus_check
      check (focus in ('center', 'top', 'bottom', 'left', 'right'));
  end if;
end $$;

-- Make the API notice the new column right away
notify pgrst, 'reload schema';

-- Done ✅
