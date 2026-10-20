## Dashboard PKL

Dashboard overview pencapaian PKL, datanya diambil langsung dari Google Spreadsheet:
[Data Base PKL A8 2026](https://docs.google.com/spreadsheets/d/1OLl6dywYVx_I_I3sinI5MY-38VTrimp3WaEZ4cCWPJQ).

### Menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk landing page publik.

### Halaman portal

- `/`: program PKL, bidang keahlian, alur program, perusahaan, dokumentasi, dan FAQ.
- `/dashboard`: ringkasan operasional dari spreadsheet.
- `/dashboard/sebaran`, `/dashboard/pendapatan`, `/dashboard/peserta`: halaman dashboard dengan pencarian/filter masing-masing.
- URL lama `/sebaran`, `/pendapatan`, `/peserta` dialihkan ke subhalaman dashboard.

### Konten dan media publik

Landing page membaca konten **terbit** dari Supabase melalui REST API server dengan cache 5 menit. Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` dalam `.env.local` atau environment hosting. `.env.local` diabaikan Git. Tanpa konfigurasi atau saat layanan gagal, pengantar program dasar tetap tampil dan bagian dinamis menampilkan pesan ketersediaan.

Pengelolaan konten melalui Supabase Dashboard: `content_sections`, `companies`, `documentation_posts`, `documentation_images`. Media siap tayang berada di bucket `site-media`; gunakan path relatif dalam database. Konten awal SQL masih draf, dan baru dibaca setelah `is_published = true`. Profil perusahaan/galeri tidak diisi data fiktif. Batas dokumentasi landing page: 12 artikel terbaru tahun ajaran 2026/2027.

Lihat [setup Supabase](docs/SUPABASE_SETUP.md) dan [brief konten berdasarkan pedoman](docs/PKL_CONTENT_BRIEF.md). Data operasional PKL tetap permanen di spreadsheet. Pemindahan URL dashboard bukan penambahan autentikasi.

Pemeriksaan integrasi konten:

```bash
node --test tests/public-content.test.mjs
```

### Cara kerja pengambilan data

- `app/api/sheet-data/route.ts` mengambil tab **Jonggol Ikhwan**, **Akhwat**, dan
  **Solo** dari ekspor CSV asli Google Sheets (`export?format=csv&gid=...`), tanpa API
  key — karena sheet ini di-share "siapa saja yang punya link". Setiap request selalu
  mengambil data terbaru (`no-store`), tidak ada cache di server.
- `lib/sheets.ts` mem-parsing baris mentah per siswa (nama, kelas, tempat PKL,
  gaji/uang saku, dsb) menjadi data terstruktur. `lib/aggregate.ts` menghitung
  semua rollup (per cabang, per jurusan, per kelas, per unit/perusahaan, per siswa).
- Di browser, `components/Dashboard.tsx` melakukan polling ke API tersebut setiap
  15 detik, plus revalidasi saat tab difokuskan lagi, dan ada tombol **Refresh**
  untuk memuat ulang seketika. Ini bukan push-realtime (websocket), tapi selalu
  menampilkan data terbaru dari spreadsheet dalam hitungan detik saat diminta.
- ID spreadsheet bisa diganti lewat env var `PKL_SPREADSHEET_ID` bila suatu saat
  sheet-nya dipindah/diduplikasi. ID tab ditemukan berdasarkan nama tab melalui metadata publik.

### Catatan tentang data sumber

- Kolom "Kelas" diisi manual dan formatnya tidak selalu konsisten (mis. "XII RPL"
  vs "12 RPL") — dashboard menampilkan apa adanya sesuai isi sheet.
- Salary ditampilkan per penempatan. Nominal tunggal dalam format angka, mata uang, atau singkatan jelas dibaca sebagai angka. Rentang, tarif harian, estimasi, dan per project dipertahankan sebagai teks dan ditandai "Gaji perlu konfirmasi"; tidak diproyeksikan ke total. Kolom kosong/tanda `-` bukan unpaid; hanya nol atau pernyataan unpaid yang eksplisit bernilai nol.
- Unit dengan Salary terisi tetapi nama perusahaan kosong tetap masuk pembacaan pendapatan dengan label "Perusahaan belum diisi".
- Ekspor `gviz/tq` tidak dipakai karena dapat menghilangkan Salary teks pada kolom campuran angka/teks. Lihat [audit Salary 20 Oktober 2026](docs/SALARY_AUDIT_2026-10-20.md).
- Total yang dihitung dashboard ini bisa sedikit berbeda dari tab "Ringkasan
  Magang" di spreadsheet — dashboard menghitung langsung dari seluruh baris siswa
  yang ada saat itu, sedangkan formula di tab ringkasan bisa saja belum mencakup
  baris yang baru ditambahkan.
