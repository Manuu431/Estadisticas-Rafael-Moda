const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildPeriodInserts, validateType, isFrozen, parseType, planTypeUpdate } = require('./dates');

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

test('parseType pasa a número lo que el formulario manda como texto', () => {
  const parsed = parseType({ name: 'Black Friday', start_day: '5', start_month: '11', end_day: '15', end_month: '11', first_year: '2024', last_year: '', repeats: true });
  assert.deepEqual(parsed, { name: 'Black Friday', start_day: 5, start_month: 11, end_day: 15, end_month: 11, first_year: 2024, last_year: null, repeats: 1 });
});

test('parseType no añade los campos que no llegan', () => {
  assert.deepEqual(parseType({ name: 'Nuevo' }), { name: 'Nuevo' });
});

const friday = { id: 7, name: 'Black Friday', start_day: 25, start_month: 11, end_day: 30, end_month: 11, first_year: 2024, repeats: 1, last_year: null };
const editions = [
  { id: 1, year: 2025, start_date: '2025-11-25', end_date: '2025-11-30' },
  { id: 2, year: 2026, start_date: '2026-11-25', end_date: '2026-11-30' },
  { id: 3, year: 2027, start_date: '2027-11-27', end_date: '2027-11-30' }
];

test('cambiar solo el nombre no toca las fechas de ninguna edición', () => {
  assert.deepEqual(planTypeUpdate(friday, { name: 'Viernes negro' }, editions, today), { redate: [], remove: [] });
});

test('cambiar los días del tipo mueve las ediciones futuras que siguen con las fechas del tipo', () => {
  const plan = planTypeUpdate(friday, parseType({ start_day: '5', end_day: '15' }), editions, today);
  assert.deepEqual(plan.redate, [{ id: 2, start: '2026-11-05', end: '2026-11-15' }]);
  assert.deepEqual(plan.remove, []);
});

test('una edición movida a mano no se pisa al cambiar el tipo', () => {
  const plan = planTypeUpdate(friday, { start_day: 20 }, editions, today);
  assert.ok(!plan.redate.some((row) => row.id === 3));
});

test('bajar el último año quita las ediciones futuras que sobran, no las que ya empezaron', () => {
  const plan = planTypeUpdate(friday, { last_year: 2025 }, editions, today);
  assert.deepEqual(plan.remove, [2, 3]);
});

test('dejar de repetir deja solo la edición del año de inicio', () => {
  const plan = planTypeUpdate({ ...friday, first_year: 2026 }, { repeats: 0 }, editions.slice(1), today);
  assert.deepEqual(plan.remove, [3]);
});

test('un año que no es un número se rechaza', () => {
  const base = { name: 'Rebajas', start_day: 1, start_month: 7, end_day: 31, end_month: 8, first_year: 2024 };
  assert.ok(validateType({ ...base, first_year: Number('abc') }));
  assert.ok(validateType({ ...base, last_year: Number('abc') }));
});