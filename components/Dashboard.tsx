"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { aggregateBy, aggregateByUnit, computeOverview, formatPercent, formatRupiah } from "@/lib/aggregate";
import type { DashboardData } from "@/lib/types";
import { DEFAULT_FILTERS, FilterBar, type Filters } from "./FilterBar";
import { StatCard } from "./StatCard";
import { DistributionSection } from "./DistributionSection";
import { IncomeSection } from "./IncomeSection";
import { StudentTable } from "./StudentTable";
import { Header } from "./Header";
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

export function Dashboard() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<DashboardData>(
    "/api/sheet-data",
    fetcher,
    { refreshInterval: REFRESH_MS, revalidateOnFocus: true, revalidateOnReconnect: true }
  );
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filteredStudents = useMemo(() => {
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-white">
      <Header
        fetchedAt={data?.fetchedAt}
        isValidating={isValidating}
        onRefresh={() => mutate()}
        refreshMs={REFRESH_MS}
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-100">
            Gagal memuat data: {error.message}
          </div>
        )}

        {isLoading && !data && (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200/70">
            Memuat data spreadsheet...
          </div>
        )}

        {data && (
          <div className={isValidating ? "space-y-6 opacity-90 transition-opacity" : "space-y-6"}>
            <FilterBar
              filters={filters}
              onChange={setFilters}
              cabangOptions={data.cabangList}
              jurusanOptions={data.jurusanList}
              kelasOptions={kelasOptions}
            />

            <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <StatCard
                label="Total Siswa PKL"
                value={String(overview.totalSiswa)}
                icon={<IconUsers />}
              />
              <StatCard
                label="Sudah Diterima"
                value={String(overview.sudahDiterima)}
                accent="green"
                icon={<IconCheck />}
              />
              <StatCard
                label="Belum Diterima"
                value={String(overview.belumDiterima)}
                accent="amber"
                icon={<IconUsers />}
              />
              <StatCard
                label="% Diterima"
                value={formatPercent(overview.persenDiterima)}
                accent="blue"
                icon={<IconPercent />}
              />
              <StatCard
                label="Total Pendapatan"
                value={formatRupiah(overview.totalPendapatan)}
                accent="blue"
                icon={<IconWallet />}
              />
            </section>

            <DistributionSection byCabang={byCabang} byJurusan={byJurusan} byKelas={byKelas} />

            <IncomeSection
              students={filteredStudents}
              byJurusan={byJurusan}
              byCabang={byCabang}
              units={units}
              total={overview.totalPendapatan}
              penempatanTanpaGaji={overview.penempatanTanpaGaji}
            />

            <StudentTable students={filteredStudents} />
          </div>
        )}
      </div>
    </div>
  );
}
