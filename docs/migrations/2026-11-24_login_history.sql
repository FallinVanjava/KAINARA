-- =====================================================================
-- KAINARA - Riwayat Login (login_history)
-- =====================================================================
-- Supabase Dashboard -> SQL Editor -> tempel seluruh file -> Run.
-- Aman dijalankan ulang (idempotent).
-- =====================================================================

-- ---------- login_history (1:N dari profiles / auth.users) ----------
create table if not exists public.login_history (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  logged_at  timestamptz not null default now(),
  ip_address text,
  user_agent text
);

create index if not exists idx_login_history_user_id
  on public.login_history (user_id);
create index if not exists idx_login_history_logged_at
  on public.login_history (logged_at desc);

-- ---------- RLS ----------
alter table public.login_history enable row level security;

drop policy if exists "login_history_select_owner" on public.login_history;
create policy "login_history_select_owner"
  on public.login_history
  for select
  to authenticated
  using ( auth.uid() = user_id );

drop policy if exists "login_history_insert_owner" on public.login_history;
create policy "login_history_insert_owner"
  on public.login_history
  for insert
  to authenticated
  with check ( auth.uid() = user_id );

drop policy if exists "login_history_select_admin" on public.login_history;
create policy "login_history_select_admin"
  on public.login_history
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Admin (termasuk service role melalui RLS bypass) bisa melihat semua baris.
grant select, insert on public.login_history to authenticated;

-- =====================================================================
-- Dokumentasi singkat penggunaan
-- =====================================================================
-- 1. Saat admin berhasil login, server action signInAdmin memasukkan baris
--    ke login_history (user_id, ip_address, user_agent).
-- 2. Pengguna biasa melihat riwayat login miliknya sendiri (via RLS).
-- 3. Admin melihat riwayat login semua pengguna melalui dashboard / kueri SQL.
-- =====================================================================
