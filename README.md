## Dashboard PKL

Dashboard overview pencapaian PKL, datanya diambil langsung dari Google Spreadsheet:
[Data Base PKL A8 2026](https://docs.google.com/spreadsheets/d/1OLl6dywYVx_I_I3sinI5MY-38VTrimp3WaEZ4cCWPJQ).

### Menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Cara kerja pengambilan data

- `app/api/sheet-data/route.ts` mengambil tab **Jonggol Ikhwan**, **Akhwat**, dan
  **Solo** langsung dari endpoint CSV publik Google Sheets (`gviz/tq`), tanpa API
  key — karena sheet ini di-share "siapa saja yang punya link". Setiap request selalu
  mengambil data terbaru (`no-store`), tidak ada cache di server.
- `lib/sheets.ts` mem-parsing baris mentah per siswa (nama, kelas, tempat PKL,
  gaji/uang saku, dsb) menjadi data terstruktur. `lib/aggregate.ts` menghitung
  semua rollup (per cabang, per jurusan, per kelas, per unit/perusahaan, per siswa).
- Di browser, `components/Dashboard.tsx` melakukan polling ke API tersebut setiap
  60 detik, plus revalidasi saat tab difokuskan lagi, dan ada tombol **Refresh**
  untuk memuat ulang seketika. Ini bukan push-realtime (websocket), tapi selalu
  menampilkan data terbaru dari spreadsheet dalam hitungan detik saat diminta.
- ID spreadsheet bisa diganti lewat env var `PKL_SPREADSHEET_ID` bila suatu saat
  sheet-nya dipindah/diduplikasi.

### Catatan tentang data sumber

- Kolom "Kelas" diisi manual dan formatnya tidak selalu konsisten (mis. "XII RPL"
  vs "12 RPL") — dashboard menampilkan apa adanya sesuai isi sheet.
- Nilai gaji/uang saku kadang berupa teks non-angka ("Estimated", "per project",
  dsb). Nilai seperti ini tidak dihitung ke Total Pendapatan, tapi jumlahnya
  ditampilkan di kartu "Penempatan Belum Ada Data Gaji" agar tidak menyesatkan.
- Total yang dihitung dashboard ini bisa sedikit berbeda dari tab "Ringkasan
  Magang" di spreadsheet — dashboard menghitung langsung dari seluruh baris siswa
  yang ada saat itu, sedangkan formula di tab ringkasan bisa saja belum mencakup
  baris yang baru ditambahkan.
