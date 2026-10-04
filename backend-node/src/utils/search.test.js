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
  assert.equal(result.sql, '((`brand` LIKE ?) AND (`brand` LIKE ?) AND (`brand` LIKE ?) AND (`brand` LIKE ?))');
  assert.ok(!result.sql.includes('1=1'));
  assert.deepEqual(result.values, ["%x'%", '%OR%', '%1=1%', '%--%']);
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

test('likeSearch con varias palabras exige todas, cada una en alguna columna', () => {
  const result = likeSearch('camisa azul', ['product', 'color']);
  assert.equal(result.sql, '((`product` LIKE ? OR `color` LIKE ?) AND (`product` LIKE ? OR `color` LIKE ?))');
  assert.deepEqual(result.values, ['%camisa%', '%camisa%', '%azul%', '%azul%']);
});

test('likeSearch trata varios espacios y tabulaciones como un solo separador', () => {
  const result = likeSearch('  camisa \t  azul  ', ['product']);
  assert.equal(result.sql, '((`product` LIKE ?) AND (`product` LIKE ?))');
  assert.deepEqual(result.values, ['%camisa%', '%azul%']);
});

test('likeSearch escapa los comodines en cada palabra', () => {
  assert.deepEqual(likeSearch('50% a_b', ['product']).values, ['%50\\%%', '%a\\_b%']);
});

test('likeSearch usa solo las primeras seis palabras', () => {
  const result = likeSearch('a b c d e f g h', ['product']);
  assert.equal(result.values.length, 6);
  assert.deepEqual(result.values.at(-1), '%f%');
});

test('likeSearch con una sola palabra no añade paréntesis de más', () => {
  assert.equal(likeSearch('azul', ['product', 'color']).sql, '(`product` LIKE ? OR `color` LIKE ?)');
});