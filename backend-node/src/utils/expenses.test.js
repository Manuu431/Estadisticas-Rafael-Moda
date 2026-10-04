const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readBy, groupExpression, buildExpenses } = require('./expenses');

test('readBy usa month cuando no se manda nada', () => {
  assert.deepEqual(readBy(undefined), { by: 'month' });
});

test('readBy acepta month y year', () => {
  assert.deepEqual(readBy('month'), { by: 'month' });
  assert.deepEqual(readBy('year'), { by: 'year' });
});

test('readBy rechaza cualquier otro valor', () => {
  for (const value of ['day', '', 'MONTH', 'constructor', '__proto__', ['month'], { a: 1 }, 1]) {
    assert.ok(readBy(value).error, `debería rechazar ${JSON.stringify(value)}`);
  }
});

test('groupExpression sale de una lista cerrada', () => {
  assert.equal(groupExpression('month'), "DATE_FORMAT(v.sold_at, '%Y-%m')");
  assert.equal(groupExpression('year'), "DATE_FORMAT(v.sold_at, '%Y')");
});

test('buildExpenses convierte los importes a número y conserva el orden', () => {
  const rows = [
    { period: '2026-01', amount: '29740.00', cost: '18140.00', profit: '11600.00' },
    { period: '2026-02', amount: '21180.50', cost: '12710.25', profit: '8470.25' }
  ];
  const totals = { amount: '50920.50', cost: '30850.25', profit: '20070.25', first: '2026-01-03', last: '2026-02-27' };
  assert.deepEqual(buildExpenses({ by: 'month', rows, totals, range: { from: '2026-01-01', to: '2026-02-28' } }), {
    by: 'month',
    range: { from: '2026-01-01', to: '2026-02-28' },
    totals: { amount: 50920.5, cost: 30850.25, profit: 20070.25 },
    rows: [
      { key: '2026-01', amount: 29740, cost: 18140, profit: 11600 },
      { key: '2026-02', amount: 21180.5, cost: 12710.25, profit: 8470.25 }
    ]
  });
});

test('buildExpenses con by=year saca el rango de la primera y la última venta', () => {
  const totals = { amount: '100.00', cost: '40.00', profit: '60.00', first: '2020-03-14', last: '2026-09-28' };
  const result = buildExpenses({ by: 'year', rows: [{ period: '2020', amount: '100.00', cost: '40.00', profit: '60.00' }], totals, range: null });
  assert.deepEqual(result.range, { from: '2020-03-14', to: '2026-09-28' });
});

test('buildExpenses sin ventas devuelve filas vacías, totales a 0 y range null con year', () => {
  const totals = { amount: null, cost: null, profit: null, first: null, last: null };
  assert.deepEqual(buildExpenses({ by: 'year', rows: [], totals, range: null }), {
    by: 'year',
    range: null,
    totals: { amount: 0, cost: 0, profit: 0 },
    rows: []
  });
});

test('buildExpenses sin ventas con month conserva el rango pedido', () => {
  const totals = { amount: null, cost: null, profit: null, first: null, last: null };
  const result = buildExpenses({ by: 'month', rows: [], totals, range: { from: '2026-01-01', to: '2026-01-31' } });
  assert.deepEqual(result.range, { from: '2026-01-01', to: '2026-01-31' });
  assert.deepEqual(result.totals, { amount: 0, cost: 0, profit: 0 });
});