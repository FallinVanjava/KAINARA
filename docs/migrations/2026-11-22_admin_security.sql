-- =====================================================================
-- KAINARA - Migrasi keamanan role admin
-- Tanggal: 2026-11-22
--
-- Cara pakai:
--   Supabase Dashboard -> SQL Editor -> New query -> tempel seluruh file
--   ini -> Run. Aman dijalankan ulang (idempotent).
--
-- Isi:
--   1. Tabel audit untuk perubahan role/status admin
--   2. Trigger pencatat perubahan role/status
--   3. Penguncian izin tabel audit (hanya admin yang bisa membaca)
--
-- Catatan: migration ini tidak mengganti pengaturan Supabase Auth.
-- Aktifkan MFA, pembatasan percobaan login, dan notifikasi login di
-- dashboard Supabase secara terpisah.
-- =====================================================================


-- ---------- 0. Hak dasar Supabase ----------
-- Project yang dibuat tanpa default privileges bisa menolak akses
-- service_role/authenticated ke tabel hasil SQL Editor. RLS tetap berlaku.
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;


-- ---------- 1. Tabel audit ----------
create table if not exists public.admin_audit_log (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  actor_id     uuid,
  actor_email  text,
  aksi         text not null,
  target_tabel text not null,
  target_id    text,
  detail       jsonb not null default '{}'::jsonb
);

create index if not exists idx_admin_audit_created
  on public.admin_audit_log (created_at desc);
create index if not exists idx_admin_audit_actor
  on public.admin_audit_log (actor_id);

alter table public.admin_audit_log enable row level security;

drop policy if exists "admin_audit_select_admin" on public.admin_audit_log;
create policy "admin_audit_select_admin" on public.admin_audit_log
  for select to authenticated using (public.is_admin());

-- Supabase memberi hak tabel penuh ke authenticated secara default.
-- Cabut dulu, lalu beri hanya SELECT; RLS tetap membatasi ke admin aktif.
revoke all on public.admin_audit_log from public, anon, authenticated;
grant select on public.admin_audit_log to authenticated;


-- ---------- 2. Catat peran/status ----------
create or replace function public.log_admin_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     or new.is_active is distinct from old.is_active then
    insert into public.admin_audit_log
      (actor_id, actor_email, aksi, target_tabel, target_id, detail)
    values (
      auth.uid(),
      (select email from public.profiles where id = auth.uid()),
      'profile_role_status',
      'profiles',
      new.id::text,
      jsonb_build_object(
        'role', jsonb_build_array(old.role, new.role),
        'is_active', jsonb_build_array(old.is_active, new.is_active)
      )
    );
  end if;
  return new;
end $$;

drop trigger if exists trg_admin_role_audit on public.profiles;
create trigger trg_admin_role_audit
  after update on public.profiles
  for each row execute function public.log_admin_role_change();


-- ---------- 3. Pastikan kolom istimewa tidak bisa diubah pengguna ----------
-- Cadangan jika trigger bawaan belum terpasang pada database lama.
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null then
    if not public.is_admin() then
      new.role      := old.role;
      new.is_active := old.is_active;
      new.email     := old.email;
      new.id        := old.id;
      new.created_at := old.created_at;
    elsif auth.uid() = old.id
          and (new.role is distinct from old.role
               or new.is_active is distinct from old.is_active) then
      raise exception 'Admin tidak dapat mengubah role atau status dirinya sendiri'
        using errcode = '42501';
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_protect_profile_columns on public.profiles;
create trigger trg_protect_profile_columns
  before update on public.profiles
  for each row execute function public.protect_profile_columns();


-- SELESAI
