"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { aggregateBy, aggregateByUnit, computeOverview, formatPercent, formatRupiah } from "@/lib/aggregate";
import type { DashboardData } from "@/lib/types";
import { DEFAULT_FILTERS, FilterBar, type Filters } from "./FilterBar";
import { StatCard } from "./StatCard";
import { DistributionSection } from "./DistributionSection";
import { IncomeSection } from "./IncomeSection";
import { StudentTable } from "./StudentTable";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { IconCheck, IconPercent, IconUsers, IconWallet } from "./icons";

const REFRESH_MS = 15_000;

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `HTTP ${res.status}`);
    }
    return res.json() as Promise<DashboardData>;
  });

const PAGE_CONTENT = {
  ringkasan: {
    label: "Ringkasan",
    title: "Setiap langkah, terpantau",
    description: "Gambaran lengkap perjalanan PKL siswa, dalam satu tempat.",
  },
  sebaran: {
    label: "Sebaran PKL",
    title: "Lihat sebaran, pahami perkembangan",
    description: "Jelajahi penempatan siswa berdasarkan cabang, jurusan, dan kelas.",
  },
  pendapatan: {
    label: "Pendapatan",
    title: "Setiap pencapaian, tercatat",
    description: "Telusuri pendapatan siswa dan penempatan di setiap perusahaan.",
  },
  peserta: {
    label: "Data peserta",
    title: "Kenali setiap perjalanan siswa",
    description: "Cari peserta dan pantau status, perusahaan, serta posisi PKL mereka.",
  },
} as const;

type DashboardView = keyof typeof PAGE_CONTENT;

