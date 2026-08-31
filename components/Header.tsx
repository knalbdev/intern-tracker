"use client";

import { useState } from "react";
import Image from "next/image";
import { IconClock, IconRefresh } from "./icons";

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 5) return "baru saja";
  if (seconds < 60) return `${seconds} detik lalu`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.round(minutes / 60);
  return `${hours} jam lalu`;
}

function Logo() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
        IDN
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
      <Image
        src="/idn.png"
        alt="Logo SMK IDN Bogor"
        width={40}
        height={40}
        className="h-full w-full object-contain p-1"
        priority
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function Header({
  fetchedAt,
  isValidating,
  onRefresh,
}: {
  fetchedAt: string | undefined;
  isValidating: boolean;
  onRefresh: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
              SMK IDN Bogor
            </p>
            <h1 className="text-lg font-bold leading-tight text-slate-900 sm:text-xl">
              Dashboard Overview PKL
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {fetchedAt && (
            <span className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 sm:inline-flex">
              <IconClock className="text-slate-400" />
              {isValidating ? "Menyegarkan…" : `Diperbarui ${timeAgo(fetchedAt)}`}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={isValidating}
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-60"
          >
            <IconRefresh className={isValidating ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
}
