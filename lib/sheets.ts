import Papa from "papaparse";
import type { Placement, Student } from "./types";

const SPREADSHEET_ID =
  process.env.PKL_SPREADSHEET_ID ?? "1OLl6dywYVx_I_I3sinI5MY-38VTrimp3WaEZ4cCWPJQ";

// Branch (cabang) tabs. Each tab stacks multiple "kelas" blocks vertically,
// each with its own mini-header row, so parsing works off column position
// and per-row validity, not block boundaries.
const CABANG_TABS = ["Jonggol Ikhwan", "Akhwat", "Solo"];

const FIXED_COLS = {
  no: 0,
  nama: 1,
  cv: 2,
  portofolio: 3,
  kelas: 4,
  kontakSiswa: 5,
  sudahMulai: 6,
} as const;

const JURUSAN_PATTERNS: [RegExp, string][] = [
  [/RPL/i, "RPL"],
  [/TKJ/i, "TKJ"],
  [/DKV/i, "DKV"],
];

function gvizCsvUrl(sheetName: string) {
  const params = new URLSearchParams({ tqx: "out:csv", sheet: sheetName });
  return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?${params.toString()}`;
}

async function fetchCsvRows(sheetName: string): Promise<string[][]> {
  const res = await fetch(gvizCsvUrl(sheetName), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Gagal mengambil sheet "${sheetName}": HTTP ${res.status}`);
  }
  const text = await res.text();
  const parsed = Papa.parse<string[]>(text, { skipEmptyLines: false });
  return parsed.data;
}

function norm(v: string | undefined): string {
  return (v ?? "").trim();
}

function parseSalary(raw: string): number | null {
  const cleaned = norm(raw);
  if (!cleaned) return null;
  const digits = cleaned.replace(/[^\d]/g, "");
  if (digits.length < 3) return null;
  const amount = parseInt(digits, 10);
  return Number.isFinite(amount) ? amount : null;
}

function deriveJurusan(kelas: string): string {
  for (const [pattern, label] of JURUSAN_PATTERNS) {
    if (pattern.test(kelas)) return label;
  }
  return "Lainnya";
}

type TempatGroup = {
  namaPerusahaan: number;
  pimpinan: number;
  kontak: number;
  tanggalMulai: number;
  tanggalSelesai: number;
  alamat: number;
  salary: number;
  posisi: number;
};

function findTempatGroups(header: string[]): TempatGroup[] {
  const labels = header.map((h) => norm(h));
  const starts: number[] = [];
  for (let i = FIXED_COLS.sudahMulai + 1; i < labels.length; i++) {
    if (labels[i].includes("Nama Perusahaan")) starts.push(i);
  }

  const findInRange = (start: number, end: number, match: (label: string) => boolean) => {
    for (let i = start; i < end; i++) {
      if (match(labels[i])) return i;
    }
    return -1;
  };

  return starts.map((start, idx) => {
    const end = idx + 1 < starts.length ? starts[idx + 1] : labels.length;
    return {
      namaPerusahaan: start,
      pimpinan: findInRange(start + 1, end, (l) => l === "Pimpinan"),
      kontak: findInRange(start + 1, end, (l) => l === "Kontak"),
      tanggalMulai: findInRange(start + 1, end, (l) => l === "Tanggal Mulai"),
      tanggalSelesai: findInRange(start + 1, end, (l) => l === "Tanggal Selesai"),
      alamat: findInRange(start + 1, end, (l) => l === "Alamat"),
      salary: findInRange(start + 1, end, (l) => l.includes("Salary")),
      posisi: findInRange(start + 1, end, (l) => l === "Posisi"),
    };
  });
}

function cell(row: string[], index: number): string {
  if (index < 0 || index >= row.length) return "";
  return norm(row[index]);
}

function parseCabangTab(cabang: string, rows: string[][]): Student[] {
  if (rows.length === 0) return [];
  const groups = findTempatGroups(rows[0]);
  const students: Student[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    const noRaw = cell(row, FIXED_COLS.no);
    const nama = cell(row, FIXED_COLS.nama);
    if (!/^\d+$/.test(noRaw) || !nama) continue;

    const kelas = cell(row, FIXED_COLS.kelas) || "Tidak diketahui";
    const placements: Placement[] = [];

    groups.forEach((g, i) => {
      const namaPerusahaan = cell(row, g.namaPerusahaan);
      if (!namaPerusahaan || namaPerusahaan === "-") return;
      const salaryRaw = cell(row, g.salary);
      placements.push({
        slot: i + 1,
        namaPerusahaan,
        pimpinan: cell(row, g.pimpinan),
        kontak: cell(row, g.kontak),
        tanggalMulai: cell(row, g.tanggalMulai),
        tanggalSelesai: cell(row, g.tanggalSelesai),
        alamat: cell(row, g.alamat),
        posisi: cell(row, g.posisi),
        salaryRaw,
        salaryAmount: parseSalary(salaryRaw),
      });
    });

    const totalPendapatan = placements.reduce((sum, p) => sum + (p.salaryAmount ?? 0), 0);
    const pendapatanTidakTerbaca = placements.filter(
      (p) => p.salaryRaw && p.salaryAmount === null
    ).length;

    const sudahMulai = cell(row, FIXED_COLS.sudahMulai).toUpperCase() === "TRUE";

    students.push({
      cabang,
      kelas,
      jurusan: deriveJurusan(kelas),
      no: noRaw,
      nama,
      kontakSiswa: cell(row, FIXED_COLS.kontakSiswa),
      sudahMulai,
      // "Diterima" mengikuti checkbox "Sudah Mulai" di sheet, bukan apakah
      // kolom Nama Perusahaan sudah terisi -- ini definisi yang dipilih
      // sekolah, meski beberapa siswa "sudah mulai" belum punya data tempat PKL.
      diterima: sudahMulai,
      placements,
      totalPendapatan,
      pendapatanTidakTerbaca,
    });
  }

  return students;
}

export async function fetchAllStudents(): Promise<Student[]> {
  const results = await Promise.all(
    CABANG_TABS.map(async (cabang) => {
      const rows = await fetchCsvRows(cabang);
      return parseCabangTab(cabang, rows);
    })
  );
  return results.flat();
}
