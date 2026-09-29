const pool = require('../config/db');
const { allowedColumns, filterColumns, normalizeDecimalFields } = require('../utils/columns');
const { buildTypeInserts } = require('../utils/dates');

const getAll = (endpoint) => async (req, res, next) => {
  const filters = req.query;

  let query = `SELECT * FROM ${endpoint}`;
  const conditions = [];
  const values = [];
  const columns = allowedColumns[endpoint] || [];

  for (const key in filters) {
    const value = filters[key];
    if (value === undefined || value === null || value === '') continue;

    const column = key.replace(/_(min|max)$/, '');
    if (!columns.includes(column)) continue;

    if (key.endsWith('_min') || key.startsWith('start')) {
      conditions.push(`${column} >= ?`);
      values.push(value);
    } else if (key.endsWith('_max') || key.startsWith('end')) {
      conditions.push(`${column} <= ?`);
      values.push(value);
    } else if (Array.isArray(value)) {
      const placeholders = value.map(() => '?').join(', ');
      conditions.push(`${column} IN (${placeholders})`);
      values.push(...value);
    } else {
      if (!isNaN(value)) {
        conditions.push(`${column} = ?`);
        values.push(parseFloat(value));
      } else {
        if (key === 'size') {
          conditions.push(`${column} LIKE ?`);
          values.push(`${value}`);
        } else {
          conditions.push(`${column} LIKE ?`);
          values.push(`%${value}%`);
        }
      }
    }
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  try {
    const [results] = await pool.query(query, values);
    res.json(results);
  } catch (err) {
    next(err);
  }
};

const create = (endpoint) => async (req, res, next) => {
  let data = filterColumns(req.body, endpoint);

  if (endpoint === 'seasons' || endpoint === 'campaigns') {
    data = normalizeDecimalFields(data, ['expenses', 'profits']);
  }

  try {
    if (endpoint === 'season_types') {
      const [result] = await pool.query(`INSERT INTO season_types SET ?`, data);
      const newId = result.insertId;
      const [[newType]] = await pool.query(`SELECT * FROM season_types WHERE id = ?`, [newId]);

      const currentYear = new Date().getFullYear();
      const inserts = buildTypeInserts(newType, newType.start_year || currentYear, currentYear);

      if (inserts.length > 0) {
        await pool.query('INSERT INTO seasons (name, start_date, end_date, expenses, profits, season_type_id) VALUES ?', [inserts]);
      }

      return res.json({ message: 'Season type and seasons created', season_type_id: newId });

    } else if (endpoint === 'campaign_types') {
      const [result] = await pool.query(`INSERT INTO campaign_types SET ?`, data);
      const newId = result.insertId;
      const [[newType]] = await pool.query(`SELECT * FROM campaign_types WHERE id = ?`, [newId]);

      const currentYear = new Date().getFullYear();
      const inserts = buildTypeInserts(newType, newType.start_year || currentYear, currentYear);

      if (inserts.length > 0) {
        await pool.query('INSERT INTO campaigns (name, start_date, end_date, expenses, profits, campaign_type_id) VALUES ?', [inserts]);
      }

      return res.json({ message: 'Campaign type and campaigns created', campaign_type_id: newId });

    } else {
      const [results] = await pool.query(`INSERT INTO ${endpoint} SET ?`, data);
      return res.json(results);
    }
  } catch (err) {
    next(err);
  }
};

const update = (endpoint) => async (req, res, next) => {
  let data = filterColumns(req.body, endpoint);
  const id = req.params.id;

  if (endpoint === 'seasons' || endpoint === 'campaigns') {
    data = normalizeDecimalFields(data, ['expenses', 'profits']);
  }

  try {
    const [results] = await pool.query(`UPDATE ${endpoint} SET ? WHERE id = ?`, [data, id]);
    res.json(results);
  } catch (err) {
    next(err);
  }
};

const remove = (endpoint) => async (req, res, next) => {
  const id = req.params.id;
  try {
    const [results] = await pool.query(`DELETE FROM ${endpoint} WHERE id = ?`, [id]);
    res.json(results);
  } catch (err) {
    next(err);
  }
};

const syncType = ({ typeTable, targetTable, foreignKey }) => async (req, res, next) => {
  try {
    const [types] = await pool.query(`SELECT * FROM ${typeTable}`);
    const [existingEntries] = await pool.query(`SELECT ${foreignKey}, start_date FROM ${targetTable}`);

    const currentYear = new Date().getFullYear();
    const existingKeys = new Set(
      existingEntries.map(e => `${e[foreignKey]}-${new Date(e.start_date).getFullYear()}`)
    );

    const inserts = [];

    for (const type of types) {
      inserts.push(...buildTypeInserts(type, type.start_year || 2000, currentYear, existingKeys));
    }

    if (inserts.length > 0) {
      await pool.query(
        `INSERT INTO ${targetTable} (name, start_date, end_date, expenses, profits, ${foreignKey}) VALUES ?`,
        [inserts]
      );
    }

    res.json({ message: `${targetTable} up to date.` });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create, update, remove, syncType };