"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/aggregate";
import { qualifyingSalaryPlacements, studentsAtSalaryTarget } from "@/lib/income-target";
import type { Student } from "@/lib/types";
import { SectionHeading } from "./SectionHeading";
import { StatCard } from "./StatCard";

export function SalaryAchievement({ students }: { students: Student[] }) {
  const [showAll, setShowAll] = useState(false);
  const qualified = studentsAtSalaryTarget(students);
  const placementCount = qualified.reduce((sum, student) => sum + qualifyingSalaryPlacements(student).length, 0);

  return (
    <section className="space-y-4">
      <SectionHeading eyebrow="TARGET GAJI PKL" title="Gaji minimal Rp2 juta" />
      <p className="text-xs leading-relaxed text-slate-500">Siswa dengan setidaknya satu penempatan bergaji tercatat minimal Rp2.000.000. Nilai gaji antarpenempatan tidak dijumlahkan untuk menentukan kelulusan target. Daftar mencakup seluruh riwayat penempatan yang tercatat, bukan hanya penempatan aktif.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Siswa memenuhi target gaji" value={String(qualified.length)} sub="Sesuai pencarian dan filter aktif" accent="green" />
        <StatCard label="Penempatan bergaji ≥ Rp2 juta" value={String(placementCount)} sub="Satu siswa dapat memiliki beberapa penempatan" accent="green" />
      </div>
      <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-[#e5eae3]">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500"><th className="px-5 py-3">No.</th><th className="px-5 py-3">Nama siswa</th><th className="px-5 py-3">Cabang</th><th className="px-5 py-3">Kelas / Jurusan</th><th className="px-5 py-3">Perusahaan dan gaji yang memenuhi target</th></tr></thead>
          <tbody>
            {(showAll ? qualified : qualified.slice(0, 15)).map((student, index) => (
              <tr key={`${student.cabang}-${student.kelas}-${student.no}-${student.nama}`} className="border-t border-slate-100 hover:bg-emerald-50/40">
                <td className="px-5 py-3 text-slate-500">{index + 1}</td>
                <td className="px-5 py-3 font-medium text-slate-800">{student.nama}</td>
                <td className="px-5 py-3 text-slate-500">{student.cabang}</td>
                <td className="px-5 py-3 text-slate-500">{student.kelas} / {student.jurusan}</td>
                <td className="px-5 py-3"><ul className="space-y-2">{qualifyingSalaryPlacements(student).map((placement) => <li key={placement.slot} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1"><span className="text-slate-600">{placement.namaPerusahaan}</span><strong className="whitespace-nowrap font-semibold tabular-nums text-emerald-800">{formatRupiah(placement.salaryAmount!)}</strong></li>)}</ul></td>
              </tr>
            ))}
            {qualified.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">Belum ada siswa yang memenuhi target gaji pada pilihan ini.</td></tr>}
          </tbody>
        </table>
      </div>
      {qualified.length > 15 && <button className="rounded-lg border border-emerald-200 px-4 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50" onClick={() => setShowAll(!showAll)}>{showAll ? "Tampilkan lebih sedikit" : `Tampilkan semua (${qualified.length} siswa)`}</button>}
    </section>
  );
}
