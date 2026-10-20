# Audit Salary spreadsheet dan dashboard — 20 Oktober 2026

Snapshot diambil sekitar 22:12 WIB. Audit membandingkan ekspor XLSX asli Google Sheets, ekspor CSV asli per tab, CSV `gviz/tq` yang digunakan kode lama, serta API website `intern-tracker-kappa.vercel.app/api/sheet-data`. Berkas mentah berisi data siswa hanya disimpan di folder sementara, tidak ditambahkan ke Git.

## Hasil pencocokan

- 215 siswa: 146 Jonggol Ikhwan, 42 Akhwat, 27 Solo.
- Kolom Salary diperiksa pada semua unit: Jonggol Ikhwan O/AB; Akhwat O/AA/AM; Solo O/AA, mengikuti header setiap blok kelas.
- 175 sel Salary terisi pada baris siswa dicocokkan dengan ekspor XLSX. Nilai CSV asli konsisten dengan sumber setelah memperhitungkan format tampilan angka/mata uang.
- 27 nominal positif pada penempatan bernama hilang melalui ekspor `gviz/tq`, total Rp45.495.000.
- Dua nominal tambahan (Rp14.945.000 dan Rp1.000.000) berada pada unit yang nama perusahaannya belum diisi. Kode lama melewatkan seluruh unit itu, sehingga Rp15.945.000 juga tidak dihitung.
- Dengan perbaikan, 29 nominal positif yang sebelumnya tidak dihitung dipulihkan; selisih Rp61.440.000. Sebanyak 27 siswa yang sebelumnya memiliki total terbaca nol kini memiliki nominal positif.

## Perbandingan total nominal Salary yang dapat dibaca

| Cabang | API lama yang tayang | Parser baru / CSV asli | Selisih |
| --- | ---: | ---: | ---: |
| Jonggol Ikhwan | Rp165.457.982 | Rp181.452.982 | Rp15.995.000 |
| Akhwat | Rp55.060.000 | Rp96.505.000 | Rp41.445.000 |
| Solo | Rp24.700.000 | Rp28.700.000 | Rp4.000.000 |
| Total | Rp245.217.982 | Rp306.657.982 | Rp61.440.000 |

Total ini menjumlahkan nominal tunggal pada kolom Salary, bukan verifikasi transfer uang atau pendapatan kumulatif berdasarkan durasi PKL. Spreadsheet dapat berubah setelah snapshot.

## Contoh lokasi yang dapat diperiksa langsung

| Tab / sel | Isi sumber | API lama | Penanganan baru |
| --- | --- | --- | --- |
| Jonggol Ikhwan O214 | `Rp. 2.250.000` | Kosong/null | Rp2.250.000 |
| Jonggol Ikhwan O216 | `RP1.500.000` | Kosong/null | Rp1.500.000 |
| Akhwat O6 | `Rp.1.000.000` | Kosong/null | Rp1.000.000 |
| Solo O11 | `Rp.2.000.000` | Kosong/null | Rp2.000.000 |
| Akhwat AA14 | `Rp14.945.000` | Unit tidak dimuat karena nama perusahaan kosong | Dipertahankan dengan label perusahaan belum diisi |
| Akhwat O25 | `Rp.1.000.000` | Unit tidak dimuat karena nama perusahaan kosong | Dipertahankan dengan label perusahaan belum diisi |
| Jonggol Ikhwan O215 | `Rp2.000.000 - Rp3.000.000` | Kosong/null | Teks sumber dipertahankan; perlu konfirmasi |

## Penyebab

1. Endpoint `gviz/tq` menginferensikan tipe kolom. Saat nilai angka dan teks bercampur, sejumlah isi teks Salary menjadi kosong meskipun sumber berisi nominal yang valid. Pengujian langsung terhadap XLSX dan CSV asli mereproduksi kehilangan ini.
2. Parser sebelumnya menghapus semua karakter selain digit. Bila rentang atau beberapa nominal sampai ke parser, nilainya berisiko digabung menjadi angka keliru. `Rp0` juga tidak dikenali karena digitnya kurang dari tiga.
3. Unit tanpa nama perusahaan dilewatkan sebelum Salary diproses.
4. Kolom kosong, tanda `-`, tarif harian, dan estimasi tidak sama dengan pernyataan unpaid. Pada kode lokal yang diaudit tidak ada label literal `unpaid` yang dibuat UI; kehilangan angka tetap terbukti pada API website.

## Perbaikan kode

- Membaca ekspor CSV asli menggunakan gid yang ditemukan berdasarkan nama tab; tidak mengubah spreadsheet atau meminta API key Google.
- Membaca header setiap blok kelas agar pemetaan Salary ke unit yang tepat dipertahankan.
- Menerima nominal mata uang/angka tunggal dan singkatan jelas (misalnya `2 juta`).
- Tidak mengubah rentang, tarif harian, pembayaran per project, estimasi, atau narasi bertahap menjadi angka tunggal. Pada snapshot terdapat 31 penempatan dengan teks yang memerlukan konfirmasi, semuanya di Jonggol Ikhwan.
- Mengenali `Unpaid` atau Rp0 sebagai nol eksplisit; kolom kosong/tanda `-` tetap belum ada data.
- Mempertahankan Salary pada unit tanpa nama perusahaan. Unit seperti ini masuk total siswa dan bucket perusahaan belum diisi, tetapi tidak dibuat seolah-olah sebuah perusahaan nyata di direktori DUDI.
- Menampilkan Salary asli per unit pada Data Peserta dan tabel pendapatan siswa, termasuk penanda perlu konfirmasi.

## Validasi

API lokal hasil perbaikan diuji langsung dengan pembacaan ulang spreadsheet pada sekitar 22:22 WIB: HTTP 200, 215 siswa, 175 sel Salary terisi, total Rp306.657.982, dan **0 perbedaan** terhadap snapshot CSV asli untuk nominal serta teks Salary. Alamat sel sumber juga disertakan pada data penempatan.

Pengujian regresi meliputi format mata uang campuran, nol/unpaid, rentang/harian/project/estimasi, beberapa unit, pergantian layout header kelas, metadata tab, dan nominal tanpa nama perusahaan. Audit CSV/XLSX memakai snapshot penuh; fixture tes di repo memakai data sintetis tanpa data pribadi siswa.

Perbaikan lokal belum mengubah website yang tayang sampai kode di-deploy. Tidak ada isi spreadsheet yang diubah oleh audit ini.
