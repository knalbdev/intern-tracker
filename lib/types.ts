export type Placement = {
  slot: number;
  namaPerusahaan: string;
  pimpinan: string;
  kontak: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  alamat: string;
  posisi: string;
  salaryRaw: string;
  salaryAmount: number | null;
};

export type Student = {
  cabang: string;
  kelas: string;
  jurusan: string;
  no: string;
  nama: string;
  kontakSiswa: string;
  sudahMulai: boolean;
  diterima: boolean;
  placements: Placement[];
  totalPendapatan: number;
  pendapatanTidakTerbaca: number;
};

export type Cabang = string;
export type Jurusan = string;

export type CountBucket = {
  key: string;
  totalSiswa: number;
  sudahDiterima: number;
  belumDiterima: number;
};

export type UnitIncome = {
  namaPerusahaan: string;
  totalPendapatan: number;
  jumlahSiswa: number;
  jumlahPenempatan: number;
};

export type DashboardData = {
  fetchedAt: string;
  spreadsheetTitle: string;
  students: Student[];
  cabangList: string[];
  jurusanList: string[];
  kelasList: string[];
};
