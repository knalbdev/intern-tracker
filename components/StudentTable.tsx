"use client";

import { useMemo, useState } from "react";
import type { Student } from "@/lib/types";
import { SectionHeading } from "./SectionHeading";

const PAGE_SIZE = 15;

export function StudentTable({ students }: { students: Student[] }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const visible = useMemo(
    () => students.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [students, page]
  );

  if (page >= pageCount) setPage(0);

  return (
    <section className="space-y-3">
      <SectionHeading
        eyebrow={`${students.length} peserta`}
        title="Detail Peserta"
        action={
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-lg px-2.5 py-1.5 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span>
              {students.length === 0 ? 0 : page + 1} / {pageCount}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page >= pageCount - 1}
              className="rounded-lg px-2.5 py-1.5 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        }
      />
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-2.5">Nama</th>
                <th className="px-5 py-2.5">Cabang</th>
                <th className="px-5 py-2.5">Kelas</th>
                <th className="px-5 py-2.5">Jurusan</th>
                <th className="px-5 py-2.5">Status</th>
                <th className="px-5 py-2.5">Tempat PKL</th>
                <th className="px-5 py-2.5">Posisi</th>
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
                  <td className="px-5 py-2.5 text-slate-500">{s.kelas}</td>
                  <td className="px-5 py-2.5 text-slate-500">{s.jurusan}</td>
                  <td className="px-5 py-2.5">
                    {s.diterima ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                        Diterima
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
                        Belum
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-2.5 text-slate-600">
                    {s.placements.map((p) => p.namaPerusahaan).join(", ") || "-"}
                  </td>
                  <td className="px-5 py-2.5 text-slate-600">
                    {s.placements.map((p) => p.posisi).filter(Boolean).join(", ") || "-"}
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
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