export function Dashboard({ view = "ringkasan" }: { view?: DashboardView }) {
  const content = PAGE_CONTENT[view];
  const { data, error, isLoading, isValidating, mutate } = useSWR<DashboardData>(
    "/api/sheet-data",
    fetcher,
    { refreshInterval: REFRESH_MS, revalidateOnFocus: true, revalidateOnReconnect: true }
  );
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const baseFilteredStudents = useMemo(() => {
    if (!data) return [];
    const q = filters.query.trim().toLowerCase();
    return data.students.filter((s) => {
      if (filters.cabang !== "Semua" && s.cabang !== filters.cabang) return false;
      if (filters.jurusan !== "Semua" && s.jurusan !== filters.jurusan) return false;
      if (filters.kelas !== "Semua" && s.kelas !== filters.kelas) return false;
      if (q) {
        const haystack = [s.nama, ...s.placements.map((p) => p.namaPerusahaan)]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [data, filters]);

  const belumGajiCount = useMemo(
    () => baseFilteredStudents.filter((s) => s.totalPendapatan === 0).length,
    [baseFilteredStudents]
  );

  const filteredStudents = useMemo(() => {
    if (!filters.belumGaji) return baseFilteredStudents;
    return baseFilteredStudents.filter((s) => s.totalPendapatan === 0);
  }, [baseFilteredStudents, filters.belumGaji]);

  const overview = useMemo(() => computeOverview(filteredStudents), [filteredStudents]);
  const byCabang = useMemo(
    () => aggregateBy(filteredStudents, (s) => s.cabang),
    [filteredStudents]
  );
  const byJurusan = useMemo(
    () => aggregateBy(filteredStudents, (s) => s.jurusan),
    [filteredStudents]
  );
  const byKelas = useMemo(
    () =>
      aggregateBy(filteredStudents, (s) => s.kelas).sort((a, b) => a.key.localeCompare(b.key)),
    [filteredStudents]
  );
  const units = useMemo(() => aggregateByUnit(filteredStudents), [filteredStudents]);

  const kelasOptions = useMemo(() => {
    if (!data) return [];
    const relevant = data.students.filter((s) => {
      if (filters.cabang !== "Semua" && s.cabang !== filters.cabang) return false;
      if (filters.jurusan !== "Semua" && s.jurusan !== filters.jurusan) return false;
      return true;
    });
    return Array.from(new Set(relevant.map((s) => s.kelas))).sort();
  }, [data, filters.cabang, filters.jurusan]);

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
      <Header
        fetchedAt={data?.fetchedAt}
        isValidating={isValidating}
        onRefresh={() => mutate()}
        refreshMs={REFRESH_MS}
        pageTitle={content.label}
      />

      <main className="dashboard-content">
        <div className="page-intro"><div><p className="page-eyebrow">THE NEXT CHAPTER STARTS HERE</p><h1>{content.title}<span>.</span></h1><p>{content.description}</p></div><span className="intro-badge"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Terhubung ke Google Sheets</span></div>
        {error && (
          <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-100">
            Gagal memuat data: {error.message}
          </div>
        )}

        {isLoading && !data && (
          <div role="status" className="loading-panel"><span className="loading-spinner" /><h2>Menyiapkan dashboard kamu</h2><p>Mengambil data terbaru dari spreadsheet…</p><div className="skeleton-row">{[0, 1, 2, 3].map((i) => <div key={i} />)}</div></div>
        )}

        {data && (
          <div className="space-y-7">
            <FilterBar
              filters={filters}
              onChange={(next) => setFilters({ ...next, kelas: next.cabang !== filters.cabang || next.jurusan !== filters.jurusan ? "Semua" : next.kelas })}
              cabangOptions={data.cabangList}
              jurusanOptions={data.jurusanList}
              kelasOptions={kelasOptions}
              belumGajiCount={belumGajiCount}
            />

            <p role="status" className="text-xs text-slate-500">
              Menampilkan <strong className="font-semibold text-emerald-800">{filteredStudents.length}</strong> dari {data.students.length} siswa. Pencarian dan filter berlaku untuk halaman {content.label}.
            </p>
            {filteredStudents.length === 0 && (
              <div className="rounded-xl border border-dashed border-emerald-200 bg-white px-5 py-8 text-center">
                <h2 className="font-semibold text-slate-700">Tidak ada siswa yang cocok</h2>
                <p className="mt-2 text-sm text-slate-500">Coba kata kunci lain atau ubah pilihan filter.</p>
                <button onClick={() => setFilters(DEFAULT_FILTERS)} className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800">Reset pencarian dan filter</button>
              </div>
            )}
            {view === "ringkasan" && (
              <>
                <section className="overview-banner" aria-label="Ringkasan progres PKL">
                  <div className="banner-copy"><span className="banner-kicker">PERJALANAN MENUJU DUNIA KERJA</span><h2>Talenta hebat.<br />Peluang tanpa batas.</h2><p>Pantau penempatan, kenali perkembangan, dan dukung<br className="hidden sm:block" /> setiap siswa untuk melangkah lebih jauh.</p><Link href="/peserta">Jelajahi data peserta <span aria-hidden="true">↗</span></Link></div>
                  <div className="banner-progress"><div className="progress-ring" style={{ background: `conic-gradient(#b9f479 ${overview.persenDiterima * 3.6}deg, #ffffff20 0deg)` }}><div><strong>{formatPercent(overview.persenDiterima)}</strong><span>Sudah diterima</span></div></div><p><span className="inline-block h-1.5 w-1.5 rounded-full bg-lime-300 mr-2" />{overview.sudahDiterima} dari {overview.totalSiswa} siswa pada pilihan ini</p></div>
                </section>
                <section aria-label="Statistik PKL" className="stats-grid">
                  <StatCard
                    label="Total siswa"
                    sub="Peserta pada pilihan saat ini"
                    value={String(overview.totalSiswa)}
                    icon={<IconUsers />}
                  />
                  <StatCard
                    label="Sudah diterima"
                    sub="Sesuai checkbox Sudah Mulai"
                    value={String(overview.sudahDiterima)}
                    accent="green"
                    icon={<IconCheck />}
                  />
                  <StatCard
                    label="Belum diterima"
                    sub="Belum dicentang Sudah Mulai"
                    value={String(overview.belumDiterima)}
                    accent="amber"
                    icon={<IconUsers />}
                  />
                  <StatCard
                    label="Tingkat penerimaan"
                    sub="Dari total siswa terpilih"
                    value={formatPercent(overview.persenDiterima)}
                    accent="blue"
                    icon={<IconPercent />}
                  />
                  <StatCard
                    label="Pendapatan tercatat"
                    sub="Akumulasi nilai gaji penempatan"
                    value={formatRupiah(overview.totalPendapatan)}
                    accent="blue"
                    icon={<IconWallet />}
                  />
                </section>

              </>
            )}

            {view === "sebaran" && (
              <DistributionSection byCabang={byCabang} byJurusan={byJurusan} byKelas={byKelas} />
            )}

            {view === "pendapatan" && (
              <IncomeSection
                students={filteredStudents}
                byJurusan={byJurusan}
                byCabang={byCabang}
                units={units}
                total={overview.totalPendapatan}
                penempatanTanpaGaji={overview.penempatanTanpaGaji}
              />
            )}

            {view === "peserta" && (
              <StudentTable key={`${filters.cabang}-${filters.jurusan}-${filters.kelas}-${filters.query}-${filters.belumGaji}`} students={filteredStudents} />
            )}
          </div>
        )}
        <footer className="dashboard-footer"><span>PKLtrack <span className="text-slate-300">/</span> Dibangun untuk masa depan siswa.</span><span>Data bersumber dari Google Sheets</span></footer>
      </main>
      </div>
    </div>
  );
}
