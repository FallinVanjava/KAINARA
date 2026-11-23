-- =====================================================================
-- KAINARA - Skema Database Lengkap (Supabase / PostgreSQL)
-- =====================================================================
-- Cara pakai:
--   Supabase Dashboard -> SQL Editor -> New query -> tempel seluruh file
--   ini -> Run. Aman dijalankan ulang (idempotent).
--
-- Isi:
--   1. Tabel + indeks
--   2. Fungsi pembantu, trigger
--   3. Row Level Security (RLS)
--   4. Storage bucket (motifs, outfits)
--   5. Fungsi statistik untuk dashboard admin
--   6. Data awal (seed)
--   7. Cara membuat admin pertama (di bagian paling bawah)
-- =====================================================================


-- =====================================================================
-- 1. TABEL
-- =====================================================================

-- ---------- profiles (1:1 dengan auth.users) ----------
create table if not exists public.profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  nama              text,
  email             text,
  role              text not null default 'user' check (role in ('user', 'admin')),
  skintone_terakhir uuid,  -- FK ditambahkan setelah tabel skintones dibuat
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---------- skintones ----------
create table if not exists public.skintones (
  id         uuid primary key default gen_random_uuid(),
  nama       text not null unique,
  hex_color  text not null check (hex_color ~ '^#[0-9A-Fa-f]{6}$'),
  undertone  text not null check (undertone in ('warm', 'cool', 'neutral')),
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_skintone_terakhir_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_skintone_terakhir_fkey
      foreign key (skintone_terakhir) references public.skintones (id) on delete set null;
  end if;
end $$;

-- ---------- motifs ----------
create table if not exists public.motifs (
  id             uuid primary key default gen_random_uuid(),
  nama           text not null,
  slug           text not null unique,
  daerah_asal    text,
  deskripsi      text,
  makna_filosofi text,
  sejarah        text,
  warna_dominan  text[] not null default '{}',
  gambar_url     text,
  is_published   boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------- motif_skintone_match ----------
create table if not exists public.motif_skintone_match (
  motif_id       uuid not null references public.motifs (id) on delete cascade,
  skintone_id    uuid not null references public.skintones (id) on delete cascade,
  skor_kecocokan integer not null default 0 check (skor_kecocokan between 0 and 100),
  catatan        text,
  primary key (motif_id, skintone_id)
);

-- ---------- outfits ----------
create table if not exists public.outfits (
  id           uuid primary key default gen_random_uuid(),
  nama         text not null unique,
  deskripsi    text,
  gambar_url   text,
  kategori     text,  -- contoh: adat, formal, kasual, modern
  warna_utama  text,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------- outfit_motif ----------
create table if not exists public.outfit_motif (
  outfit_id uuid not null references public.outfits (id) on delete cascade,
  motif_id  uuid not null references public.motifs (id) on delete cascade,
  primary key (outfit_id, motif_id)
);

-- ---------- quiz_questions ----------
-- opsi         : array JSON berisi teks pilihan, mis. ["A","B","C","D"]
-- jawaban_benar: INDEKS pilihan yang benar, dimulai dari 0
create table if not exists public.quiz_questions (
  id            uuid primary key default gen_random_uuid(),
  pertanyaan    text not null unique,
  opsi          jsonb not null check (jsonb_typeof(opsi) = 'array'),
  jawaban_benar integer not null check (jawaban_benar >= 0),
  penjelasan    text,
  motif_id      uuid references public.motifs (id) on delete set null,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ---------- quiz_attempts ----------
create table if not exists public.quiz_attempts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles (id) on delete set null,  -- null = tamu
  skor       integer not null check (skor >= 0),
  total      integer not null check (total > 0),
  created_at timestamptz not null default now(),
  check (skor <= total)
);

-- ---------- scan_logs ----------
-- hasil (jsonb), contoh:
--   tipe 'motif'    : {"confidence":0.93,"label":"pucuk-rebung"}
--   tipe 'skintone' : {"hex":"#D9A877","undertone":"warm","confidence":0.88}
create table if not exists public.scan_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles (id) on delete set null,
  tipe        text not null check (tipe in ('motif', 'skintone')),
  motif_id    uuid references public.motifs (id) on delete set null,
  skintone_id uuid references public.skintones (id) on delete set null,
  hasil       jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- ---------- indeks ----------
create index if not exists idx_motifs_published        on public.motifs (is_published);
create index if not exists idx_outfits_published       on public.outfits (is_published);
create index if not exists idx_outfit_motif_motif      on public.outfit_motif (motif_id);
create index if not exists idx_match_skintone          on public.motif_skintone_match (skintone_id);
create index if not exists idx_quiz_questions_pub      on public.quiz_questions (is_published);
create index if not exists idx_quiz_attempts_created   on public.quiz_attempts (created_at);
create index if not exists idx_quiz_attempts_user      on public.quiz_attempts (user_id);
create index if not exists idx_scan_logs_created       on public.scan_logs (created_at);
create index if not exists idx_scan_logs_user          on public.scan_logs (user_id);
create index if not exists idx_scan_logs_tipe_motif    on public.scan_logs (tipe, motif_id);
create index if not exists idx_profiles_role           on public.profiles (role);
create index if not exists idx_profiles_created        on public.profiles (created_at);


-- =====================================================================
-- 2. FUNGSI PEMBANTU & TRIGGER
-- =====================================================================

-- Cek apakah pengguna saat ini adalah admin aktif.
-- SECURITY DEFINER agar tidak terjadi rekursi RLS pada tabel profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active
  );
$$;

-- Cek apakah pengguna saat ini akunnya aktif (tidak dinonaktifkan admin).
create or replace function public.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_active from public.profiles where id = auth.uid()),
    false
  );
