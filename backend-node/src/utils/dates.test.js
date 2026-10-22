const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildPeriodInserts, validateType, isFrozen } = require('./dates');

const today = new Date(2026, 9, 22);
const season = { id: 3, first_year: 2024, repeats: 1, last_year: null, start_day: 1, start_month: 3, end_day: 30, end_month: 9 };

test('un tipo que se repite genera una edición por año hasta el actual', () => {
  const years = buildPeriodInserts(season, undefined, today).map((row) => row[1].slice(0, 4));
  assert.deepEqual(years, ['2024', '2025', '2026']);
});

test('un tipo que no se repite solo genera la de su primer año', () => {
  const years = buildPeriodInserts({ ...season, repeats: 0, first_year: 2026 }, undefined, today).map((row) => row[1].slice(0, 4));
  assert.deepEqual(years, ['2026']);
});

test('last_year corta la repetición y no se crean años posteriores', () => {
  const years = buildPeriodInserts({ ...season, last_year: 2025 }, undefined, today).map((row) => row[1].slice(0, 4));
  assert.deepEqual(years, ['2024', '2025']);
});

test('los años ya existentes o saltados no se vuelven a crear', () => {
  const existing = new Set(['3-2025']);
  const years = buildPeriodInserts(season, existing, today).map((row) => row[1].slice(0, 4));
  assert.deepEqual(years, ['2024', '2026']);
});

test('una edición que cruza de año termina en el año siguiente', () => {
  const winter = { ...season, start_month: 10, start_day: 1, end_month: 2, end_day: 28 };
  const [first] = buildPeriodInserts(winter, undefined, today);
  assert.deepEqual(first.slice(1, 3), ['2024-10-01', '2025-02-28']);
});

test('el 29 de febrero se recorta al 28 en los años que no son bisiestos', () => {
  const winter = { ...season, first_year: 2023, start_month: 10, start_day: 1, end_month: 2, end_day: 29 };
  const ends = buildPeriodInserts(winter, undefined, today).map((row) => row[2]);
  assert.deepEqual(ends.slice(0, 2), ['2024-02-29', '2025-02-28']);
});

test('un día que no existe en el mes no rueda al mes siguiente', () => {
  const bad = { ...season, start_month: 4, start_day: 31 };
  const [first] = buildPeriodInserts(bad, undefined, today);
  assert.equal(first[1], '2024-04-30');
});

test('un tipo válido no tiene error', () => {
  assert.equal(validateType({ name: 'Rebajas', start_day: 1, start_month: 7, end_day: 31, end_month: 8, first_year: 2024 }), null);
});

test('el nombre vacío, el día 31 de abril y last_year anterior a first_year se rechazan', () => {
  const base = { name: 'Rebajas', start_day: 1, start_month: 7, end_day: 31, end_month: 8, first_year: 2024 };
  assert.ok(validateType({ ...base, name: '  ' }));
  assert.ok(validateType({ ...base, end_day: 31, end_month: 4 }));
  assert.ok(validateType({ ...base, last_year: 2023 }));
});

test('una edición que ya empezó está congelada; una futura, no', () => {
  assert.equal(isFrozen('2026-10-22', today), true);
  assert.equal(isFrozen('2026-10-23', today), false);
  assert.equal(isFrozen('2025-01-01', today), true);
});
