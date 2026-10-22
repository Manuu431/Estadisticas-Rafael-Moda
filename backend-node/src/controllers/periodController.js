const pool = require('../config/db');
const { filterColumns, normalizeDecimalFields } = require('../utils/columns');
const { periodLabel, editionDates, buildPeriodInserts, validateType, isFrozen } = require('../utils/dates');

const SECTIONS = ['mujer', 'hombre'];
const WINDOW = 'v.sold_at >= p.start_date AND v.sold_at < DATE_ADD(p.end_date, INTERVAL 1 DAY)';
const PROFIT_SUM = `ROUND(COALESCE((SELECT SUM(v.profit) FROM v_sales v WHERE ${WINDOW}), 0), 2)`;
const SECTION_PROFIT_SUM = `ROUND(COALESCE((SELECT SUM(v.profit) FROM v_sales v WHERE ${WINDOW} AND v.section = ?), 0), 2)`;
const SECTION_SHARE = `COALESCE((SELECT SUM(CASE WHEN v.section = ? THEN v.amount END) / NULLIF(SUM(v.amount), 0) FROM v_sales v WHERE ${WINDOW}), 0)`;
const round2 = (value) => Math.round(value * 100) / 100;

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
  const [[period]] = await pool.query('SELECT p.id, p.start_date, p.skipped FROM periods p JOIN period_types t ON t.id = p.period_type_id WHERE p.id = ? AND t.kind = ?', [id, kind]);
  return period;
};

const sendError = (err, res, next) => {
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'That name or date already exists' });
  next(err);
};

const generateEditions = async (type, existingKeys) => {
  const inserts = buildPeriodInserts(type, existingKeys);
  if (inserts.length > 0) {
    await pool.query('INSERT INTO periods (period_type_id, start_date, end_date, expenses) VALUES ?', [inserts]);
  }
  return inserts.length;
};

const listPeriods = (kind) => async (req, res, next) => {
  const section = req.query.section ?? '';
  const includeSkipped = req.query.include_skipped === '1';
  if (section !== '' && !SECTIONS.includes(section)) return res.status(400).json({ error: 'Unknown section' });
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.period_type_id, p.start_date, p.end_date, p.expenses, p.skipped, t.name AS type_name,
              ${section ? SECTION_PROFIT_SUM : PROFIT_SUM} AS profits,
              ${section ? SECTION_SHARE : 1} AS expense_share
       FROM periods p
       JOIN period_types t ON t.id = p.period_type_id
       WHERE t.kind = ?${includeSkipped ? '' : ' AND p.skipped = 0'}
       ORDER BY p.start_date DESC`,
      section ? [section, section, kind] : [kind]
    );
    const periods = rows.map((row) => {
      const profits = Number(row.profits);
      const expenses = round2(Number(row.expenses) * Number(row.expense_share));
      return {
        id: row.id,
        period_type_id: row.period_type_id,
        name: periodLabel(row.type_name, row.start_date, row.end_date),
        type_name: row.type_name,
        start_date: row.start_date,
        end_date: row.end_date,
        skipped: row.skipped === 1,
        expenses,
        profits,
        balance: round2(profits - expenses)
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
  const data = filterColumns(req.body, 'periods');
  if ('expenses' in data) data.expenses = normalizeDecimalFields(data, ['expenses']).expenses;
  try {
    const period = await findPeriod(req.params.id, kind);
    if (!period) return res.status(404).json({ error: 'Period not found' });
    if (isFrozen(period.start_date)) {
      for (const key of ['period_type_id', 'start_date', 'end_date']) delete data[key];
    } else if (data.period_type_id && !(await findType(data.period_type_id, kind))) {
      return res.status(400).json({ error: 'Unknown period type' });
    }
    if (Object.keys(data).length === 0) return res.status(400).json({ error: 'Nothing to update' });
    const [result] = await pool.query('UPDATE periods SET ? WHERE id = ?', [data, req.params.id]);
    res.json(result);
  } catch (err) {
    sendError(err, res, next);
  }
};

const skipPeriod = (kind) => async (req, res, next) => {
  try {
    const period = await findPeriod(req.params.id, kind);
    if (!period) return res.status(404).json({ error: 'Period not found' });
    if (isFrozen(period.start_date)) return res.status(409).json({ error: 'This edition has already started' });
    await pool.query('UPDATE periods SET skipped = NOT skipped WHERE id = ?', [req.params.id]);
    res.json({ skipped: !period.skipped });
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
  const problem = validateType(data);
  if (problem) return res.status(400).json({ error: problem });
  try {
    const [result] = await pool.query('INSERT INTO period_types SET ?', data);
    const type = await findType(result.insertId, kind);
    const editions = await generateEditions(type);
    res.json({ id: result.insertId, editions });
  } catch (err) {
    sendError(err, res, next);
  }
};

const updateType = (kind) => async (req, res, next) => {
  const data = filterColumns(req.body, 'period_types');
  delete data.kind;
  if (Object.keys(data).length === 0) return res.status(400).json({ error: 'Nothing to update' });
  try {
    const current = await findType(req.params.id, kind);
    if (!current) return res.status(404).json({ error: 'Period type not found' });
    const merged = { ...current, ...data };
    const problem = validateType(merged);
    if (problem) return res.status(400).json({ error: problem });
    const [result] = await pool.query('UPDATE period_types SET ? WHERE id = ?', [data, req.params.id]);
    const [editions] = await pool.query('SELECT id, YEAR(start_date) AS year, start_date FROM periods WHERE period_type_id = ?', [req.params.id]);
    for (const edition of editions.filter((row) => !isFrozen(row.start_date))) {
      const [start, end] = editionDates(merged, edition.year);
      await pool.query('UPDATE periods SET start_date = ?, end_date = ? WHERE id = ?', [start, end, edition.id]);
    }
    res.json(result);
  } catch (err) {
    sendError(err, res, next);
  }
};

const removeType = (kind) => async (req, res, next) => {
  try {
    if (!(await findType(req.params.id, kind))) return res.status(404).json({ error: 'Period type not found' });
    const [[{ started }]] = await pool.query('SELECT COUNT(*) AS started FROM periods WHERE period_type_id = ? AND start_date <= CURDATE()', [req.params.id]);
    if (started > 0) return res.status(409).json({ error: 'This type has editions that already started; stop it repeating instead' });
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

module.exports = { listPeriods, createPeriod, updatePeriod, skipPeriod, removePeriod, listTypes, createType, updateType, removeType, syncTypes };