const MAX_LENGTH = 100;
const MAX_WORDS = 6;

const escapeLike = (value) => value.replace(/[\\%_]/g, '\\$&');

const likeSearch = (term, columns) => {
  if (typeof term !== 'string' || columns.length === 0) return null;
  const words = term.trim().slice(0, MAX_LENGTH).split(/\s+/).filter(Boolean).slice(0, MAX_WORDS);
  if (words.length === 0) return null;
  const group = `(${columns.map((column) => `\`${column}\` LIKE ?`).join(' OR ')})`;
  return {
    sql: words.length === 1 ? group : `(${words.map(() => group).join(' AND ')})`,
    values: words.flatMap((word) => columns.map(() => `%${escapeLike(word)}%`))
  };
};

module.exports = { escapeLike, likeSearch };