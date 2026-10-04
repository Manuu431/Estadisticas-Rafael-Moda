const { test } = require('node:test');
const assert = require('node:assert/strict');
const { citiesQuery } = require('./clientOptions');

const ALL = "SELECT DISTINCT city AS name FROM clients WHERE city IS NOT NULL AND city <> '' ORDER BY city";

test('sin provincia devuelve las ciudades de toda la tabla', () => {
  assert.deepEqual(citiesQuery(undefined), { sql: ALL, values: [] });
  assert.deepEqual(citiesQuery(''), { sql: ALL, values: [] });
});

test('con provincia filtra por ella con un parámetro', () => {
  const result = citiesQuery('Alicante');
  assert.equal(result.sql, "SELECT DISTINCT city AS name FROM clients WHERE city IS NOT NULL AND city <> '' AND province = ? ORDER BY city");
  assert.deepEqual(result.values, ['Alicante']);
});

test('la provincia nunca entra en el SQL', () => {
  const result = citiesQuery("x' OR 1=1 --");
  assert.ok(!result.sql.includes('1=1'));
  assert.deepEqual(result.values, ["x' OR 1=1 --"]);
});

test('ignora lo que no es un texto (array u objeto en la query)', () => {
  assert.deepEqual(citiesQuery(['Alicante', 'Madrid']), { sql: ALL, values: [] });
  assert.deepEqual(citiesQuery({ a: 1 }), { sql: ALL, values: [] });
});