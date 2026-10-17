"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/aggregate";
import { PKL_INCOME_TARGET, rankByIncome, studentsAtIncomeTarget } from "@/lib/income-target";
import type { Student } from "@/lib/types";
import { SectionHeading } from "./SectionHeading";
import { StatCard } from "./StatCard";

function IncomeTable({ students }: { students: Student[] }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-[#e5eae3]">
      <table className="w-full text-sm">
        <thead><tr className="text-left text-slate-500"><th className="px-5 py-3">No.</th><th className="px-5 py-3">Nama siswa</th><th className="px-5 py-3">Cabang</th><th className="px-5 py-3">Kelas / Jurusan</th><th className="px-5 py-3 text-right">Pendapatan tercatat</th><th className="px-5 py-3 text-right">Target Rp20 juta</th></tr></thead>
        <tbody>{students.map((student, index) => (
          <tr key={`${student.cabang}-${student.kelas}-${student.no}-${student.nama}`} className="border-t border-slate-100 hover:bg-emerald-50/40">
            <td className="px-5 py-3"><span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg font-semibold ${index < 3 ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-500"}`}>{index + 1}</span></td>
            <td className="px-5 py-3 font-medium text-slate-800">{student.nama}</td>
            <td className="px-5 py-3 text-slate-500">{student.cabang}</td>
            <td className="px-5 py-3 text-slate-500">{student.kelas} / {student.jurusan}</td>
            <td className="whitespace-nowrap px-5 py-3 text-right font-semibold tabular-nums text-emerald-800">{formatRupiah(student.totalPendapatan)}</td>
            <td className="whitespace-nowrap px-5 py-3 text-right"><span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${student.totalPendapatan >= PKL_INCOME_TARGET ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{student.totalPendapatan >= PKL_INCOME_TARGET ? "Tercapai" : "Belum tercapai"}</span></td>
          </tr>
        ))}{students.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-500">Belum ada pendapatan tercatat yang memenuhi kriteria.</td></tr>}</tbody>
      </table>
    </div>
  );
}

export function IncomeLeaderboard({ students }: { students: Student[] }) {
  const topTen = rankByIncome(students).slice(0, 10);
  return (
    <section className="space-y-4" aria-label="Klasemen pendapatan seluruh cabang">
      <SectionHeading eyebrow="TOP 10 · SELURUH CABANG" title="Klasemen pendapatan tertinggi" />
      <p className="text-xs leading-relaxed text-slate-500">Peringkat lintas seluruh cabang, tidak dipengaruhi pencarian atau filter Ringkasan. Nilai sama diurutkan berdasarkan nama.</p>
      <IncomeTable students={topTen} />
    </section>
  );
}

export function IncomeAchievement({ students }: { students: Student[] }) {
  const [showAll, setShowAll] = useState(false);
  const qualified = studentsAtIncomeTarget(students);
  return (
    <section className="space-y-4">
      <SectionHeading eyebrow="TARGET PENDAPATAN PKL" title="Pendapatan minimal Rp20 juta" />
      <p className="text-xs leading-relaxed text-slate-500">Berdasarkan akumulasi nilai pendapatan yang tercatat di spreadsheet, tanpa proyeksi durasi. Pendapatan tepat Rp20.000.000 termasuk mencapai target.</p>
      <div className="grid gap-4 sm:grid-cols-2"><StatCard label="Siswa mencapai target" value={String(qualified.length)} sub="Sesuai pencarian dan filter aktif" accent="green" /><StatCard label="Total pendapatan siswa yang mencapai target" value={formatRupiah(qualified.reduce((sum, student) => sum + student.totalPendapatan, 0))} accent="green" /></div>
      <IncomeTable students={showAll ? qualified : qualified.slice(0, 15)} />
      {qualified.length > 15 && <button className="rounded-lg border border-emerald-200 px-4 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50" onClick={() => setShowAll(!showAll)}>{showAll ? "Tampilkan lebih sedikit" : `Tampilkan semua (${qualified.length} siswa)`}</button>}
    </section>
  );
}
