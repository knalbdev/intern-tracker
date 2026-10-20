import type { Placement } from "@/lib/types";
import { formatRupiah } from "@/lib/aggregate";
import { isSalaryMissing } from "@/lib/sheet-parser";

export function PlacementSalary({ placements }: { placements: Placement[] }) {
  if (!placements.length) return <span className="text-slate-400">Belum ada penempatan</span>;
  return <ul className="min-w-52 space-y-3">{placements.map((placement) => {
    const missing = isSalaryMissing(placement.salaryRaw);
    const unresolved = !missing && placement.salaryAmount === null;
    return <li key={placement.slot}>
      <span className="block text-xs font-medium text-slate-600">Tempat {placement.slot}: {placement.namaPerusahaan}</span>
      <span className={`mt-1 block whitespace-pre-line text-xs ${unresolved ? "text-amber-700" : placement.salaryAmount !== null && placement.salaryAmount > 0 ? "text-emerald-700" : "text-slate-500"}`}>
        {missing ? "Belum ada data gaji" : placement.salaryRaw}
      </span>
      {placement.salaryCell && <span className="mt-1 block text-[10px] text-slate-400">Sumber: Salary {placement.salaryCell}</span>}
      {unresolved && <span className="mt-1 block text-[10px] text-amber-600">Nominal/periode perlu konfirmasi; belum dihitung ke total.</span>}
      {!missing && placement.salaryAmount === 0 && <span className="mt-1 block text-[10px] text-slate-400">Tanpa gaji / Rp0 sesuai isi Salary.</span>}
      {placement.salaryAmount !== null && placement.salaryAmount > 0 && <span className="mt-1 block text-[10px] text-slate-400">Terbaca: {formatRupiah(placement.salaryAmount)}</span>}
    </li>;
  })}</ul>;
}
