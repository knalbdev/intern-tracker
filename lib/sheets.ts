import Papa from "papaparse";
import type { Student } from "./types";
import { extractSheetTabs, parseCabangTab } from "./sheet-parser";

const SPREADSHEET_ID =
  process.env.PKL_SPREADSHEET_ID ?? "1OLl6dywYVx_I_I3sinI5MY-38VTrimp3WaEZ4cCWPJQ";
const CABANG_TABS = ["Jonggol Ikhwan", "Akhwat", "Solo"];

async function fetchSheetTabs(): Promise<Map<string, string>> {
  const response = await fetch(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/htmlview`, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Gagal membaca daftar tab spreadsheet: HTTP ${response.status}`);
  const tabs = extractSheetTabs(await response.text());
  for (const name of CABANG_TABS) {
    if (!tabs.has(name)) throw new Error(`Tab "${name}" tidak ditemukan pada spreadsheet`);
  }
  return tabs;
}

async function fetchCsvRows(sheetName: string, gid: string): Promise<string[][]> {
  // Direct CSV export preserves mixed number/text cells. gviz infers one type
  // for each column and can silently erase valid salaries stored as text.
  const params = new URLSearchParams({ format: "csv", gid });
  const response = await fetch(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?${params}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Gagal mengambil sheet "${sheetName}": HTTP ${response.status}`);
  const text = await response.text();
  if (/^\s*(?:<!doctype html|<html)/i.test(text)) throw new Error(`Sheet "${sheetName}" tidak dapat dibaca sebagai CSV`);
  return Papa.parse<string[]>(text, { skipEmptyLines: false }).data;
}

export async function fetchAllStudents(): Promise<Student[]> {
  const tabs = await fetchSheetTabs();
  const results = await Promise.all(CABANG_TABS.map(async (name) => {
    const rows = await fetchCsvRows(name, tabs.get(name)!);
    return parseCabangTab(name, rows);
  }));
  return results.flat();
}
