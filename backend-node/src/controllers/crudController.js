const pool = require('../config/db');
const { sources, allowedColumns, numericColumns } = require('../utils/columns');

const getAll = (resource) => async (req, res, next) => {
  const filters = req.query;
  const columns = allowedColumns[resource] || [];
  const conditions = [];
  const values = [];

  for (const key in filters) {
    const value = filters[key];
    if (value === undefined || value === null || value === '') continue;

    const column = key.replace(/_(min|max)$/, '');
    if (!columns.includes(column)) continue;

    if (key.endsWith('_min')) {
      conditions.push(`\`${column}\` >= ?`);
      values.push(value);
    } else if (key.endsWith('_max')) {
      conditions.push(`\`${column}\` <= ?`);
      values.push(value);
    } else if (Array.isArray(value)) {
      const placeholders = value.map(() => '?').join(', ');
      conditions.push(`\`${column}\` IN (${placeholders})`);
      values.push(...value);
    } else if (numericColumns.includes(column)) {
      conditions.push(`\`${column}\` = ?`);
      values.push(parseFloat(value));
    } else if (column === 'size' || column === 'section') {
      conditions.push(`\`${column}\` = ?`);
      values.push(value);
    } else {
      conditions.push(`\`${column}\` LIKE ?`);
      values.push(`%${value}%`);
    }
  }

  let query = `SELECT * FROM ${sources[resource]}`;
  if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;

  try {
    const [results] = await pool.query(query, values);
    res.json(results);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll };