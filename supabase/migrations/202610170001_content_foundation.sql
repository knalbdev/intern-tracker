-- Initial setup for a NEW Supabase content project. Run once in SQL Editor.
-- Does not import, modify, or replace the operational PKL spreadsheet.
-- Content is managed through the Supabase Dashboard for now.
-- Website visitors (including signed-in users) can only read published content.
begin;

create table public.content_sections (
  id uuid primary key default gen_random_uuid(),
  academic_year text not null default '2026/2027',
  slug text not null,
  title text not null,
  body text not null,
  sort_order integer not null default 0,
  source_document text,
  source_pages text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  unique (academic_year, slug)
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  industry text,
  location text,
  website_url text check (website_url is null or website_url ~ '^https://'),
  description text not null default '',
  logo_path text,
  -- Optional name aliases used ONLY to map existing spreadsheet company names.
  -- Student counts and placement data remain sourced from Google Sheets.
  spreadsheet_aliases text[] not null default '{}',
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.documentation_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  body text not null default '',
  academic_year text not null default '2026/2027',
  branch text,
  category text not null default 'kegiatan'
    check (category in ('kegiatan', 'visitasi', 'cerita-siswa', 'karya')),
  company_id uuid references public.companies(id) on delete set null,
  occurred_on date,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.documentation_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.documentation_posts(id) on delete cascade,
  media_path text not null,
  alt_text text not null check (length(trim(alt_text)) > 0),
  caption text,
  sort_order integer not null default 0
);

create index documentation_images_post_id_idx on public.documentation_images(post_id);
create index documentation_posts_company_id_idx on public.documentation_posts(company_id);

alter table public.content_sections enable row level security;
alter table public.companies enable row level security;
alter table public.documentation_posts enable row level security;
alter table public.documentation_images enable row level security;

revoke all on table public.content_sections, public.companies,
  public.documentation_posts, public.documentation_images from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on table public.content_sections, public.companies,
  public.documentation_posts, public.documentation_images to anon, authenticated;

create policy "Read published program content"
  on public.content_sections for select to anon, authenticated
  using (is_published);
create policy "Read published company profiles"
  on public.companies for select to anon, authenticated
  using (is_published);
create policy "Read published documentation"
  on public.documentation_posts for select to anon, authenticated
  using (is_published);
create policy "Read images belonging to published documentation"
  on public.documentation_images for select to anon, authenticated
  using (exists (
    select 1 from public.documentation_posts as post
    where post.id = documentation_images.post_id and post.is_published
  ));

-- Public bucket: approved website images only. NOT protected by row publication.
-- Private bucket: draft media and reference PDFs. No public access policies.
-- No client upload/update/delete policies are created in this initial setup.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('site-media', 'site-media', true, 512000,
    array['image/webp', 'image/jpeg', 'image/png']),
  ('content-drafts', 'content-drafts', false, 5242880,
    array['image/webp', 'image/jpeg', 'image/png', 'application/pdf']);

-- Initial editorial drafts, paraphrased from the supplied school handbook.
-- Nothing is published automatically; review before setting is_published=true.
insert into public.content_sections
  (slug, title, body, sort_order, source_document, source_pages)
values
  ('tentang-program', 'Belajar langsung di dunia industri',
   'Program PKL SMK IDN Bogor menjembatani pembelajaran sekolah dengan kebutuhan dunia industri. Siswa menerapkan kompetensi keahlian, mengembangkan keterampilan profesional, serta membangun disiplin, tanggung jawab, dan integritas.',
   10, 'Pedoman Pelaksanaan PKL SMK IDN Bogor Tahun Ajaran 2026/2027', '3'),
  ('bidang-keahlian', 'Tiga bidang keahlian',
   'Program mencakup Rekayasa Perangkat Lunak (RPL), Teknik Komputer Jaringan (TKJ), dan Desain Komunikasi Visual (DKV). Bidang perusahaan dan tugas PKL harus sesuai dengan kompetensi keahlian siswa.',
   20, 'Pedoman Pelaksanaan PKL SMK IDN Bogor Tahun Ajaran 2026/2027', '3–4'),
  ('tujuan-program', 'Kompetensi, karakter, dan kesiapan karier',
   'PKL memberikan pengalaman kerja nyata, mengembangkan keterampilan teknis dan sikap profesional, serta melatih kemandirian dan pemecahan masalah. Program juga membangun kerja sama sekolah dengan industri dan mempersiapkan siswa untuk bekerja atau berwirausaha.',
   30, 'Pedoman Pelaksanaan PKL SMK IDN Bogor Tahun Ajaran 2026/2027', '3–4'),
  ('jadwal-program', 'Jadwal tahun ajaran 2026/2027 — perlu konfirmasi',
   'Pedoman mencantumkan pencarian dan pengajuan tempat PKL pada Mei–Juni 2026 serta pelaksanaan pada Juni 2026–April 2027. Dokumen juga menyebut total durasi satu tahun penuh pada kelas XII dan kontrak minimal tiga bulan. Rentang bulan dan ketentuan satu tahun perlu dikonfirmasi sekolah sebelum konten jadwal diterbitkan.',
   40, 'Pedoman Pelaksanaan PKL SMK IDN Bogor Tahun Ajaran 2026/2027', '4'),
  ('pembimbingan', 'Didampingi sekolah dan industri',
   'Siswa berhak memperoleh pembimbingan dari sekolah dan industri, kontrak yang menjelaskan tugas, serta visitasi guru pembimbing minimal satu kali. Selama PKL, siswa wajib menjaga komunikasi aktif, mengikuti pertemuan daring pekanan dan evaluasi bulanan.',
   50, 'Pedoman Pelaksanaan PKL SMK IDN Bogor Tahun Ajaran 2026/2027', '5, 8'),
  ('pelaporan-dan-karya', 'Pengalaman yang menjadi karya',
   'Siswa menyusun jurnal pekanan dan laporan akhir yang dilengkapi dokumentasi serta disahkan pembimbing sekolah dan perwakilan industri. Tugas lain mencakup buku cerita PKL, buku tahunan, pembaruan portofolio, serta tugas pembinaan yang ditetapkan sekolah.',
   60, 'Pedoman Pelaksanaan PKL SMK IDN Bogor Tahun Ajaran 2026/2027', '7–8');

commit;
