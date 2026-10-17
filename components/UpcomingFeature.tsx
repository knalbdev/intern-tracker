import Link from "next/link";
import { Sidebar } from "./Sidebar";
import { IconClock } from "./icons";

export function UpcomingFeature({ title, description, planned }: {
  title: string;
  description: string;
  planned: string[];
}) {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <header className="topbar">
          <div className="flex flex-wrap items-center gap-2 text-sm"><span className="text-slate-400">Workspace</span><span className="text-slate-300">/</span><span className="font-medium text-slate-700">{title}</span></div>
          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">Masih dikembangkan</span>
        </header>
        <main className="dashboard-content">
          <div className="page-intro"><div><p className="page-eyebrow">PENGEMBANGAN BERIKUTNYA</p><h1>{title}<span>.</span></h1><p>{description}</p></div></div>
          <section className="mx-auto max-w-3xl rounded-2xl border border-[#e2e9dd] bg-white px-6 py-12 text-center sm:px-10 sm:py-16" aria-labelledby="upcoming-title">
            <span aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl text-emerald-700"><IconClock /></span>
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">Masih dikembangkan</p>
            <h2 id="upcoming-title" className="mt-3 text-2xl font-semibold tracking-tight text-slate-800">Sedang disiapkan untuk tahap berikutnya.</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-500">Fitur {title.toLocaleLowerCase("id")} belum tersedia. Pengembangan akan dilanjutkan pada tahap berikutnya.</p>
            <div className="mt-8 rounded-xl border border-slate-100 bg-[#f7f9f4] p-5 text-left">
              <h3 className="text-xs font-semibold text-slate-700">Rencana fitur</h3>
              <ul className="mt-3 space-y-3 text-sm leading-relaxed text-slate-500">{planned.map((item) => <li key={item} className="flex items-start gap-3"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />{item}</li>)}</ul>
            </div>
            <Link href="/dashboard" className="mt-8 inline-flex items-center gap-3 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800">← Kembali ke Ringkasan</Link>
          </section>
          <footer className="dashboard-footer"><span>PKLtrack / Pengembangan portal PKL</span><span>{title}</span></footer>
        </main>
      </div>
    </div>
  );
}
