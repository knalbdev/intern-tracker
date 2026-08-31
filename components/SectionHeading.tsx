import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500">
          {eyebrow}
        </p>
        <h2 className="text-lg font-bold tracking-tight text-slate-900">{title}</h2>
      </div>
      {action}
    </div>
  );
}
