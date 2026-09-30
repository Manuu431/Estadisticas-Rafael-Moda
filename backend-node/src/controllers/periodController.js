const pool = require('../config/db');
const { filterColumns, normalizeDecimalFields } = require('../utils/columns');
const { periodLabel, buildPeriodInserts } = require('../utils/dates');

const PROFIT_SUM = `ROUND(COALESCE((SELECT SUM(v.profit) FROM v_sales v WHERE v.sold_at >= p.start_date AND v.sold_at < DATE_ADD(p.end_date, INTERVAL 1 DAY)), 0), 2)`;

const matchesFilters = (row, filters) => {
  for (const key in filters) {
    const value = filters[key];
    if (value === undefined || value === null || value === '') continue;
    const column = key.replace(/_(min|max)$/, '');
    if (!(column in row)) continue;
    const cell = row[column];
    if (key.endsWith('_min')) {
      if (Number(cell) < Number(value)) return false;
    } else if (key.endsWith('_max')) {
      if (Number(cell) > Number(value)) return false;
    } else if (Array.isArray(value)) {
      if (!value.map(String).includes(String(cell))) return false;
    } else if (column === 'start_date') {
      if (String(cell) < String(value)) return false;
    } else if (column === 'end_date') {
      if (String(cell) > String(value)) return false;
    } else if (typeof cell === 'number') {
      if (Number(cell) !== Number(value)) return false;
    } else if (!String(cell).toLowerCase().includes(String(value).toLowerCase())) {
      return false;
    }
  }
  return true;
};

const findType = async (id, kind) => {
  const [[type]] = await pool.query('SELECT * FROM period_types WHERE id = ? AND kind = ?', [id, kind]);
  return type;
};

const findPeriod = async (id, kind) => {
  const [[period]] = await pool.query('SELECT p.id FROM periods p JOIN period_types t ON t.id = p.period_type_id WHERE p.id = ? AND t.kind = ?', [id, kind]);
  return period;
};

const generateEditions = async (type, existingKeys) => {
  const inserts = buildPeriodInserts(type, existingKeys);
  if (inserts.length > 0) {
    await pool.query('INSERT INTO periods (period_type_id, start_date, end_date, expenses) VALUES ?', [inserts]);
  }
  return inserts.length;
};

const listPeriods = (kind) => async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.period_type_id, p.start_date, p.end_date, p.expenses, t.name AS type_name, ${PROFIT_SUM} AS profits
       FROM periods p
       JOIN period_types t ON t.id = p.period_type_id
       WHERE t.kind = ?
       ORDER BY p.start_date DESC`,
      [kind]
    );
    const periods = rows.map((row) => {
      const profits = Number(row.profits);
      const expenses = Number(row.expenses);
      return {
        id: row.id,
        period_type_id: row.period_type_id,
        name: periodLabel(row.type_name, row.start_date, row.end_date),
        start_date: row.start_date,
        end_date: row.end_date,
        expenses,
        profits,
        balance: Math.round((profits - expenses) * 100) / 100
      };
    });
    res.json(periods.filter((period) => matchesFilters(period, req.query)));
  } catch (err) {
    next(err);
  }
};

const createPeriod = (kind) => async (req, res, next) => {
  const data = normalizeDecimalFields(filterColumns(req.body, 'periods'), ['expenses']);
  try {
    if (!(await findType(data.period_type_id, kind))) return res.status(400).json({ error: 'Unknown period type' });
    const [result] = await pool.query('INSERT INTO periods SET ?', data);
    res.json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
};

const updatePeriod = (kind) => async (req, res, next) => {
  const data = normalizeDecimalFields(filterColumns(req.body, 'periods'), ['expenses']);
  try {
    if (!(await findPeriod(req.params.id, kind))) return res.status(404).json({ error: 'Period not found' });
    const [result] = await pool.query('UPDATE periods SET ? WHERE id = ?', [data, req.params.id]);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const removePeriod = (kind) => async (req, res, next) => {
  try {
    if (!(await findPeriod(req.params.id, kind))) return res.status(404).json({ error: 'Period not found' });
    const [result] = await pool.query('DELETE FROM periods WHERE id = ?', [req.params.id]);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const listTypes = (kind) => async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, COUNT(p.id) AS editions
       FROM period_types t
       LEFT JOIN periods p ON p.period_type_id = t.id
       WHERE t.kind = ?
       GROUP BY t.id
       ORDER BY t.name`,
      [kind]
    );
    res.json(rows.filter((row) => matchesFilters(row, req.query)));
  } catch (err) {
    next(err);
  }
};

const createType = (kind) => async (req, res, next) => {
  const data = { ...filterColumns(req.body, 'period_types'), kind };
  try {
    const [result] = await pool.query('INSERT INTO period_types SET ?', data);
    const type = await findType(result.insertId, kind);
    const editions = await generateEditions(type);
    res.json({ id: result.insertId, editions });
  } catch (err) {
    next(err);
  }
};

const updateType = (kind) => async (req, res, next) => {
  const data = filterColumns(req.body, 'period_types');
  delete data.kind;
  if (Object.keys(data).length === 0) return res.status(400).json({ error: 'Nothing to update' });
  try {
    if (!(await findType(req.params.id, kind))) return res.status(404).json({ error: 'Period type not found' });
    const [result] = await pool.query('UPDATE period_types SET ? WHERE id = ?', [data, req.params.id]);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const removeType = (kind) => async (req, res, next) => {
  try {
    if (!(await findType(req.params.id, kind))) return res.status(404).json({ error: 'Period type not found' });
    const [result] = await pool.query('DELETE FROM period_types WHERE id = ?', [req.params.id]);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const syncTypes = (kind) => async (req, res, next) => {
  try {
    const [types] = await pool.query('SELECT * FROM period_types WHERE kind = ?', [kind]);
    const [existing] = await pool.query(
      'SELECT p.period_type_id, YEAR(p.start_date) AS year FROM periods p JOIN period_types t ON t.id = p.period_type_id WHERE t.kind = ?',
      [kind]
    );
    const existingKeys = new Set(existing.map((row) => `${row.period_type_id}-${row.year}`));
    let created = 0;
    for (const type of types) {
      created += await generateEditions(type, existingKeys);
    }
    res.json({ message: `${kind} editions up to date.`, created });
  } catch (err) {
    next(err);
  }
};

module.exports = { listPeriods, createPeriod, updatePeriod, removePeriod, listTypes, createType, updateType, removeType, syncTypes };