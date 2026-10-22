const test = require('node:test');
const assert = require('node:assert/strict');
const { madridUtcOffset } = require('./timezone');

test('Madrid is UTC+1 in winter and UTC+2 in summer', () => {
  assert.equal(madridUtcOffset(new Date('2026-01-15T12:00:00Z')), '+01:00');
  assert.equal(madridUtcOffset(new Date('2026-07-01T12:00:00Z')), '+02:00');
});

test('the offset changes exactly at 01:00 UTC on the last Sundays of March and October', () => {
  assert.equal(madridUtcOffset(new Date('2026-03-29T00:59:59Z')), '+01:00');
  assert.equal(madridUtcOffset(new Date('2026-03-29T01:00:00Z')), '+02:00');
  assert.equal(madridUtcOffset(new Date('2026-10-25T00:59:59Z')), '+02:00');
  assert.equal(madridUtcOffset(new Date('2026-10-25T01:00:00Z')), '+01:00');
});