$$;

-- updated_at otomatis
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_motifs_updated on public.motifs;
create trigger trg_motifs_updated before update on public.motifs
  for each row execute function public.set_updated_at();

drop trigger if exists trg_outfits_updated on public.outfits;
create trigger trg_outfits_updated before update on public.outfits
  for each row execute function public.set_updated_at();

-- Buat profil otomatis saat ada pengguna baru mendaftar (web maupun mobile).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, nama)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'nama',
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Lindungi kolom sensitif di profiles:
--  * pengguna biasa tidak bisa mengubah role, is_active, email
--  * admin tidak bisa menurunkan role dirinya sendiri
-- (auth.uid() null = SQL Editor / service role, dibiarkan lolos)
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
    elsif auth.uid() = old.id
          and (new.role <> old.role or new.is_active <> old.is_active) then
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

-- Setiap scan skintone otomatis memperbarui skintone_terakhir milik pengguna.
create or replace function public.update_last_skintone()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.tipe = 'skintone' and new.skintone_id is not null and new.user_id is not null then
    update public.profiles
       set skintone_terakhir = new.skintone_id
     where id = new.user_id;
  end if;
  return new;
end $$;

drop trigger if exists trg_scan_last_skintone on public.scan_logs;
create trigger trg_scan_last_skintone
  after insert on public.scan_logs
  for each row execute function public.update_last_skintone();

-- Ambil soal kuis acak (dipakai halaman /kuis di web dan bisa dipakai mobile).
create or replace function public.get_random_quiz(p_limit integer default 10)
returns setof public.quiz_questions
language sql
stable
as $$
  select * from public.quiz_questions
  where is_published
  order by random()
  limit greatest(p_limit, 1);
$$;


-- =====================================================================
-- 3. ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles             enable row level security;
alter table public.skintones            enable row level security;
alter table public.motifs               enable row level security;
alter table public.motif_skintone_match enable row level security;
alter table public.outfits              enable row level security;
alter table public.outfit_motif         enable row level security;
alter table public.quiz_questions       enable row level security;
alter table public.quiz_attempts        enable row level security;
alter table public.scan_logs            enable row level security;

-- ---------- profiles ----------
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- (INSERT ditangani trigger handle_new_user; DELETE hanya lewat service role)

-- ---------- skintones ----------
drop policy if exists "skintones_select_all" on public.skintones;
create policy "skintones_select_all" on public.skintones
  for select using (true);

