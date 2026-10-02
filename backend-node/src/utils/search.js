const MAX_LENGTH = 100;

const escapeLike = (value) => value.replace(/[\\%_]/g, '\\$&');

const likeSearch = (term, columns) => {
  if (typeof term !== 'string' || columns.length === 0) return null;
  const text = term.trim().slice(0, MAX_LENGTH);
  if (!text) return null;
  const pattern = `%${escapeLike(text)}%`;
  return {
    sql: `(${columns.map((column) => `\`${column}\` LIKE ?`).join(' OR ')})`,
    values: columns.map(() => pattern)
  };
};

module.exports = { escapeLike, likeSearch };