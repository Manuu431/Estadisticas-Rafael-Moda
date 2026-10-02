const { test } = require('node:test');
const assert = require('node:assert/strict');
const { sortSizes } = require('./sizes');

test('sortSizes pone primero las tallas de letra en su orden', () => {
  assert.deepEqual(sortSizes(['XL', 'S', 'XXS', 'M', 'XXL', 'L', 'XS']), ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']);
});

test('sortSizes ordena las numéricas de menor a mayor como números', () => {
  assert.deepEqual(sortSizes(['100', '9', '46', '38', '40']), ['9', '38', '40', '46', '100']);
});

test('sortSizes deja las de letra, luego las numéricas y al final el resto', () => {
  assert.deepEqual(sortSizes(['Única', '42', 'M', '38', 'S', 'Especial']), ['S', 'M', '38', '42', 'Especial', 'Única']);
});

test('sortSizes no depende del orden de entrada ni cambia el array original', () => {
  const input = ['44', 'L', 'Única', 'S'];
  assert.deepEqual(sortSizes(input), ['S', 'L', '44', 'Única']);
  assert.deepEqual(input, ['44', 'L', 'Única', 'S']);
});

test('sortSizes admite minúsculas en las tallas de letra', () => {
  assert.deepEqual(sortSizes(['xl', 'm']), ['m', 'xl']);
});

test('sortSizes con una lista vacía devuelve una lista vacía', () => {
  assert.deepEqual(sortSizes([]), []);
});