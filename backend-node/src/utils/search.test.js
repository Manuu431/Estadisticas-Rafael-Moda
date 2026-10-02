const { test } = require('node:test');
const assert = require('node:assert/strict');
const { escapeLike, likeSearch } = require('./search');

const COLUMNS = ['product', 'brand', 'color'];

test('escapeLike trata % _ y \\ como texto', () => {
  assert.equal(escapeLike('100%'), '100\\%');
  assert.equal(escapeLike('a_b'), 'a\\_b');
  assert.equal(escapeLike('a\\b'), 'a\\\\b');
  assert.equal(escapeLike('Escorpión'), 'Escorpión');
});

test('likeSearch une las columnas con OR y parametriza el valor', () => {
  const result = likeSearch('jersey', COLUMNS);
  assert.equal(result.sql, '(`product` LIKE ? OR `brand` LIKE ? OR `color` LIKE ?)');
  assert.deepEqual(result.values, ['%jersey%', '%jersey%', '%jersey%']);
});

test('likeSearch escapa los comodines del texto buscado', () => {
  assert.deepEqual(likeSearch('50%_', ['brand']).values, ['%50\\%\\_%']);
});

test('likeSearch no mete el texto en el SQL', () => {
  const result = likeSearch("x' OR 1=1 --", ['brand']);
  assert.equal(result.sql, '(`brand` LIKE ?)');
  assert.deepEqual(result.values, ["%x' OR 1=1 --%"]);
});

test('likeSearch recorta espacios y descarta lo vacío', () => {
  assert.deepEqual(likeSearch('  lois ', ['brand']).values, ['%lois%']);
  assert.equal(likeSearch('   ', COLUMNS), null);
  assert.equal(likeSearch('', COLUMNS), null);
});

test('likeSearch ignora lo que no es un texto (array u objeto en la query)', () => {
  assert.equal(likeSearch(['a', 'b'], COLUMNS), null);
  assert.equal(likeSearch({ a: 1 }, COLUMNS), null);
  assert.equal(likeSearch(undefined, COLUMNS), null);
});

test('likeSearch limita el largo del texto a 100 caracteres', () => {
  const result = likeSearch('a'.repeat(300), ['brand']);
  assert.equal(result.values[0], `%${'a'.repeat(100)}%`);
});

test('likeSearch sin columnas donde buscar no devuelve condición', () => {
  assert.equal(likeSearch('lois', []), null);
});