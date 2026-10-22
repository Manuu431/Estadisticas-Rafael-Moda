const { test } = require('node:test');
const assert = require('node:assert/strict');
const { searchColumns, exactColumns, orderBy, filterColumns } = require('./columns');
const { likeSearch } = require('./search');

test('los clientes se buscan por nombre y código postal', () => {
  assert.deepEqual(searchColumns.clients, ['name', 'postal_code']);
  const result = likeSearch('03780', searchColumns.clients);
  assert.equal(result.sql, '(`name` LIKE ? OR `postal_code` LIKE ?)');
  assert.deepEqual(result.values, ['%03780%', '%03780%']);
});

test('provincia y ciudad se comparan exactas, no como texto libre', () => {
  assert.ok(exactColumns.includes('province'));
  assert.ok(exactColumns.includes('city'));
});

test('las columnas exactas que ya existían siguen igual', () => {
  for (const column of ['size', 'section', 'brand', 'family', 'color']) assert.ok(exactColumns.includes(column));
});

test('los clientes salen ordenados por nombre y, a igualdad, por id', () => {
  assert.equal(orderBy.clients, '`name`, `id`');
  assert.equal(orderBy.sales, undefined);
});

test('filterColumns descarta los valores que son objetos o listas', () => {
  const data = filterColumns({ name: { toSqlString: 'x' }, start_day: [1, 2], end_day: 5, last_year: null }, 'period_types');
  assert.deepEqual(data, { end_day: 5, last_year: null });
});