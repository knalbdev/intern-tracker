import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync(new URL('../lib/company-directory.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
const { buildCompanyDirectory } = context.exports;
const placement = (namaPerusahaan, extra = {}) => ({ namaPerusahaan, alamat: '', kontak: '', pimpinan: '', posisi: '', ...extra });
const student = (cabang, placements) => ({ nama: 'Peserta', no: '1', cabang, kelas: 'XII RPL', jurusan: 'RPL', placements });

test('groups case/space variants, counts unique students across branches, preserves placements', () => {
  const students = [student('Solo', [placement(' PT  Contoh '), placement('pt contoh')]), student('Akhwat', [placement('PT CONTOH')])];
  const companies = buildCompanyDirectory(students);
  assert.equal(companies.length, 1);
  assert.equal(companies[0].studentCount, 2);
  assert.equal(companies[0].placements.length, 3);
  assert.equal(companies[0].branches.join(','), 'Akhwat,Solo');
  assert.equal(students[0].placements[0].namaPerusahaan, ' PT  Contoh ');
});

test('company search excludes unrelated placements of the same student', () => {
  const students = [student('Solo', [placement('Alpha'), placement('Beta')])];
  const companies = buildCompanyDirectory(students, 'alpha');
  assert.equal(companies.length, 1);
  assert.equal(companies[0].name, 'Alpha');
  assert.equal(buildCompanyDirectory(students, 'peserta').length, 2);
});

test('supports company metadata searches and ignores missing company names', () => {
  const students = [student('Solo', [placement('Alpha', { alamat: 'Bogor', pimpinan: 'Bu Rina', kontak: '021123', posisi: 'Developer' }), placement(''), placement(' - ')])];
  for (const query of ['BOGOR', 'rina', '021123', 'developer']) assert.equal(buildCompanyDirectory(students, query).length, 1);
  assert.equal(buildCompanyDirectory(students, 'not found').length, 0);
  assert.equal(buildCompanyDirectory([]).length, 0);
});

test('salary-only units with missing company names do not become fictitious companies', () => {
  const students = [student('Solo', [placement('Perusahaan belum diisi', { companyNameMissing: true }), placement('Alpha')])];
  const companies = buildCompanyDirectory(students);
  assert.equal(companies.length, 1);
  assert.equal(companies[0].name, 'Alpha');
});
