"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Bucket } from "@/lib/aggregate";
import { formatPercent } from "@/lib/aggregate";
import { ink, status } from "@/lib/palette";
import { SectionHeading } from "./SectionHeading";

function StatusBarChart({ title, data }: { title: string; data: Bucket[] }) {
  const chartData = data.map((d) => ({
    name: d.key,
    "Sudah Diterima": d.sudahDiterima,
    "Belum Diterima": d.belumDiterima,
  }));

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <div className="mt-3 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24 }}>
            <CartesianGrid horizontal={false} stroke={ink.grid} />
            <XAxis type="number" tick={{ fontSize: 11, fill: ink.muted }} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fontSize: 12, fill: ink.secondary }}
            />
            <Tooltip
              cursor={{ fill: "rgba(79,70,229,0.05)" }}
              contentStyle={{
                fontSize: 12,
                borderRadius: 12,
                border: "none",
                boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
            <Bar
              dataKey="Sudah Diterima"
              stackId="a"
              fill={status.good}
              radius={[0, 0, 0, 0]}
              barSize={22}
            />
            <Bar
              dataKey="Belum Diterima"
              stackId="a"
              fill={status.warning}
              radius={[0, 6, 6, 0]}
              barSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DistributionSection({
  byCabang,
  byJurusan,
  byKelas,
}: {
  byCabang: Bucket[];
  byJurusan: Bucket[];
  byKelas: Bucket[];
}) {
  return (
    <section className="space-y-4">
      <SectionHeading eyebrow="Peserta" title="Sebaran PKL" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StatusBarChart title="Per Cabang" data={byCabang} />
        <StatusBarChart title="Per Jurusan" data={byJurusan} />
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
        <h3 className="border-b border-slate-100 px-5 py-3.5 text-sm font-semibold text-slate-700">
          Per Kelas
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-2.5 font-semibold">Kelas</th>
                <th className="px-5 py-2.5 text-right font-semibold">Total</th>
                <th className="px-5 py-2.5 text-right font-semibold">Diterima</th>
                <th className="px-5 py-2.5 text-right font-semibold">Belum</th>
                <th className="px-5 py-2.5 text-right font-semibold">% Diterima</th>
              </tr>
            </thead>
            <tbody>
              {byKelas.map((row) => (
                <tr key={row.key} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                  <td className="px-5 py-2.5 font-medium text-slate-800">{row.key}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums text-slate-600">{row.totalSiswa}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums text-emerald-600">
                    {row.sudahDiterima}
                  </td>
                  <td className="px-5 py-2.5 text-right tabular-nums text-amber-600">
                    {row.belumDiterima}
                  </td>
                  <td className="px-5 py-2.5 text-right tabular-nums text-slate-600">
                    {formatPercent(row.persenDiterima)}
                  </td>
                </tr>
              ))}
              {byKelas.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    Tidak ada data untuk filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
