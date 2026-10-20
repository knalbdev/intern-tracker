import type { Placement, Student } from "./types";

export type CompanyDirectoryEntry = {
  key: string;
  name: string;
  studentCount: number;
  branches: string[];
  majors: string[];
  placements: { student: Student; placement: Placement }[];
};

export function buildCompanyDirectory(students: Student[], query = ""): CompanyDirectoryEntry[] {
  const companies = new Map<string, CompanyDirectoryEntry>();
  for (const student of students) {
    for (const placement of student.placements) {
      if (placement.companyNameMissing) continue;
      const name = placement.namaPerusahaan.trim().replace(/\s+/g, " ");
      if (!name || name === "-") continue;
      const key = name.toLocaleLowerCase("id");
      let company = companies.get(key);
      if (!company) {
        company = { key, name, studentCount: 0, branches: [], majors: [], placements: [] };
        companies.set(key, company);
      }
      company.placements.push({ student, placement });
    }
  }
  const search = query.trim().toLocaleLowerCase("id");
  return [...companies.values()].map((company) => {
    company.studentCount = new Set(company.placements.map(({ student }) => JSON.stringify([student.cabang, student.kelas, student.no, student.nama]))).size;
    company.branches = [...new Set(company.placements.map(({ student }) => student.cabang))].sort();
    company.majors = [...new Set(company.placements.map(({ student }) => student.jurusan))].sort();
    return company;
  }).filter((company) => !search || [company.name, ...company.placements.flatMap(({ student, placement }) => [student.nama, placement.alamat, placement.pimpinan, placement.kontak, placement.posisi])].join(" ").toLocaleLowerCase("id").includes(search))
    .sort((a, b) => b.studentCount - a.studentCount || a.name.localeCompare(b.name, "id"));
}
