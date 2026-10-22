const { test } = require('node:test');
const assert = require('node:assert/strict');
const { secretProblem, parseOrigins } = require('./env');

test('sin JWT_SECRET hay problema', () => {
  assert.equal(secretProblem(undefined), 'Missing JWT_SECRET');
});

test('un JWT_SECRET de menos de 32 caracteres no vale', () => {
  assert.equal(secretProblem('a'.repeat(31)), 'JWT_SECRET must be at least 32 characters');
});

test('el JWT_SECRET de ejemplo no vale aunque sea largo', () => {
  assert.equal(secretProblem('change_me_use_a_long_random_string'), 'JWT_SECRET is still the example value');
});

test('un JWT_SECRET largo y propio vale', () => {
  assert.equal(secretProblem('x'.repeat(48)), null);
});

test('sin CORS_ORIGIN solo se acepta el frontend local', () => {
  assert.deepEqual(parseOrigins(undefined), ['http://localhost:5173']);
});

test('CORS_ORIGIN admite varios orígenes separados por comas y sin espacios ni barra final', () => {
  assert.deepEqual(parseOrigins(' https://a.vercel.app/ , https://b.vercel.app'), ['https://a.vercel.app', 'https://b.vercel.app']);
});