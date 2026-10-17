# Setup Supabase untuk konten portal PKL

Panduan diperiksa pada 17 Oktober 2026. Setup ini memakai project baru pada paket Free. Tidak membuat atau mengubah akun Supabase secara otomatis.

## Batas arsitektur

- Google Spreadsheet yang sekarang tetap menjadi sumber utama seluruh data operasional PKL: siswa, kelas, status, penempatan, dan gaji. Tidak ada migrasi atau sinkronisasi tulis balik.
- Supabase menyimpan konten editorial: pengenalan program, profil perusahaan, dokumentasi, serta referensi media.
- Jumlah siswa dan penempatan perusahaan tetap dihitung dari spreadsheet. `companies.spreadsheet_aliases` hanya memetakan variasi nama perusahaan tanpa meminta editor spreadsheet mengganti namanya.
- Konten dikelola melalui Supabase Dashboard. Landing page `/` membaca konten terbit melalui REST API Supabase di server dengan publishable key dan cache 5 menit. Dashboard operasional berada di `/dashboard`. Belum ada halaman admin website atau login admin.

## 1. Buat akun dan project Free

1. Buka https://supabase.com/dashboard dan masuk/daftar.
2. Buat organization pada paket **Free**. Jika sudah punya organization berbayar, buat organization Free tersendiri untuk portal ini.
3. Pilih **New project**, nama misalnya `idn-pkl-content`.
4. Gunakan password database yang kuat dan simpan di password manager. Password ini tidak diperlukan di browser atau chat.
5. Pilih region yang dekat dengan pengguna Indonesia, misalnya Singapore jika tersedia.
6. Aktifkan Data API bila ada pilihan tersebut. Gunakan schema `public` untuk tabel konten ini.
7. Buat project dan tunggu siap. Pastikan halaman Billing/Subscription menampilkan Free; jangan aktifkan add-on atau upgrade berbayar.

Batas Free yang tercantum saat panduan disusun: database 500 MB, storage file 1 GB, 5 GB egress dan 5 GB cached egress. Project beraktivitas rendah dapat dijeda setelah tujuh hari. Ini bukan kapasitas atau jaminan layanan tak terbatas. Pantau Usage; jika mendekati kuota, kurangi/arsipkan konten atau batasi unggahan, jangan upgrade otomatis. Paket dan kebijakan dapat berubah.

## 2. Buat tabel, aturan akses, bucket, dan draf awal

1. Buka **SQL Editor → New query** pada project baru tadi.
2. Buka file repo `supabase/migrations/202610170001_content_foundation.sql`.
3. Salin seluruh isinya, tempel di SQL Editor, lalu klik **Run** satu kali.
4. Pastikan transaksi berhasil. File ini untuk project baru, bukan skrip yang dijalankan berulang pada database berisi data.

Hasilnya:

| Tabel | Isi |
| --- | --- |
| `content_sections` | Bagian konten program per tahun ajaran, urutan, rujukan halaman pedoman |
| `companies` | Profil dan logo perusahaan, alias nama dari spreadsheet |
| `documentation_posts` | Artikel/kegiatan/visitasi/cerita/karya, cabang, periode, tanggal, perusahaan |
| `documentation_images` | Path foto, teks alternatif, caption, urutan foto dalam artikel |

Semua konten dimulai sebagai **draf** (`is_published = false`). Pengunjung dan pengguna login hanya diberi akses baca baris terbit. Tidak ada izin upload atau perubahan konten melalui client website pada tahap ini. Memiliki akun login saja tidak menjadikan seseorang admin.

Terdapat enam draf pengenalan program yang diringkas dari pedoman. Tidak ada nama perusahaan, foto, logo, testimoni, atau pencapaian yang dibuat-buat.

## 3. Periksa storage dan unggah media

Skrip membuat dua bucket di **Storage**:

| Bucket | Akses | Batas per file | Kegunaan |
| --- | --- | --- | --- |
| `site-media` | Public | 512.000 byte (500 KiB) | Gambar yang sudah siap dipublikasikan |
| `content-drafts` | Private | 5 MiB | Draf gambar dan PDF rujukan |

- Format gambar yang diizinkan: WebP, JPEG, PNG. Bucket privat juga menerima PDF.
- Kompres foto sebelum upload, target maksimal 300 KB; logo idealnya di bawah 100 KB. Setup bucket membatasi ukuran, tetapi belum melakukan kompresi otomatis.
- Pakai nama file unik/versioned, misalnya `companies/nama-perusahaan/logo-v1.webp` atau `documentation/visitasi-2026/foto-01.webp`.
- Di dashboard Storage, pilih bucket → Upload. Simpan path relatif, bukan signed URL yang bisa kedaluwarsa, pada `logo_path` atau `media_path`.
- `documentation_images.media_path` dan `companies.logo_path` yang ditampilkan publik merujuk pada bucket `site-media`.
- Simpan PDF pedoman di `content-drafts` dulu apabila ingin mengunggahnya. Setup ini tidak mengunggah atau menerbitkan PDF.

**File di bucket public bisa diakses lewat URL meskipun baris kontennya masih draf.** Upload materi yang belum siap tayang ke bucket privat. Untuk publikasi, unggah salinan gambar yang telah disetujui ke `site-media`, isi path, baru terbitkan kontennya. Mengubah `is_published` menjadi false atau menghapus baris database tidak menghapus file storage; hapus/pindahkan file public juga bila perlu menariknya dari akses publik, dengan mempertimbangkan salinan cache.

