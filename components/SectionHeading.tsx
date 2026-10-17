import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="section-heading">
      <div><p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p><h2 className="text-xl font-semibold tracking-tight text-slate-800">{title}</h2></div>
      {action}
    </div>
  );
}
