import { IconSearch, IconSliders } from "./icons";

const ALL = "Semua";

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[9rem] cursor-pointer appearance-none rounded-xl border-0 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value={ALL}>{ALL}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export type Filters = {
  cabang: string;
  jurusan: string;
  kelas: string;
  query: string;
};

export const DEFAULT_FILTERS: Filters = { cabang: ALL, jurusan: ALL, kelas: ALL, query: "" };

export function FilterBar({
  filters,
  onChange,
  cabangOptions,
  jurusanOptions,
  kelasOptions,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  cabangOptions: string[];
  jurusanOptions: string[];
  kelasOptions: string[];
}) {
  const isFiltered =
    filters.cabang !== ALL || filters.jurusan !== ALL || filters.kelas !== ALL || filters.query !== "";

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
      <div className="flex items-center gap-2 self-center pr-1 text-slate-400">
        <IconSliders />
        <span className="hidden text-xs font-semibold uppercase tracking-wide sm:inline">Filter</span>
      </div>
      <Select
        label="Cabang"
        value={filters.cabang}
        options={cabangOptions}
        onChange={(v) => onChange({ ...filters, cabang: v })}
      />
      <Select
        label="Jurusan"
        value={filters.jurusan}
        options={jurusanOptions}
        onChange={(v) => onChange({ ...filters, jurusan: v })}
      />
      <Select
        label="Kelas"
        value={filters.kelas}
        options={kelasOptions}
        onChange={(v) => onChange({ ...filters, kelas: v })}
      />
      <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-xs font-medium text-slate-500">
        Cari siswa / perusahaan
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Ketik nama..."
            className="w-full rounded-xl border-0 bg-slate-100 py-2 pl-9 pr-3 text-sm text-slate-700 transition placeholder:text-slate-400 hover:bg-slate-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </label>
      {isFiltered && (
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="rounded-xl px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
        >
          Reset filter
        </button>
      )}
    </div>
  );
}
