const test = require('node:test');
const assert = require('node:assert/strict');
const { buildConditions, pageParams } = require('./filters');

test('the sale date range filters on sold_at so the index can be used', () => {
  const { conditions, values } = buildConditions('sales', { sale_date_min: '2026-10-01', sale_date_max: '2026-10-22' });
  assert.deepEqual(conditions, ['`sold_at` >= ?', '`sold_at` < DATE_ADD(?, INTERVAL 1 DAY)']);
  assert.deepEqual(values, ['2026-10-01', '2026-10-22']);
});

test('unknown columns and empty values are ignored', () => {
  const { conditions, values } = buildConditions('sales', { nope: 'x', brand: '', limit: '12', offset: '0' });
  assert.deepEqual(conditions, []);
  assert.deepEqual(values, []);
});

test('exact columns use equality, lists use IN and ranges use >= and <=', () => {
  const { conditions, values } = buildConditions('sales', { brand: 'Lois', size: ['M', 'L'], profit_min: '5', amount_max: '100' });
  assert.deepEqual(conditions, ['`brand` = ?', '`size` IN (?, ?)', '`profit` >= ?', '`amount` <= ?']);
  assert.deepEqual(values, ['Lois', 'M', 'L', '5', '100']);
});

test('the search adds a LIKE group per word', () => {
  const { conditions, values } = buildConditions('sales', { search: 'camisa' });
  assert.deepEqual(conditions, ['(`product` LIKE ? OR `color` LIKE ?)']);
  assert.deepEqual(values, ['%camisa%', '%camisa%']);
});

test('non text values are skipped instead of reaching the query', () => {
  const { conditions } = buildConditions('sales', { brand: { $ne: 'x' }, size: [{ a: 1 }] });
  assert.deepEqual(conditions, []);
});

test('pageParams defaults to the first 12', () => {
  assert.deepEqual(pageParams({}), { limit: 12, offset: 0 });
});

test('pageParams accepts numbers as text and caps the limit', () => {
  assert.deepEqual(pageParams({ limit: '24', offset: '36' }), { limit: 24, offset: 36 });
  assert.deepEqual(pageParams({ limit: '100000' }), { limit: 500, offset: 0 });
});

test('pageParams falls back on negative, zero or non numeric values', () => {
  assert.deepEqual(pageParams({ limit: '0', offset: '-5' }), { limit: 12, offset: 0 });
  assert.deepEqual(pageParams({ limit: 'abc', offset: 'x' }), { limit: 12, offset: 0 });
  assert.deepEqual(pageParams({ limit: ['5'], offset: { a: 1 } }), { limit: 12, offset: 0 });
});

test('a sale date that is not YYYY-MM-DD is ignored', () => {
  const { conditions, values } = buildConditions('sales', { sale_date_min: 'zz', sale_date_max: '2026-13-45', brand: 'Lois' });
  assert.deepEqual(conditions, ['`brand` = ?']);
  assert.deepEqual(values, ['Lois']);
});

test('a day that does not exist is ignored too', () => {
  const { conditions } = buildConditions('sales', { sale_date_min: '2026-02-30' });
  assert.deepEqual(conditions, []);
});