Video menggunakan embed/tautan penyedia video, bukan upload ke bucket ini. Hindari menaruh file asli berukuran besar di storage publik.

## 4. Kelola konten lewat Table Editor

1. Buka `content_sections`, tinjau enam draf awal berdasarkan pedoman dan brief konten di `docs/PKL_CONTENT_BRIEF.md`.
2. Konfirmasi jadwal sebelum menerbitkan bagian `jadwal-program`: dokumen menyebut durasi satu tahun penuh tetapi rentang Juni 2026–April 2027.
3. Untuk perusahaan, tambahkan profil di `companies`; isi `spreadsheet_aliases` dengan nama persis yang dipakai spreadsheet. Logo harus berasal dari sumber yang benar.
4. Untuk galeri, buat `documentation_posts`, kemudian tambahkan `documentation_images` menggunakan `post_id` artikel tersebut. Urutan mengikuti `sort_order`.
5. Tinjau isi dan gambar, lalu set `is_published = true` pada konten yang siap tayang. Gambar mengikuti status terbit artikel induknya pada akses database.

Akses pengelola tahap awal memakai akun Supabase Dashboard. Bila ada pengelola tambahan, gunakan akun masing-masing dengan izin project yang sesuai, bukan berbagi password. Login admin website dan kebijakan tulis khusus admin akan dibuat pada tahap implementasi berikutnya.

## 5. Ambil Project URL dan publishable key

Di project, buka **Connect** untuk URL/kunci yang direkomendasikan, atau **Settings → API Keys** untuk melihat kunci. Di root repo, buat atau edit `.env.local` dan tambahkan dua baris berikut tanpa menimpa variabel yang sudah ada:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ISI_DARI_DASHBOARD
```

Biarkan `PKL_SPREADSHEET_ID` yang sudah ada tetap sama. Bila tidak diset, aplikasi saat ini memakai ID spreadsheet default dalam kode.

Publishable key memang dirancang untuk digunakan client; batas aksesnya ditentukan grants dan RLS. Jangan menaruh password database, secret key, atau `service_role` key pada variabel `NEXT_PUBLIC_*`, source code, atau chat. Setup pembacaan konten ini tidak memerlukan secret key.

`.env.local` sudah diabaikan Git oleh `.gitignore`. Landing page kini membaca dua variabel ini melalui modul `lib/public-content.ts`. Tidak memerlukan SDK atau secret key untuk pembacaan konten publik. Saat kelak deploy, tambahkan variabel yang sama pada konfigurasi hosting, lalu restart/redeploy aplikasi.

## 6. Verifikasi setup

Di Table Editor, pastikan ada enam draf pada `content_sections` dan tiga tabel lain masih kosong. Di Storage, pastikan ada dua bucket dengan tipe akses yang benar.

Jalankan pemeriksaan berikut di SQL Editor:

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('content_sections', 'companies', 'documentation_posts', 'documentation_images');

select role_name, table_name,
  has_table_privilege(role_name, 'public.' || table_name, 'SELECT') as can_select,
  has_table_privilege(role_name, 'public.' || table_name, 'INSERT') as can_insert,
  has_table_privilege(role_name, 'public.' || table_name, 'UPDATE') as can_update,
  has_table_privilege(role_name, 'public.' || table_name, 'DELETE') as can_delete
from (values ('anon'), ('authenticated')) r(role_name)
cross join (values ('content_sections'), ('companies'),
  ('documentation_posts'), ('documentation_images')) t(table_name);
```

Harapan: empat tabel memiliki `rowsecurity = true`; kedua role hanya memiliki SELECT. SQL Editor berjalan dengan hak pengelola, sehingga melihat draf di sana adalah normal.

Untuk memeriksa bahwa visitor tidak dapat membaca draf, saat seluruh konten masih draf jalankan query terpisah:

```sql
begin;
set local role anon;
select count(*) as publicly_visible_sections from public.content_sections;
rollback;
```

Hasil yang diharapkan: 0. Setelah satu draf diterbitkan, hasil menjadi 1. Ini pemeriksaan awal, bukan pengganti pengujian kebijakan seluruh operasi saat admin website dibuat.

## Tahap berikutnya

Landing page `/` sudah membaca konten terbit, profil perusahaan, serta 12 dokumentasi terbaru untuk tahun ajaran 2026/2027. Konten Supabase diperbarui melalui cache sekitar 5 menit setelah perubahan (revalidasi terjadi ketika halaman diakses). Jika tabel kosong, bagian perusahaan/dokumentasi menampilkan informasi belum tersedia. Pengantar program dasar tetap bersumber dari pedoman; draf Supabase tidak dibaca. Dashboard operasional tetap memakai spreadsheet, pada `/dashboard` dan subhalamannya. URL lama `/sebaran`, `/pendapatan`, `/peserta` dialihkan ke subhalaman dashboard yang sesuai. Kebijakan akses dashboard PKL tetap harus diimplementasikan tersendiri jika dashboard ingin dibatasi internal.

## Referensi resmi

- https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- https://supabase.com/docs/guides/getting-started/api-keys
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/storage/buckets/fundamentals
- https://supabase.com/pricing
- https://supabase.com/docs/guides/platform/free-project-pausing
