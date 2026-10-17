"use client";

import { IconClock, IconRefresh } from "./icons";

export function Header({ fetchedAt, isValidating, onRefresh, refreshMs, pageTitle }: {
  fetchedAt: string | undefined;
  isValidating: boolean;
  onRefresh: () => void;
  refreshMs: number;
  pageTitle: string;
}) {
  return (
    <header className="topbar">
      <div className="flex items-center gap-2 text-sm"><span className="text-slate-400">Workspace</span><span className="text-slate-300">/</span><span className="font-medium text-slate-700">{pageTitle}</span></div>
      <div className="flex items-center gap-3 sm:gap-5">
        <span className="hidden items-center gap-2 text-xs text-slate-500 md:inline-flex"><span className={`h-1.5 w-1.5 rounded-full ${isValidating ? "animate-pulse bg-amber-500" : fetchedAt ? "bg-emerald-500" : "bg-slate-300"}`} />{isValidating ? "Menyinkronkan…" : fetchedAt ? `Sinkron setiap ${refreshMs / 1000} detik` : "Menunggu data"}</span>
        <button onClick={onRefresh} disabled={isValidating} className="refresh-button"><IconRefresh className={isValidating ? "animate-spin" : ""} /><span>Refresh</span></button>
        <span className="hidden border-l border-slate-200 pl-5 text-xs text-slate-500 xl:inline-flex items-center gap-2"><IconClock />{fetchedAt ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" }).format(new Date(fetchedAt)) : "Dashboard PKL"}</span>
      </div>
    </header>
  );
}
