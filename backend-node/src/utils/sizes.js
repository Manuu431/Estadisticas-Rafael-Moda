const LETTER_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

const rank = (size) => {
  const letter = LETTER_SIZES.indexOf(size.toUpperCase());
  if (letter !== -1) return [0, letter];
  if (/^\d+(\.\d+)?$/.test(size)) return [1, Number(size)];
  return [2, 0];
};

const sortSizes = (sizes) =>
  [...sizes].sort((a, b) => {
    const [groupA, valueA] = rank(a);
    const [groupB, valueB] = rank(b);
    if (groupA !== groupB) return groupA - groupB;
    if (valueA !== valueB) return valueA - valueB;
    return a.localeCompare(b, 'es');
  });

module.exports = { sortSizes };