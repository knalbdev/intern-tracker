import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync(new URL('../lib/sheet-parser.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
const { parseSalary, parseCabangTab, extractSheetTabs } = context.exports;

const header = ['No', 'Nama Lengkap', 'CV', 'Portofolio', 'Kelas', 'Kontak Siswa', 'Sudah Mulai', 'Nama Perusahaan 1', 'Salary (Uang Saku)', 'Posisi', 'Nama Perusahaan 2', 'Salary (Uang Saku)'];
const studentRow = (name, firstSalary, secondSalary = '') => ['1', name, '', '', 'XII RPL', '', 'TRUE', 'Perusahaan A', firstSalary, 'Developer', secondSalary ? 'Perusahaan B' : '', secondSalary];

test('reads currency strings, plain numbers, abbreviations and explicit zero', () => {
  for (const [raw, expected] of [['Rp. 2.250.000', 2250000], ['RP1.500.000', 1500000], ['Rp2,000,000', 2000000], ['2 juta', 2000000], ['1,5 jt', 1500000], ['900k/bulan', 900000], ['Rp2.000.000,00', 2000000], ['2000000', 2000000], ['Rp0', 0], ['0', 0], ['Unpaid', 0]]) assert.equal(parseSalary(raw), expected, raw);
});

test('does not invent income from ranges, daily rates, estimates, or project fees', () => {
  for (const raw of ['', '-', 'Rp2.000.000 - Rp3.000.000', 'Rp 1.6 - 2 Jt', '50k/hari', '70K/hari', '85rb per hadir, tapi di bayarnya perbulan', 'Rp.2.000.000 / project', 'Rp. 1.000.000 Estimated', '3 bulan pertama 600k 3 bulan setelahnya 1,600 k', 'up 1jt', '200-250K / hari']) assert.equal(parseSalary(raw), null, raw);
});

test('reads raw-export preambles and repeated headers, including different unit column layouts', () => {
  const alternateHeader = ['No', 'Nama Lengkap', '', '', 'Kelas', '', 'Sudah Mulai', 'Nama Perusahaan 1', 'Posisi', 'Salary (Uang Saku)'];
  const rows = [['', 'Kelas', ': XII RPL'], ['', 'Wali Kelas'], header, studentRow('Siswa A', 'Rp. 2.250.000', 'Rp3.000.000'), ['', 'Total Siswa'], alternateHeader, ['2', 'Siswa B', '', '', 'XII RPL', '', 'TRUE', 'Perusahaan C', 'Designer', 'RP1.500.000']];
  const parsed = parseCabangTab('Solo', rows);
  assert.equal(parsed.length, 2);
  assert.equal(parsed[0].placements[1].salaryRaw, 'Rp3.000.000');
  assert.equal(parsed[0].placements[0].salaryCell, 'I4');
  assert.equal(parsed[0].placements[1].salaryCell, 'L4');
  assert.equal(parsed[1].placements[0].salaryCell, 'J7');
  assert.equal(parsed[0].totalPendapatan, 5250000);
  assert.equal(parsed[1].placements[0].posisi, 'Designer');
  assert.equal(parsed[1].totalPendapatan, 1500000);
});

test('keeps salaries without company names and does not manufacture empty placements', () => {
  const row = studentRow('Siswa A', 'Rp1.000.000', 'Rp14.945.000');
  row[7] = ''; row[10] = '-';
  const parsed = parseCabangTab('Akhwat', [header, row]);
  assert.equal(parsed[0].totalPendapatan, 15945000);
  assert.equal(parsed[0].placements.length, 2);
  assert.equal(parsed[0].placements[0].companyNameMissing, true);
  assert.equal(parsed[0].placements[1].salaryRaw, 'Rp14.945.000');
  const empty = studentRow('Siswa B', '-'); empty[7] = '';
  assert.equal(parseCabangTab('Solo', [header, empty])[0].placements.length, 0);
});

test('keeps raw ambiguous salaries visible without classifying them as unpaid', () => {
  const row = studentRow('Siswa A', '50k/hari', 'Rp2.000.000 - Rp3.000.000');
  const s = parseCabangTab('Solo', [header, row])[0];
  assert.equal(s.placements[0].salaryRaw, '50k/hari');
  assert.equal(s.placements[0].salaryAmount, null);
  assert.equal(s.totalPendapatan, 0);
  assert.equal(s.pendapatanTidakTerbaca, 2);
});

test('discovers tab identifiers without evaluating source HTML', () => {
  const html = 'items.push({name: "Jonggol Ikhwan", pageUrl: "example", gid: "123",initialSheet: false});items.push({name: "Akhwat", gid: "456"});';
  assert.equal(extractSheetTabs(html).get('Jonggol Ikhwan'), '123');
  assert.equal(extractSheetTabs(html).get('Akhwat'), '456');
  assert.equal(extractSheetTabs('<html>login required</html>').size, 0);
});
