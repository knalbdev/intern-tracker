import type { Student } from "./types";

export const PKL_INCOME_TARGET = 20_000_000;

export function rankByIncome(students: Student[]): Student[] {
  return students
    .filter((student) => Number.isFinite(student.totalPendapatan) && student.totalPendapatan > 0)
    .sort((a, b) => b.totalPendapatan - a.totalPendapatan
      || a.nama.localeCompare(b.nama, "id")
      || a.cabang.localeCompare(b.cabang, "id")
      || a.kelas.localeCompare(b.kelas, "id")
      || a.no.localeCompare(b.no, "id"));
}

export function studentsAtIncomeTarget(students: Student[]): Student[] {
  return rankByIncome(students).filter((student) => student.totalPendapatan >= PKL_INCOME_TARGET);
}

export const PKL_SALARY_TARGET = 2_000_000;

export function qualifyingSalaryPlacements(student: Student) {
  return student.placements.filter((placement) =>
    placement.salaryAmount !== null
    && Number.isFinite(placement.salaryAmount)
    && placement.salaryAmount >= PKL_SALARY_TARGET
  );
}

export function studentsAtSalaryTarget(students: Student[]): Student[] {
  return students
    .filter((student) => qualifyingSalaryPlacements(student).length > 0)
    .sort((a, b) =>
      Math.max(...qualifyingSalaryPlacements(b).map((placement) => placement.salaryAmount!))
      - Math.max(...qualifyingSalaryPlacements(a).map((placement) => placement.salaryAmount!))
      || a.nama.localeCompare(b.nama, "id")
      || a.cabang.localeCompare(b.cabang, "id")
      || a.kelas.localeCompare(b.kelas, "id")
      || a.no.localeCompare(b.no, "id")
    );
}
