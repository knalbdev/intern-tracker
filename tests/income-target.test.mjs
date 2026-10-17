import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../lib/income-target.ts', import.meta.url), 'utf8');
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
const { rankByIncome, studentsAtIncomeTarget, PKL_INCOME_TARGET } = context.exports;
const student = (nama, cabang, totalPendapatan) => ({ nama, cabang, totalPendapatan, kelas: 'XII RPL', no: '1' });

test('target includes exactly Rp20 million and higher, excludes smaller amounts', () => {
  assert.equal(PKL_INCOME_TARGET, 20_000_000);
  const students = [student('Below', 'Solo', 19_999_999), student('Exact', 'Akhwat', 20_000_000), student('Above', 'Jonggol Ikhwan', 20_000_001)];
  assert.equal(studentsAtIncomeTarget(students).map(s => s.nama).join(','), 'Above,Exact');
});

test('ranking combines branches, returns top ten in descending order without mutating source', () => {
  const students = Array.from({ length: 15 }, (_, i) => student(`Siswa ${i}`, ['Solo', 'Akhwat', 'Jonggol Ikhwan'][i % 3], (i + 1) * 1_000_000));
  const original = students.slice();
  const ranking = rankByIncome(students).slice(0, 10);
  assert.equal(ranking.length, 10);
  assert.equal(ranking[0].totalPendapatan, 15_000_000);
  assert.equal(ranking[9].totalPendapatan, 6_000_000);
  assert.equal(new Set(ranking.map(s => s.cabang)).size, 3);
  assert.deepEqual(students, original);
});

test('tied incomes use name and branch as deterministic tie breakers', () => {
  const ranked = rankByIncome([student('Budi', 'Solo', 30_000_000), student('Adi', 'Solo', 30_000_000), student('Adi', 'Akhwat', 30_000_000)]);
  assert.equal(ranked.map(s => `${s.nama}/${s.cabang}`).join(','), 'Adi/Akhwat,Adi/Solo,Budi/Solo');
});

test('empty, zero, and invalid income do not enter the ranking', () => {
  assert.equal(rankByIncome([]).length, 0);
  assert.equal(rankByIncome([student('Zero', 'Solo', 0), student('Invalid', 'Solo', NaN), student('Infinite', 'Solo', Infinity)]).length, 0);
});

const { PKL_SALARY_TARGET, qualifyingSalaryPlacements, studentsAtSalaryTarget } = context.exports;
const salaryStudent = (name, salaries) => ({
  ...student(name, 'Solo', salaries.reduce((sum, salary) => sum + (salary || 0), 0)),
  placements: salaries.map((salaryAmount, i) => ({ slot: i + 1, namaPerusahaan: `Perusahaan ${i + 1}`, salaryAmount })),
});

test('salary target is inclusive and does not add salaries across placements', () => {
  assert.equal(PKL_SALARY_TARGET, 2_000_000);
  const students = [salaryStudent('Two small salaries', [1_000_000, 1_500_000]), salaryStudent('Exact', [2_000_000]), salaryStudent('Above', [2_500_000]), salaryStudent('Below', [1_999_999])];
  assert.equal(studentsAtSalaryTarget(students).map(s => s.nama).join(','), 'Above,Exact');
});

test('salary target ignores missing or unreadable amounts and keeps each student once', () => {
  const candidate = salaryStudent('Several placements', [null, 2_000_000, 3_000_000, NaN, Infinity]);
  assert.equal(qualifyingSalaryPlacements(candidate).length, 2);
  assert.equal(studentsAtSalaryTarget([candidate, salaryStudent('Missing', [null]), salaryStudent('None', [])]).length, 1);
  assert.equal(studentsAtSalaryTarget([]).length, 0);
});

test('salary ranking uses highest qualifying placement without changing input', () => {
  const students = [salaryStudent('Adi', [2_000_000, 2_000_000]), salaryStudent('Budi', [3_000_000])];
  const original = students.slice();
  assert.equal(studentsAtSalaryTarget(students).map(s => s.nama).join(','), 'Budi,Adi');
  assert.deepEqual(students, original);
});
