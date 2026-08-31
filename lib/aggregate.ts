import type { Student, UnitIncome } from "./types";

export type Overview = {
  totalSiswa: number;
  sudahDiterima: number;
  belumDiterima: number;
  persenDiterima: number;
  totalPendapatan: number;
  penempatanTanpaGaji: number;
};

export function computeOverview(students: Student[]): Overview {
  const totalSiswa = students.length;
  const sudahDiterima = students.filter((s) => s.diterima).length;
  const belumDiterima = totalSiswa - sudahDiterima;
  const totalPendapatan = students.reduce((sum, s) => sum + s.totalPendapatan, 0);
  const penempatanTanpaGaji = students.reduce((sum, s) => sum + s.pendapatanTidakTerbaca, 0);
  return {
    totalSiswa,
    sudahDiterima,
    belumDiterima,
    persenDiterima: totalSiswa > 0 ? (sudahDiterima / totalSiswa) * 100 : 0,
    totalPendapatan,
    penempatanTanpaGaji,
  };
}

export type Bucket = {
  key: string;
  totalSiswa: number;
  sudahDiterima: number;
  belumDiterima: number;
  persenDiterima: number;
  totalPendapatan: number;
};

export function aggregateBy(students: Student[], keyFn: (s: Student) => string): Bucket[] {
  const map = new Map<string, Student[]>();
  for (const s of students) {
    const key = keyFn(s);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }
  return Array.from(map.entries())
    .map(([key, group]) => {
      const sudahDiterima = group.filter((s) => s.diterima).length;
      return {
        key,
        totalSiswa: group.length,
        sudahDiterima,
        belumDiterima: group.length - sudahDiterima,
        persenDiterima: group.length > 0 ? (sudahDiterima / group.length) * 100 : 0,
        totalPendapatan: group.reduce((sum, s) => sum + s.totalPendapatan, 0),
      };
    })
    .sort((a, b) => b.totalSiswa - a.totalSiswa);
}

export function aggregateByUnit(students: Student[]): UnitIncome[] {
  const map = new Map<string, { total: number; students: Set<string>; count: number }>();
  for (const s of students) {
    for (const p of s.placements) {
      const key = p.namaPerusahaan;
      if (!map.has(key)) map.set(key, { total: 0, students: new Set(), count: 0 });
      const entry = map.get(key)!;
      entry.total += p.salaryAmount ?? 0;
      entry.students.add(s.nama + "|" + s.kelas);
      entry.count += 1;
    }
  }
  return Array.from(map.entries())
    .map(([namaPerusahaan, v]) => ({
      namaPerusahaan,
      totalPendapatan: v.total,
      jumlahSiswa: v.students.size,
      jumlahPenempatan: v.count,
    }))
    .sort((a, b) => b.totalPendapatan - a.totalPendapatan);
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1).replace(".", ",")}%`;
}
