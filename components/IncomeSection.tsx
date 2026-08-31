"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Bucket } from "@/lib/aggregate";
import { formatRupiah } from "@/lib/aggregate";
import { categorical, ink } from "@/lib/palette";
import type { Student, UnitIncome } from "@/lib/types";
import { StatCard } from "./StatCard";
import { SectionHeading } from "./SectionHeading";
import { IconAlert, IconWallet } from "./icons";

function compactRupiah(n: number): string {
  if (n >= 1_000_000_000) return `Rp${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000) return `Rp${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `Rp${(n / 1_000).toFixed(0)}rb`;
  return formatRupiah(n);
}

function IncomeBarChart({ title, data }: { title: string; data: Bucket[] }) {
  const chartData = data
    .map((d) => ({ name: d.key, pendapatan: d.totalPendapatan }))
    .sort((a, b) => b.pendapatan - a.pendapatan);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <div className="mt-3 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 32 }}>
            <CartesianGrid horizontal={false} stroke={ink.grid} />
            <XAxis
              type="number"
              tickFormatter={compactRupiah}
              tick={{ fontSize: 11, fill: ink.muted }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fontSize: 12, fill: ink.secondary }}
            />
            <Tooltip
              cursor={{ fill: "rgba(79,70,229,0.05)" }}
              formatter={(v) => [formatRupiah(Number(v)), "Pendapatan"]}
              contentStyle={{
                fontSize: 12,
                borderRadius: 12,
                border: "none",
                boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
              }}
            />
            <Bar dataKey="pendapatan" fill={categorical.blue} radius={[0, 6, 6, 0]} barSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function UnitTable({ units }: { units: UnitIncome[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? units : units.slice(0, 10);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
      <h3 className="border-b border-slate-100 px-5 py-3.5 text-sm font-semibold text-slate-700">
        Per Unit / Perusahaan
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-2.5">Perusahaan</th>
              <th className="px-5 py-2.5 text-right">Siswa</th>
              <th className="px-5 py-2.5 text-right">Penempatan</th>
              <th className="px-5 py-2.5 text-right">Total Pendapatan</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((u) => (
              <tr key={u.namaPerusahaan} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                <td className="px-5 py-2.5 font-medium text-slate-800">{u.namaPerusahaan}</td>
                <td className="px-5 py-2.5 text-right tabular-nums text-slate-600">{u.jumlahSiswa}</td>
                <td className="px-5 py-2.5 text-right tabular-nums text-slate-600">{u.jumlahPenempatan}</td>
                <td className="px-5 py-2.5 text-right tabular-nums font-semibold text-slate-800">
                  {u.totalPendapatan > 0 ? formatRupiah(u.totalPendapatan) : "-"}
                </td>
              </tr>
            ))}
            {units.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                  Tidak ada data untuk filter ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {units.length > 10 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="w-full border-t border-slate-100 py-2.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
        >
          {showAll ? "Tampilkan lebih sedikit" : `Tampilkan semua (${units.length})`}
        </button>
      )}
    </div>
  );
}

function StudentIncomeTable({ students }: { students: Student[] }) {
  const [showAll, setShowAll] = useState(false);
  const sorted = useMemo(
    () => [...students].sort((a, b) => b.totalPendapatan - a.totalPendapatan),
    [students]
  );
  const visible = showAll ? sorted : sorted.slice(0, 10);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
      <h3 className="border-b border-slate-100 px-5 py-3.5 text-sm font-semibold text-slate-700">
        Per Siswa
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-5 py-2.5">Nama</th>
              <th className="px-5 py-2.5">Cabang</th>
              <th className="px-5 py-2.5">Jurusan</th>
              <th className="px-5 py-2.5">Kelas</th>
              <th className="px-5 py-2.5 text-right">Pendapatan</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => (
              <tr
                key={`${s.cabang}-${s.kelas}-${s.no}-${s.nama}`}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
              >
                <td className="px-5 py-2.5 font-medium text-slate-800">{s.nama}</td>
                <td className="px-5 py-2.5 text-slate-500">{s.cabang}</td>
                <td className="px-5 py-2.5 text-slate-500">{s.jurusan}</td>
                <td className="px-5 py-2.5 text-slate-500">{s.kelas}</td>
                <td className="px-5 py-2.5 text-right tabular-nums font-semibold text-slate-800">
                  {s.totalPendapatan > 0 ? formatRupiah(s.totalPendapatan) : "-"}
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                  Tidak ada data untuk filter ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {sorted.length > 10 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="w-full border-t border-slate-100 py-2.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
        >
          {showAll ? "Tampilkan lebih sedikit" : `Tampilkan semua (${sorted.length})`}
        </button>
      )}
    </div>
  );
}

export function IncomeSection({
  students,
  byJurusan,
  byCabang,
  units,
  total,
  penempatanTanpaGaji,
}: {
  students: Student[];
  byJurusan: Bucket[];
  byCabang: Bucket[];
  units: UnitIncome[];
  total: number;
  penempatanTanpaGaji: number;
}) {
  return (
    <section className="space-y-4">
      <SectionHeading eyebrow="Uang Saku" title="Pendapatan" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Total Pendapatan Keseluruhan"
          value={formatRupiah(total)}
          accent="blue"
          icon={<IconWallet />}
        />
        <StatCard
          label="Penempatan Belum Ada Data Gaji"
          value={String(penempatanTanpaGaji)}
          sub="tercatat teks non-angka pada kolom Salary"
          accent="amber"
          icon={<IconAlert />}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <IncomeBarChart title="Per Jurusan" data={byJurusan} />
        <IncomeBarChart title="Per Cabang" data={byCabang} />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <UnitTable units={units} />
        <StudentIncomeTable students={students} />
      </div>
    </section>
  );
}
