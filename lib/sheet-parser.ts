import type { Placement, Student } from "./types";

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

function norm(v: string | undefined): string {
  return (v ?? "").trim();
}

export function isSalaryMissing(raw: string): boolean {
  return /^(?:[-–—]|n\/?a)?$/i.test(norm(raw));
}

// Only one unambiguous amount (optionally monthly) belongs in numeric totals.
// Keep ranges, daily rates, estimates and project/staged payments as source text.
export function parseSalary(raw: string): number | null {
  const value = norm(raw);
  if (isSalaryMissing(value)) return null;
  if (/^(?:unpaid|tanpa\s+gaji|tidak\s+digaji|tidak\s+dibayar)$/i.test(value)) return 0;
  const cleaned = value.toLowerCase().replace(/^rp\.?\s*/, "")
    .replace(/\s*(?:\/\s*(?:bulan|bln|month)|per\s+(?:bulan|month))$/i, "")
    .replace(/,[-–]$/, "").trim();
  const short = cleaned.match(/^(\d+(?:[.,]\d{1,2})?)\s*(jt|juta|rb|ribu|k)$/i);
  if (short) {
    const amount = Number(short[1].replace(",", ".")) * (/^(jt|juta)$/.test(short[2]) ? 1_000_000 : 1_000);
    return Number.isSafeInteger(amount) && amount >= 0 ? amount : null;
  }
  let amount: number;
  if (/^\d{1,3}(?:\.\d{3})+(?:,00)?$/.test(cleaned)) {
    amount = Number(cleaned.replace(/,00$/, "").replace(/\./g, ""));
  } else if (/^\d{1,3}(?:,\d{3})+(?:\.00)?$/.test(cleaned)) {
    amount = Number(cleaned.replace(/\.00$/, "").replace(/,/g, ""));
  } else if (/^\d+(?:[.,]0{1,2})?$/.test(cleaned)) {
    amount = Number(cleaned.replace(",", "."));
  } else return null;
  return Number.isSafeInteger(amount) && amount >= 0 ? amount : null;
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
    if (/nama\s+perusahaan/i.test(labels[i])) starts.push(i);
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
      salary: findInRange(start + 1, end, (l) => /salary/i.test(l)),
      posisi: findInRange(start + 1, end, (l) => l === "Posisi"),
    };
  });
}

function cell(row: string[], index: number): string {
  if (index < 0 || index >= row.length) return "";
  return norm(row[index]);
}

function columnLetter(index: number): string {
  let value = index + 1;
  let label = "";
  while (value > 0) {
    value--;
    label = String.fromCharCode(65 + value % 26) + label;
    value = Math.floor(value / 26);
  }
  return label;
}

export function parseCabangTab(cabang: string, rows: string[][]): Student[] {
  if (rows.length === 0) return [];
  let groups: TempatGroup[] = [];
  const students: Student[] = [];

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    const headerGroups = findTempatGroups(row);
    if (headerGroups.some((group) => group.salary >= 0)) {
      groups = headerGroups;
      continue;
    }
    const noRaw = cell(row, FIXED_COLS.no);
    const nama = cell(row, FIXED_COLS.nama);
    if (!/^\d+$/.test(noRaw) || !nama) continue;

    const kelas = cell(row, FIXED_COLS.kelas) || "Tidak diketahui";
    const placements: Placement[] = [];

    groups.forEach((g, i) => {
      const companyName = cell(row, g.namaPerusahaan);
      const salaryRaw = cell(row, g.salary);
      const companyNameMissing = !companyName || companyName === "-";
      if (companyNameMissing && isSalaryMissing(salaryRaw)) return;
      const namaPerusahaan = companyNameMissing ? "Perusahaan belum diisi" : companyName;
      placements.push({
        slot: i + 1,
        namaPerusahaan,
        ...(companyNameMissing ? { companyNameMissing: true } : {}),
        pimpinan: cell(row, g.pimpinan),
        kontak: cell(row, g.kontak),
        tanggalMulai: cell(row, g.tanggalMulai),
        tanggalSelesai: cell(row, g.tanggalSelesai),
        alamat: cell(row, g.alamat),
        posisi: cell(row, g.posisi),
        salaryRaw,
        ...(g.salary >= 0 ? { salaryCell: `${columnLetter(g.salary)}${r + 1}` } : {}),
        salaryAmount: parseSalary(salaryRaw),
      });
    });

    const totalPendapatan = placements.reduce((sum, p) => sum + (p.salaryAmount ?? 0), 0);
    const pendapatanTidakTerbaca = placements.filter(
      (p) => !isSalaryMissing(p.salaryRaw) && p.salaryAmount === null
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


export function extractSheetTabs(html: string): Map<string, string> {
  const tabs = new Map<string, string>();
  const pattern = /items\.push\(\{name:\s*("(?:\\.|[^"\\])*"),[^}]*?gid:\s*"(\d+)"/g;
  for (const match of html.matchAll(pattern)) {
    try { tabs.set(JSON.parse(match[1]), match[2]); } catch { /* Ignore malformed metadata. */ }
  }
  return tabs;
}