drop policy if exists "skintones_admin_write" on public.skintones;
create policy "skintones_admin_write" on public.skintones
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- motifs ----------
drop policy if exists "motifs_select_published" on public.motifs;
create policy "motifs_select_published" on public.motifs
  for select using (is_published or public.is_admin());

drop policy if exists "motifs_admin_write" on public.motifs;
create policy "motifs_admin_write" on public.motifs
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- motif_skintone_match ----------
drop policy if exists "match_select_all" on public.motif_skintone_match;
create policy "match_select_all" on public.motif_skintone_match
  for select using (true);

drop policy if exists "match_admin_write" on public.motif_skintone_match;
create policy "match_admin_write" on public.motif_skintone_match
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- outfits ----------
drop policy if exists "outfits_select_published" on public.outfits;
create policy "outfits_select_published" on public.outfits
  for select using (is_published or public.is_admin());

drop policy if exists "outfits_admin_write" on public.outfits;
create policy "outfits_admin_write" on public.outfits
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- outfit_motif ----------
drop policy if exists "outfit_motif_select_all" on public.outfit_motif;
create policy "outfit_motif_select_all" on public.outfit_motif
  for select using (true);

drop policy if exists "outfit_motif_admin_write" on public.outfit_motif;
create policy "outfit_motif_admin_write" on public.outfit_motif
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- quiz_questions ----------
drop policy if exists "quiz_questions_select_published" on public.quiz_questions;
create policy "quiz_questions_select_published" on public.quiz_questions
  for select using (is_published or public.is_admin());

drop policy if exists "quiz_questions_admin_write" on public.quiz_questions;
create policy "quiz_questions_admin_write" on public.quiz_questions
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- quiz_attempts ----------
-- Tamu (tanpa login) boleh menyimpan hasil dengan user_id null.
drop policy if exists "quiz_attempts_insert" on public.quiz_attempts;
create policy "quiz_attempts_insert" on public.quiz_attempts
  for insert with check (user_id is null or user_id = auth.uid());

drop policy if exists "quiz_attempts_select_own_or_admin" on public.quiz_attempts;
create policy "quiz_attempts_select_own_or_admin" on public.quiz_attempts
  for select using (user_id = auth.uid() or public.is_admin());

-- ---------- scan_logs ----------
drop policy if exists "scan_logs_insert_own" on public.scan_logs;
create policy "scan_logs_insert_own" on public.scan_logs
  for insert with check (user_id = auth.uid() and public.is_active_user());

drop policy if exists "scan_logs_select_own_or_admin" on public.scan_logs;
create policy "scan_logs_select_own_or_admin" on public.scan_logs
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "scan_logs_admin_delete" on public.scan_logs;
create policy "scan_logs_admin_delete" on public.scan_logs
  for delete using (public.is_admin());


