import type { ReactNode } from "react";

const ACCENTS = {
  slate: { chip: "bg-slate-100 text-slate-600", value: "text-slate-900" },
  green: { chip: "bg-emerald-50 text-emerald-600", value: "text-emerald-600" },
  amber: { chip: "bg-amber-50 text-amber-600", value: "text-amber-600" },
  blue: { chip: "bg-indigo-50 text-indigo-600", value: "text-indigo-600" },
} as const;

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "slate",
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  accent?: keyof typeof ACCENTS;
}) {
  const a = ACCENTS[accent];

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 transition hover:shadow-md hover:ring-slate-300">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-500">{label}</div>
          <div className={`mt-2 text-2xl font-bold tabular-nums tracking-tight ${a.value}`}>
            {value}
          </div>
          {sub && <div className="mt-1 text-xs text-slate-400">{sub}</div>}
        </div>
        {icon && (
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base ${a.chip}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
