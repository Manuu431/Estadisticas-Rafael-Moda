const test = require('node:test');
const assert = require('node:assert/strict');
const { isAuthorized, runDailyDemoUpdate } = require('./dailyDemoUpdateController');

test('CRON authorization requires a matching bearer token and secret', () => {
  assert.equal(isAuthorized('Bearer secret-value', 'secret-value'), true);
  assert.equal(isAuthorized('Bearer secret-value', ''), false);
  assert.equal(isAuthorized('secret-value', 'secret-value'), false);
  assert.equal(isAuthorized('Bearer other', 'secret-value'), false);
});

test('a duplicate process date exits without generating duplicate rows', async () => {
  const calls = [];
  const connection = {
    async beginTransaction() { calls.push('begin'); },
    async query(sql) { calls.push(sql); const err = new Error('duplicate'); err.code = 'ER_DUP_ENTRY'; throw err; },
    async rollback() { calls.push('rollback'); },
    release() { calls.push('release'); }
  };
  const result = await runDailyDemoUpdate({ db: { getConnection: async () => connection }, now: new Date('2026-10-22T12:00:00Z') });
  assert.equal(result.alreadyProcessed, true);
  assert.deepEqual(calls, ['begin', 'INSERT INTO demo_update_days (process_date) VALUES (?)', 'rollback', 'release']);
});

test('task errors roll back and release the connection', async () => {
  const calls = [];
  const connection = {
    async beginTransaction() { calls.push('begin'); },
    async query(sql) {
      calls.push(sql);
      if (sql.startsWith('SELECT sl.product_id')) {
        return [[{ product_id: 1, size: 'S', unit_price: 50, unit_cost: 25 }]];
      }
      if (sql.startsWith('INSERT INTO tickets')) throw new Error('database unavailable');
      return [{ insertId: 10 }];
    },
    async rollback() { calls.push('rollback'); },
    release() { calls.push('release'); }
  };
  await assert.rejects(runDailyDemoUpdate({ db: { getConnection: async () => connection }, now: new Date('2026-10-22T21:00:00Z') }), /database unavailable/);
  assert.deepEqual(calls, [
    'begin',
    'INSERT INTO demo_update_days (process_date) VALUES (?)',
    calls[2],
    'INSERT INTO tickets (sold_at) VALUES (?)',
    'rollback',
    'release'
  ]);
  assert.match(calls[2], /^\s*SELECT sl\.product_id/);
});