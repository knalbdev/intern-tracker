"use client";

import { useMemo, useState } from "react";
import { buildCompanyDirectory } from "@/lib/company-directory";
import type { Student } from "@/lib/types";
import { StatCard } from "./StatCard";
import { SectionHeading } from "./SectionHeading";

export function CompanyDirectory({ students, query }: { students: Student[]; query: string }) {
  const [showAll, setShowAll] = useState(false);
  const companies = useMemo(() => buildCompanyDirectory(students, query), [students, query]);
  const participantCount = new Set(companies.flatMap((company) => company.placements.map(({ student }) => JSON.stringify([student.cabang, student.kelas, student.no, student.nama])))).size;
  const placementCount = companies.reduce((sum, company) => sum + company.placements.length, 0);

  return (
    <section className="space-y-4">
      <SectionHeading eyebrow="DUNIA USAHA & DUNIA INDUSTRI" title="Data DUDI & Mitra" />
      <p className="text-xs leading-relaxed text-slate-500">Data perusahaan dan riwayat penempatan bersumber dari spreadsheet. Jumlah peserta mengikuti filter cabang, jurusan, dan kelas. Nama perusahaan dengan perbedaan huruf besar/kecil atau spasi digabungkan.</p>
      <div className="grid gap-4 sm:grid-cols-3"><StatCard label="Perusahaan ditemukan" value={String(companies.length)} accent="green" /><StatCard label="Siswa ditempatkan" value={String(participantCount)} sub="Setiap siswa dihitung satu kali" /><StatCard label="Jumlah penempatan" value={String(placementCount)} sub="Termasuk beberapa penempatan per siswa" /></div>
      <p role="status" className="text-xs text-slate-500">Menampilkan {showAll ? companies.length : Math.min(10, companies.length)} dari {companies.length} perusahaan.</p>
      <div className="space-y-3">
        {(showAll ? companies : companies.slice(0, 10)).map((company) => {
          const addresses = [...new Set(company.placements.map(({ placement }) => placement.alamat).filter(Boolean))];
          return (
            <details key={company.key} className="rounded-xl bg-white ring-1 ring-[#e5eae3]">
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3 px-5 py-4">
                <span><strong className="text-sm font-semibold text-slate-800">{company.name}</strong><span className="mt-1 block text-xs text-slate-500">{company.branches.join(" · ")} / {company.majors.join(", ")}</span></span>
                <span className="flex items-center gap-3 text-xs"><span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{company.studentCount} siswa</span><span className="text-slate-500">{company.placements.length} penempatan</span><span aria-hidden="true">↓</span></span>
              </summary>
              <div className="border-t border-slate-100 p-5">
                <h3 className="text-xs font-semibold text-slate-700">Alamat tercatat</h3>
                {addresses.length ? <ul className="mt-2 space-y-1 text-xs leading-relaxed text-slate-500">{addresses.map((address) => <li className="whitespace-pre-line" key={address}>{address}</li>)}</ul> : <p className="mt-2 text-xs text-slate-400">Alamat belum diisi.</p>}
                <div className="mt-4 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-slate-500">{["Siswa", "Cabang / Kelas", "Posisi", "Pimpinan / PIC", "Kontak perusahaan", "Mulai", "Selesai"].map((label) => <th className="px-3 py-3" key={label}>{label}</th>)}</tr></thead><tbody>{company.placements.map(({ student, placement }, index) => <tr className="border-t border-slate-100" key={`${student.cabang}-${student.kelas}-${student.no}-${placement.slot}-${index}`}><td className="px-3 py-3 font-medium text-slate-700">{student.nama}</td><td className="px-3 py-3 text-slate-500">{student.cabang} / {student.kelas}</td><td className="px-3 py-3 text-slate-500">{placement.posisi || "—"}</td><td className="px-3 py-3 text-slate-500">{placement.pimpinan || "—"}</td><td className="px-3 py-3 text-slate-500">{placement.kontak || "—"}</td><td className="whitespace-nowrap px-3 py-3 text-slate-500">{placement.tanggalMulai || "—"}</td><td className="whitespace-nowrap px-3 py-3 text-slate-500">{placement.tanggalSelesai || "—"}</td></tr>)}</tbody></table></div>
              </div>
            </details>
          );
        })}
      </div>
      {!companies.length && <div className="rounded-xl border border-dashed border-emerald-200 bg-white px-5 py-10 text-center text-sm text-slate-500">Tidak ada perusahaan yang sesuai. Coba ubah pencarian atau filter.</div>}
      {companies.length > 10 && <button className="rounded-lg border border-emerald-200 px-4 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50" onClick={() => setShowAll(!showAll)}>{showAll ? "Tampilkan lebih sedikit" : `Tampilkan semua (${companies.length} perusahaan)`}</button>}
    </section>
  );
}
