import { NextResponse } from "next/server";
import { fetchAllStudents } from "@/lib/sheets";
import type { DashboardData } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const students = await fetchAllStudents();

    const cabangList = Array.from(new Set(students.map((s) => s.cabang))).sort();
    const jurusanList = Array.from(new Set(students.map((s) => s.jurusan))).sort();
    const kelasList = Array.from(new Set(students.map((s) => s.kelas))).sort();

    const data: DashboardData = {
      fetchedAt: new Date().toISOString(),
      spreadsheetTitle: "Data Base PKL",
      students,
      cabangList,
      jurusanList,
      kelasList,
    };

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal mengambil data spreadsheet" },
      { status: 502 }
    );
  }
}