-- =====================================================================
-- 4. STORAGE (bucket gambar)
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('motifs',  'motifs',  true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('outfits', 'outfits', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "kainara_storage_read" on storage.objects;
create policy "kainara_storage_read" on storage.objects
  for select using (bucket_id in ('motifs', 'outfits'));

drop policy if exists "kainara_storage_admin_insert" on storage.objects;
create policy "kainara_storage_admin_insert" on storage.objects
  for insert with check (bucket_id in ('motifs', 'outfits') and public.is_admin());

drop policy if exists "kainara_storage_admin_update" on storage.objects;
create policy "kainara_storage_admin_update" on storage.objects
  for update using (bucket_id in ('motifs', 'outfits') and public.is_admin());

drop policy if exists "kainara_storage_admin_delete" on storage.objects;
create policy "kainara_storage_admin_delete" on storage.objects
  for delete using (bucket_id in ('motifs', 'outfits') and public.is_admin());


-- =====================================================================
-- 5. FUNGSI STATISTIK DASHBOARD ADMIN
--    Hanya bisa dipanggil admin: supabase.rpc('admin_dashboard_summary')
--    Tanggal dihitung dalam zona waktu Asia/Jakarta (WIB).
-- =====================================================================

-- Kartu ringkasan
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
    'total_percobaan_kuis',(select count(*) from public.quiz_attempts),
    'rata_rata_skor_kuis', (select coalesce(round(avg(skor::numeric / total * 100), 1), 0)
                              from public.quiz_attempts),
    'total_motif',         (select count(*) from public.motifs),
    'total_outfit',        (select count(*) from public.outfits)
  );
end $$;

-- Grafik garis: scan per hari
create or replace function public.admin_scan_per_day(
  p_start date default (current_date - 29),
  p_end   date default current_date
)
returns table (tanggal date, scan_motif bigint, scan_skintone bigint)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Akses ditolak' using errcode = '42501';
  end if;

  return query
  select
    d::date,
    count(s.id) filter (where s.tipe = 'motif'),
    count(s.id) filter (where s.tipe = 'skintone')
  from generate_series(p_start::timestamp, p_end::timestamp, interval '1 day') as d
  left join public.scan_logs s
         on (s.created_at at time zone 'Asia/Jakarta')::date = d::date
  group by d
  order by d;
end $$;

-- Grafik batang: motif paling sering di-scan
create or replace function public.admin_top_motifs(
  p_start date default (current_date - 29),
  p_end   date default current_date,
  p_limit integer default 10
)
returns table (motif_id uuid, nama text, total bigint)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Akses ditolak' using errcode = '42501';
  end if;

  return query
  select m.id, m.nama, count(*)::bigint
  from public.scan_logs s
  join public.motifs m on m.id = s.motif_id
  where s.tipe = 'motif'
    and (s.created_at at time zone 'Asia/Jakarta')::date between p_start and p_end
  group by m.id, m.nama
  order by count(*) desc, m.nama
  limit greatest(p_limit, 1);
end $$;

-- Grafik pie: distribusi skintone pengguna (berdasarkan skintone terakhir)
create or replace function public.admin_skintone_distribution()
returns table (skintone_id uuid, nama text, hex_color text, total bigint)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Akses ditolak' using errcode = '42501';
  end if;

  return query
  select t.id, t.nama, t.hex_color, count(p.id)::bigint
  from public.skintones t
  left join public.profiles p on p.skintone_terakhir = t.id
  group by t.id, t.nama, t.hex_color
  order by count(p.id) desc, t.nama;
end $$;

-- Statistik kuis
create or replace function public.admin_quiz_stats(
  p_start date default (current_date - 29),
  p_end   date default current_date
)
returns table (total_percobaan bigint, rata_rata_skor_persen numeric)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Akses ditolak' using errcode = '42501';
  end if;

  return query
  select
    count(*)::bigint,
    coalesce(round(avg(a.skor::numeric / a.total * 100), 1), 0)
  from public.quiz_attempts a
  where (a.created_at at time zone 'Asia/Jakarta')::date between p_start and p_end;
end $$;

-- Batasi akses: hanya user login (fungsi memeriksa admin di dalamnya)
revoke execute on function public.admin_dashboard_summary()                    from public, anon;
revoke execute on function public.admin_scan_per_day(date, date)               from public, anon;
revoke execute on function public.admin_top_motifs(date, date, integer)        from public, anon;
revoke execute on function public.admin_skintone_distribution()                from public, anon;
revoke execute on function public.admin_quiz_stats(date, date)                 from public, anon;

grant execute on function public.admin_dashboard_summary()                     to authenticated;
grant execute on function public.admin_scan_per_day(date, date)                to authenticated;
grant execute on function public.admin_top_motifs(date, date, integer)         to authenticated;
grant execute on function public.admin_skintone_distribution()                 to authenticated;
grant execute on function public.admin_quiz_stats(date, date)                  to authenticated;


-- =====================================================================
-- 6. DATA AWAL (SEED)
--    CATATAN: teks motif & kuis di bawah adalah DRAF awal. Mohon
--    diverifikasi dengan sumber/narasumber budaya Lampung, lalu
--    sempurnakan lewat panel admin. Nilai hex skintone adalah nilai
--    awal; sesuaikan dengan hasil deteksi aplikasi mobile Anda.
-- =====================================================================

-- ---------- skintones ----------
insert into public.skintones (nama, hex_color, undertone) values
  ('Cerah Cool',        '#F3DCD2', 'cool'),
  ('Cerah Warm',        '#F5DDC3', 'warm'),
  ('Kuning Langsat',    '#E8C9A0', 'neutral'),
  ('Sawo Muda',         '#D9A877', 'warm'),
  ('Sawo Matang',       '#C08A5C', 'neutral'),
  ('Sawo Matang Cool',  '#B67F65', 'cool'),
  ('Cokelat Hangat',    '#8D5A3B', 'warm'),
  ('Gelap Cool',        '#5C3A2E', 'cool')
on conflict (nama) do nothing;

-- ---------- motifs ----------
insert into public.motifs
  (nama, slug, daerah_asal, deskripsi, makna_filosofi, sejarah, warna_dominan, is_published)
values
  ('Pucuk Rebung', 'pucuk-rebung', 'Lampung',
   'Motif berbentuk segitiga meruncing menyerupai tunas bambu muda (rebung), sering tampil berderet sebagai pinggiran atau tumpal pada kain.',
   'Melambangkan kehidupan yang terus tumbuh, harapan, dan keteguhan. Bambu dikenal lentur namun kuat.',
   'Motif rebung dikenal luas di budaya Melayu Nusantara dan diadaptasi dalam sulam tapis Lampung.',
   array['emas','merah marun','hitam'], true),

  ('Kapal', 'kapal', 'Lampung',
   'Motif perahu atau kapal dengan hiasan di atasnya, dikenal sebagai salah satu motif paling ikonik pada kain tapis Lampung.',
   'Dalam tafsir umum melambangkan perjalanan hidup, serta kedudukan dan kehormatan pemakainya. Kerap dikaitkan dengan upacara adat.',
   'Motif kapal telah lama hadir dalam tradisi tapis dan digunakan pada busana adat dalam berbagai upacara.',
   array['emas','merah marun','putih'], true),

  ('Siger', 'siger', 'Lampung',
   'Motif yang terinspirasi mahkota adat Lampung (siger) dengan lekuk-lekuk meruncing yang tersusun rapi.',
   'Lambang kebesaran, kehormatan, dan keagungan adat, sekaligus identitas budaya Lampung.',
   'Siger adalah mahkota pengantin perempuan Lampung dan menjadi ikon daerah. Jumlah lekuknya berbeda menurut kelompok adat.',
   array['emas','hitam','merah'], true),

  ('Gajah', 'gajah', 'Lampung',
   'Motif gajah yang disulam dengan benang emas, mengacu pada satwa yang lekat dengan identitas Lampung.',
   'Melambangkan kekuatan, kebijaksanaan, dan kewibawaan.',
   'Gajah erat kaitannya dengan Lampung, antara lain melalui kawasan konservasi Way Kambas, sehingga banyak diangkat sebagai motif.',
   array['emas','hitam','cokelat'], true),

  ('Mata Punai', 'mata-punai', 'Lampung',
   'Motif geometris yang menyerupai mata burung punai, tersusun berulang dengan sulam benang emas.',
   'Sering ditafsirkan sebagai lambang kewaspadaan dan keanggunan. Makna rincinya perlu dilengkapi dari narasumber budaya.',
   'Motif ini termasuk ragam hias flora-fauna yang diwariskan dalam tradisi sulam tapis.',
   array['emas','merah marun','putih'], true)
on conflict (slug) do nothing;

-- ---------- motif_skintone_match (saran awal berbasis teori warna) ----------
insert into public.motif_skintone_match (motif_id, skintone_id, skor_kecocokan, catatan)
select m.id, s.id, v.skor, v.catatan
from (values
  ('pucuk-rebung','Cerah Cool',       80, 'Kontras emas dan marun tampil tegas pada kulit cerah.'),
  ('pucuk-rebung','Kuning Langsat',   90, 'Emas menyatu hangat dengan kulit langsat.'),
  ('pucuk-rebung','Sawo Matang',      92, 'Marun dan emas menonjolkan warna kulit sawo matang.'),
  ('pucuk-rebung','Cokelat Hangat',   85, 'Pilih dasar marun atau hitam agar benang emas terlihat jelas.'),

  ('kapal','Cerah Warm',              84, 'Dasar marun menambah dimensi pada kulit cerah hangat.'),
  ('kapal','Sawo Muda',               90, 'Perpaduan emas dan merah sangat serasi.'),
  ('kapal','Sawo Matang Cool',        82, 'Gunakan dasar hitam untuk kontras yang elegan.'),
  ('kapal','Gelap Cool',              88, 'Emas dan putih bersinar pada kulit gelap.'),

  ('siger','Cerah Cool',              86, 'Dasar hitam dengan sulam emas memberi kontras kuat.'),
  ('siger','Kuning Langsat',          88, 'Kombinasi klasik untuk busana formal.'),
  ('siger','Sawo Matang',             90, 'Emas selaras dengan hangatnya kulit sawo matang.'),
  ('siger','Cokelat Hangat',          84, 'Hindari dasar cokelat tua agar tidak tenggelam.'),

  ('gajah','Cerah Warm',              78, 'Dasar hitam membantu motif tampil jelas.'),
  ('gajah','Sawo Muda',               86, 'Cokelat dan emas memberi kesan hangat dan berwibawa.'),
  ('gajah','Sawo Matang',             88, 'Tampilan natural dan kuat.'),
  ('gajah','Gelap Cool',              85, 'Emas terang menonjol pada kulit gelap.'),

  ('mata-punai','Cerah Cool',         82, 'Aksen putih dan emas terlihat segar.'),
  ('mata-punai','Kuning Langsat',     86, 'Marun menambah kehangatan wajah.'),
  ('mata-punai','Sawo Matang Cool',   84, 'Padukan dengan dasar marun gelap.'),
  ('mata-punai','Cokelat Hangat',     80, 'Tambahkan aksesori emas agar lebih hidup.')
) as v(motif_slug, skintone_nama, skor, catatan)
join public.motifs    m on m.slug = v.motif_slug
join public.skintones s on s.nama = v.skintone_nama
on conflict do nothing;

-- ---------- outfits ----------
insert into public.outfits (nama, deskripsi, kategori, warna_utama, is_published) values
  ('Kebaya Modern + Kain Tapis',
   'Kebaya brokat dengan potongan modern dipadukan kain tapis sebagai bawahan. Cocok untuk wisuda dan pesta.',
   'formal', 'Marun', true),
  ('Blazer Hitam + Rok Tapis',
   'Blazer hitam polos dengan rok tapis, tampilan profesional yang tetap kental budaya.',
   'formal', 'Hitam', true),
  ('Atasan Putih + Bawahan Tapis',
   'Atasan putih polos dengan bawahan tapis, santai namun rapi untuk acara sehari-hari.',
   'kasual', 'Putih', true),
  ('Busana Adat Lampung Lengkap',
   'Set busana adat dengan tapis, aksesori emas, dan siger untuk upacara adat dan pernikahan.',
   'adat', 'Emas', true),
  ('Kemeja Batik Polos + Sarung Tapis',
   'Kemeja polos dengan sarung tapis untuk pria pada acara adat dan keagamaan.',
   'adat', 'Hitam', true)
on conflict (nama) do nothing;

-- ---------- outfit_motif ----------
insert into public.outfit_motif (outfit_id, motif_id)
select o.id, m.id
from (values
  ('Kebaya Modern + Kain Tapis',        'pucuk-rebung'),
  ('Kebaya Modern + Kain Tapis',        'kapal'),
  ('Blazer Hitam + Rok Tapis',          'siger'),
  ('Blazer Hitam + Rok Tapis',          'mata-punai'),
  ('Atasan Putih + Bawahan Tapis',      'pucuk-rebung'),
  ('Atasan Putih + Bawahan Tapis',      'mata-punai'),
  ('Busana Adat Lampung Lengkap',       'siger'),
  ('Busana Adat Lampung Lengkap',       'kapal'),
  ('Kemeja Batik Polos + Sarung Tapis', 'gajah'),
  ('Kemeja Batik Polos + Sarung Tapis', 'kapal')
) as v(outfit_nama, motif_slug)
join public.outfits o on o.nama = v.outfit_nama
join public.motifs  m on m.slug = v.motif_slug
on conflict do nothing;

-- ---------- quiz_questions (10 soal; jawaban_benar = indeks mulai 0) ----------
insert into public.quiz_questions (pertanyaan, opsi, jawaban_benar, penjelasan, motif_id)
select v.pertanyaan, v.opsi::jsonb, v.jawaban, v.penjelasan,
       (select id from public.motifs where slug = v.motif_slug)
from (values
  ('Kain tapis merupakan kerajinan tradisional khas dari provinsi mana?',
   '["Sumatera Selatan","Lampung","Bengkulu","Jambi"]', 1,
   'Tapis adalah kain tenun bersulam khas Lampung.', null),

  ('Teknik hiasan khas pada kain tapis adalah...',
   '["Batik cap","Ikat celup","Sulam benang emas atau perak","Cetak sablon"]', 2,
   'Tapis dihiasi sulaman benang emas atau perak di atas kain tenun.', null),

  ('Mahkota adat Lampung yang juga menjadi inspirasi motif tapis bernama...',
   '["Siger","Tanjak","Blangkon","Udeng"]', 0,
   'Siger adalah mahkota pengantin perempuan Lampung dan ikon budaya daerah.', 'siger'),

  ('Motif tapis yang menyerupai tunas bambu muda disebut...',
   '["Pucuk Rebung","Mata Punai","Kapal","Gajah"]', 0,
   'Rebung berarti tunas bambu; motif ini melambangkan pertumbuhan dan harapan.', 'pucuk-rebung'),

  ('Dua kelompok adat besar masyarakat Lampung adalah...',
   '["Saibatin dan Pepadun","Baduy dan Tengger","Sasak dan Samawa","Dayak dan Kutai"]', 0,
   'Masyarakat adat Lampung umumnya dibagi menjadi Saibatin dan Pepadun.', null),

  ('Satwa yang dilindungi di Way Kambas dan menjadi inspirasi motif tapis adalah...',
   '["Orangutan","Gajah","Komodo","Cenderawasih"]', 1,
   'Gajah lekat dengan Lampung dan sering diangkat sebagai motif tapis.', 'gajah'),

  ('Warna benang yang paling khas pada sulam tapis tradisional adalah...',
   '["Emas","Ungu muda","Hijau stabilo","Abu-abu"]', 0,
   'Benang emas melambangkan kemuliaan dan kemegahan.', null),

  ('Apa ibu kota Provinsi Lampung?',
   '["Metro","Bandar Lampung","Kotabumi","Pringsewu"]', 1,
   'Bandar Lampung adalah ibu kota sekaligus kota terbesar di Provinsi Lampung.', null),

  ('Dalam tafsir umum, motif Kapal pada tapis melambangkan...',
   '["Perjalanan hidup","Musim panen","Kesuburan tanah","Pertempuran"]', 0,
   'Kapal dimaknai sebagai perjalanan hidup serta kedudukan pemakainya.', 'kapal'),

  ('Fitur scan skintone pada aplikasi Kainara digunakan untuk...',
   '["Mencocokkan warna tapis dengan warna kulit","Mengukur tinggi badan","Menghitung usia kain","Menerjemahkan bahasa"]', 0,
   'Kainara mencocokkan warna tapis dengan warna kulit lalu merekomendasikan outfit.', null)
) as v(pertanyaan, opsi, jawaban, penjelasan, motif_slug)
on conflict (pertanyaan) do nothing;


-- =====================================================================
-- 7. MEMBUAT ADMIN PERTAMA
-- =====================================================================
-- Langkah:
--   a) Buat akun: Dashboard -> Authentication -> Users -> Add user
--      (centang "Auto Confirm User"), atau daftar lewat aplikasi/web.
--   b) Jalankan perintah ini di SQL Editor (ganti emailnya):
--
--   update public.profiles
--      set role = 'admin'
--    where email = 'emailanda@contoh.com';
--
-- =====================================================================
-- SELESAI
-- =====================================================================
