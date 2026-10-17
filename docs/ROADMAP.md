# Roadmap portal PKL

Dicatat dari arahan pengguna pada 17 Oktober 2026. Checklist di bawah adalah pekerjaan lanjutan, bukan klaim fitur sudah tersedia.

## 1. Konten dan media landing page

- [ ] Kumpulkan dokumentasi kegiatan asli, caption, dan informasi kegiatan.
- [ ] Kumpulkan logo serta profil perusahaan dari sumber yang benar.
- [ ] Kompres gambar, unggah materi siap tayang, dan hubungkan ke konten Supabase.
- [ ] Tinjau dan terbitkan profil perusahaan serta dokumentasi.
- [ ] Periksa galeri, logo, pencarian/filter perusahaan, dan tampilan ponsel dengan konten nyata.

Fondasi pembacaan konten terbit dan media sudah tersedia. Konten operasional siswa tetap berasal dari spreadsheet.

## 2. Penyelesaian fitur dashboard

- [ ] Manajemen wali kelas: data wali kelas, pemetaan kelas/siswa, dan pemantauan dampingan.
- [ ] Penilaian PKL: komponen penilaian, input/evaluasi, rekap dan finalisasi hasil.
- [ ] Sertifikat PKL: template, data penerima, penerbitan, dan unduh/cetak.
- [ ] Hubungkan fitur dengan akun dan hak akses sesuai peran.

Halaman wali kelas, penilaian, dan sertifikat saat ini berstatus **Masih dikembangkan**.

## 3. Akun dan manajemen peran

- [ ] Login dan pengelolaan akun.
- [ ] Identitas siswa yang stabil untuk menghubungkan akun web dengan baris spreadsheet; jangan hanya mengandalkan nama atau nomor urut yang berulang per kelas.
- [ ] Penetapan peran oleh pengelola berwenang, bukan pilihan bebas pengguna.
- [ ] Pembatasan data di server/API dan database, bukan hanya menyembunyikan menu.
- [ ] Pemetaan wali kelas ke kelas/siswa dampingan.
- [ ] Jurnal PKL siswa pada portal yang sama.
- [ ] Pengajuan/pembaruan penempatan oleh siswa pada portal yang sama.
- [ ] Riwayat perubahan serta mekanisme verifikasi pembaruan penempatan.

Peran yang diminta pengguna:

| Peran | Kebutuhan awal untuk dirinci |
| --- | --- |
| Koordinator PKL | Pengelolaan operasional dan pemantauan program |
| Atasan | Akses pemantauan dan laporan sesuai kewenangan |
| Wali kelas | Pemantauan dan tindak lanjut siswa dampingan |
| Siswa | Jurnal dan pembaruan penempatan miliknya sendiri |

Matriks izin detail (lihat, buat, edit, verifikasi, finalisasi, terbitkan) perlu ditetapkan sebelum implementasi. "Atasan" diperlakukan sebagai peran pemantauan yang terpisah, tanpa mengasumsikan kewenangan edit semua data.

### Ketentuan integrasi spreadsheet

Spreadsheet **tetap permanen sebagai sumber utama data operasional PKL**. Fitur penempatan di web tidak boleh menciptakan sumber data operasional kedua yang bersaing.

Rancangan lanjutan yang diusulkan: siswa mengajukan perubahan → validasi/peninjauan sesuai aturan sekolah → server memperbarui baris yang tepat melalui akses tulis Google Sheets → dashboard membaca kembali spreadsheet. Mekanisme persetujuan ini adalah usulan teknis, belum diimplementasikan atau ditetapkan pengguna.

Akses tulis Google Sheets belum tersedia dari endpoint CSV publik saat ini. Pengembangan perlu kredensial server, akses spreadsheet yang sesuai, identitas baris stabil, serta penanganan benturan dengan editor spreadsheet lain. Kredensial tidak dikirim ke browser.

Penyimpanan jurnal, akun, serta riwayat persetujuan perlu dirancang terpisah dari tabel konten yang sudah ada, dengan tetap mempertahankan peran spreadsheet. Jangan menambah tabel siswa/penempatan operasional sebagai pengganti spreadsheet tanpa arahan pengguna.

## 4. MoU

- [x] Tambahkan menu dan halaman MoU dengan status **Masih dikembangkan** (`/dashboard/mou`).
- [ ] Pencatatan nomor/judul MoU dan perusahaan terkait.
- [ ] Pengelolaan dokumen, tanggal mulai/akhir, dan status kerja sama.
- [ ] Pencarian/filter, peninjauan, dan unduh sesuai peran.
- [ ] Aturan akses dokumen MoU; dokumen yang belum ditetapkan untuk publik disimpan privat.

## Batas proyek yang tetap berlaku

- Paket layanan tetap gratis; jangan mengaktifkan upgrade/add-on berbayar otomatis.
- `.env.local` tetap diabaikan Git; kredensial tidak masuk source code.
- Supabase menyimpan konten/media saat ini. Penggunaan untuk akun/jurnal/dokumen adalah rencana berikutnya yang memerlukan skema dan kebijakan akses baru.
- Penambahan halaman placeholder bukan implementasi autentikasi, jurnal, penilaian, penerbitan sertifikat, atau pengelolaan MoU.

## Usulan urutan pengerjaan

Konten/media dapat diisi paralel dengan perancangan peran. Untuk fitur operasional: identitas dan akses → wali kelas → jurnal dan alur pembaruan penempatan → penilaian → sertifikat. Pengelolaan MoU dapat dilanjutkan setelah identitas perusahaan dan aturan akses dokumen disepakati.
