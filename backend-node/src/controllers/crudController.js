const pool = require('../config/db');
const { sources, orderBy } = require('../utils/columns');
const { buildConditions } = require('../utils/filters');

const getAll = (resource) => async (req, res, next) => {
  const { conditions, values } = buildConditions(resource, req.query);
  let query = `SELECT * FROM ${sources[resource]}`;
  if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
  if (orderBy[resource]) query += ` ORDER BY ${orderBy[resource]}`;
  try {
    const [results] = await pool.query(query, values);
    res.json(results);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll };