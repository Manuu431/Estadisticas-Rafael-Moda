const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mergeBreakdown, BREAKDOWN_LIMIT } = require('./compare');

test('mergeBreakdown junta los dos periodos por nombre y ordena por el A', () => {
  const a = [{ name: 'Lois', total: 3890 }, { name: 'Paz Torras', total: 5420 }];
  const b = [{ name: 'Paz Torras', total: 4980 }, { name: 'Lois', total: 3950 }];
  assert.deepEqual(mergeBreakdown(a, b), [
    { name: 'Paz Torras', a: 5420, b: 4980 },
    { name: 'Lois', a: 3890, b: 3950 }
  ]);
});

test('mergeBreakdown pone 0 donde un periodo no vendió nada de ese grupo', () => {
  const merged = mergeBreakdown([{ name: 'Naf Naf', total: 100 }], [{ name: 'Sinigual', total: 50 }]);
  assert.deepEqual(merged, [
    { name: 'Naf Naf', a: 100, b: 0 },
    { name: 'Sinigual', a: 0, b: 50 }
  ]);
});

test('mergeBreakdown desempata por el B y luego por el nombre', () => {
  const merged = mergeBreakdown([], [{ name: 'Zeta', total: 10 }, { name: 'Alfa', total: 10 }, { name: 'Beta', total: 30 }]);
  assert.deepEqual(merged.map((row) => row.name), ['Beta', 'Alfa', 'Zeta']);
});

test('mergeBreakdown se queda con las primeras BREAKDOWN_LIMIT filas', () => {
  const rows = Array.from({ length: BREAKDOWN_LIMIT + 4 }, (_, index) => ({ name: `M${index}`, total: 1000 - index }));
  const merged = mergeBreakdown(rows, []);
  assert.equal(merged.length, BREAKDOWN_LIMIT);
  assert.equal(merged[0].name, 'M0');
});

test('mergeBreakdown sin datos devuelve una lista vacía', () => {
  assert.deepEqual(mergeBreakdown([], []), []);
});
