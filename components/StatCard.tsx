import type { ReactNode } from "react";

const ACCENTS = {
  slate: "bg-slate-100 text-slate-600",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-teal-50 text-teal-700",
} as const;

export function StatCard({ label, value, sub, icon, accent = "slate" }: {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  accent?: keyof typeof ACCENTS;
}) {
  return (
    <div className={`stat-card stat-${accent}`}>
      <div className="flex items-center justify-between gap-2"><span className="text-xs font-medium text-slate-500">{label}</span>{icon && <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base ${ACCENTS[accent]}`}>{icon}</span>}</div>
      <div className="stat-value">{value}</div>
      {sub && <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{sub}</p>}
    </div>
  );
}
