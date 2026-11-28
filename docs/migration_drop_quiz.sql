-- =====================================================================
-- KAINARA MIGRATION: HAPUS MODUL KUIS DATABASE (quiz_questions & quiz_attempts)
-- Jalankan skrip ini di Supabase SQL Editor
-- =====================================================================

-- 1. Hapus fungsi RPC terkait kuis
drop function if exists public.get_random_quiz(integer);
drop function if exists public.admin_quiz_stats(date, date);

-- 2. Hapus tabel kuis (beserta indeks, check, dan foreign key constraints)
drop table if exists public.quiz_attempts cascade;
drop table if exists public.quiz_questions cascade;

-- 3. Perbarui fungsi summary dashboard admin agar tidak merujuk ke tabel kuis
create or replace function public.admin_dashboard_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Akses ditolak' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'total_pengguna',      (select count(*) from public.profiles),
    'pengguna_baru_7hari', (select count(*) from public.profiles
                             where created_at >= now() - interval '7 days'),
    'total_scan_motif',    (select count(*) from public.scan_logs where tipe = 'motif'),
    'total_scan_skintone', (select count(*) from public.scan_logs where tipe = 'skintone'),
    'total_motif',         (select count(*) from public.motifs),
    'total_outfit',        (select count(*) from public.outfits)
  );
end $$;

-- 4. Pastikan hak akses RPC tetap aman
revoke execute on function public.admin_dashboard_summary() from public, anon;
grant execute on function public.admin_dashboard_summary() to authenticated;
