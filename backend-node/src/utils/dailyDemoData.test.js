const test = require('node:test');
const assert = require('node:assert/strict');
const { dailyProcessDate, buildDailySales, buildCurrentYearEditions } = require('./dailyDemoData');

test('The processed day is always today in Madrid, including UTC rollover and year change', () => {
  assert.equal(dailyProcessDate(new Date('2026-01-01T18:00:00Z')), '2026-01-01');
  assert.equal(dailyProcessDate(new Date('2026-01-01T06:00:00Z')), '2026-01-01');
  assert.equal(dailyProcessDate(new Date('2025-12-31T23:30:00Z')), '2026-01-01');
  assert.equal(dailyProcessDate(new Date('2026-07-01T06:00:00Z')), '2026-07-01');
});

test('daily generation is deterministic for the requested Madrid date', () => {
  const args = { date: '2026-10-20', now: new Date('2026-10-22T02:00:00Z'), catalog: [{ product_id: 4, size: 'M', unit_price: '69.50', unit_cost: '34.75' }] };
  const generated = buildDailySales(args);
  assert.deepEqual(buildDailySales(args), generated);
  assert.ok(generated.tickets.length > 0);
  assert.ok(generated.tickets.every((ticket) => ticket.soldAt.startsWith('2026-10-20 ')));
  assert.ok(generated.lines.every((line) => line.productId === 4 && line.size === 'M'));
});

test('the whole day is generated whatever the time it runs, so the morning run fills today', () => {
  const catalog = [{ product_id: 1, size: 'S', unit_price: 50, unit_cost: 25 }];
  const morning = buildDailySales({ date: '2026-10-22', now: new Date('2026-10-22T06:00:00Z'), catalog });
  const evening = buildDailySales({ date: '2026-10-22', now: new Date('2026-10-22T21:00:00Z'), catalog });
  assert.deepEqual(morning, evening);
  assert.ok(morning.tickets.some((ticket) => ticket.soldAt.slice(11, 13) >= '17'));
});

test('generation accepts today and rejects future and invalid dates', () => {
  const common = { now: new Date('2026-10-22T21:00:00Z'), catalog: [{ product_id: 1, size: 'S', unit_price: 50, unit_cost: 25 }] };
  const today = buildDailySales({ ...common, date: '2026-10-22' });
  assert.ok(today.tickets.length > 0);
  assert.ok(today.tickets.every((ticket) => ticket.soldAt <= '2026-10-22 23:00:00'));
  assert.throws(() => buildDailySales({ ...common, date: '2026-10-23' }), /must not be in the future/);
  assert.throws(() => buildDailySales({ ...common, date: '2026-02-31' }), /valid date/);
  assert.throws(() => buildDailySales({ ...common, date: '2026-10-20', catalog: [] }), /No existing/);
});

test('annual editions add only missing repeaters and avoid dates for manually moved types', () => {
  const types = [
    { id: 1, first_year: 2020, repeats: 1, start_day: 1, start_month: 3, end_day: 31, end_month: 8 },
    { id: 2, first_year: 2020, repeats: 1, start_day: 5, start_month: 12, end_day: 6, end_month: 1 },
    { id: 3, first_year: 2026, repeats: 0, start_day: 1, start_month: 5, end_day: 2, end_month: 5 }
  ];
  const rows = buildCurrentYearEditions({
    types,
    existingPeriods: [
      { period_type_id: 1, start_date: '2026-03-05', end_date: '2026-08-31' },
      { period_type_id: 2, start_date: '2026-12-05', end_date: '2027-01-06' }
    ],
    date: '2026-10-20'
  });
  assert.deepEqual(rows, []);

  const futureRows = buildCurrentYearEditions({ types: [types[1]], existingPeriods: [], date: '2026-10-20' });
  assert.deepEqual(futureRows, [[2, '2026-12-05', '2027-01-06', 0]]);
});