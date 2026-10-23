const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../index');
const pool = require('./config/db');

const post = (server, path) => fetch(`http://127.0.0.1:${server.address().port}${path}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: '{}'
}).then((res) => res.status);

test.after(() => pool.end());

test('the login only answers to its exact lowercase path, so the rate-limit rule cannot be bypassed', async () => {
  const server = app.listen(0);
  try {
    assert.equal(await post(server, '/api/users'), 400);
    assert.equal(await post(server, '/API/users'), 401);
    assert.equal(await post(server, '/api/USERS'), 401);
  } finally {
    server.close();
  }
});