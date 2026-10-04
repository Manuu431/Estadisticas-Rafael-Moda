const pool = require('../config/db');
const { mergeBreakdown } = require('../utils/compare');
const { readBy, groupExpression, buildExpenses } = require('../utils/expenses');

const SECTIONS = ['mujer', 'hombre'];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const WINDOW = 'v.sold_at >= ? AND v.sold_at < DATE_ADD(?, INTERVAL 1 DAY)';

const readQuery = (query, keys) => {
  const dates = {};
  for (const key of keys) {
    const value = query[key];
    if (typeof value !== 'string' || !ISO_DATE.test(value)) return { error: `Missing or invalid ${key}, expected YYYY-MM-DD` };
    dates[key] = value;
  }
  const section = query.section ?? '';
  if (section !== '' && !SECTIONS.includes(section)) return { error: 'Unknown section' };
  return { dates, section: section || null };
};

const where = (section) => `${WINDOW}${section ? ' AND v.section = ?' : ''}`;
const args = (from, to, section) => (section ? [from, to, section] : [from, to]);

const summarize = async (from, to, section) => {
  const [[row]] = await pool.query(
    `SELECT ROUND(COALESCE(SUM(v.amount), 0), 2) AS total,
            COALESCE(SUM(v.units), 0) AS units,
            COUNT(DISTINCT v.ticket_id) AS tickets,
            ROUND(COALESCE(SUM(CASE WHEN v.section = 'mujer' THEN v.amount END), 0), 2) AS mujer,
            ROUND(COALESCE(SUM(CASE WHEN v.section = 'hombre' THEN v.amount END), 0), 2) AS hombre,
            ROUND(COALESCE(SUM(v.profit), 0), 2) AS profit,
            MAX(v.sold_at) AS lastSale
     FROM v_sales v WHERE ${where(section)}`,
    args(from, to, section)
  );
  return {
    total: Number(row.total),
    units: Number(row.units),
    tickets: Number(row.tickets),
    mujer: Number(row.mujer),
    hombre: Number(row.hombre),
    profit: Number(row.profit),
    lastSale: row.lastSale
  };
};

const daily = async (from, to, section) => {
  const [rows] = await pool.query(
    `SELECT v.sale_date AS date, ROUND(SUM(v.amount), 2) AS total
     FROM v_sales v WHERE ${where(section)}
     GROUP BY v.sale_date ORDER BY v.sale_date`,
    args(from, to, section)
  );
  return rows.map((row) => ({ date: row.date, total: Number(row.total) }));
};

const ranking = async (from, to, section) => {
  const [rows] = await pool.query(
    `SELECT v.brand AS name, ROUND(SUM(v.amount), 2) AS total, COALESCE(SUM(v.units), 0) AS units
     FROM v_sales v WHERE ${where(section)}
     GROUP BY v.brand ORDER BY total DESC, name ASC`,
    args(from, to, section)
  );
  const brands = rows.map((row) => ({ name: row.name, total: Number(row.total), units: Number(row.units) }));
  return {
    ranking: brands.slice(0, 5),
    total: Math.round(brands.reduce((sum, brand) => sum + brand.total, 0) * 100) / 100
  };
};

const GROUPS = {
  brand: 'v.brand',
  family: 'v.family',
  section: 'v.section',
  size: 'v.size',
  color: "COALESCE(v.color, 'Sin color')"
};

const grouped = async (column, from, to) => {
  const [rows] = await pool.query(
    `SELECT ${column} AS name, ROUND(SUM(v.amount), 2) AS total
     FROM v_sales v WHERE ${WINDOW}
     GROUP BY ${column}`,
    [from, to]
  );
  return rows.map((row) => ({ name: row.name, total: Number(row.total) }));
};

const breakdown = async (column, a, b) => {
  const [rowsA, rowsB] = await Promise.all([grouped(column, a.from, a.to), grouped(column, b.from, b.to)]);
  return mergeBreakdown(rowsA, rowsB);
};

const getSummary = async (req, res, next) => {
  const parsed = readQuery(req.query, ['from', 'to', 'comparedFrom', 'comparedTo']);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const { dates, section } = parsed;
  try {
    const [summary, compared] = await Promise.all([
      summarize(dates.from, dates.to, section),
      summarize(dates.comparedFrom, dates.comparedTo, section)
    ]);
    res.json({ summary, compared });
  } catch (err) {
    next(err);
  }
};

const getDaily = async (req, res, next) => {
  const parsed = readQuery(req.query, ['from', 'to', 'comparedFrom', 'comparedTo']);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const { dates, section } = parsed;
  try {
    const [days, comparedDays] = await Promise.all([
      daily(dates.from, dates.to, section),
      daily(dates.comparedFrom, dates.comparedTo, section)
    ]);
    res.json({ days, comparedDays });
  } catch (err) {
    next(err);
  }
};

const getBrands = async (req, res, next) => {
  const parsed = readQuery(req.query, ['from', 'to']);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  try {
    res.json(await ranking(parsed.dates.from, parsed.dates.to, parsed.section));
  } catch (err) {
    next(err);
  }
};

const getCompare = async (req, res, next) => {
  const parsed = readQuery(req.query, ['aFrom', 'aTo', 'bFrom', 'bTo']);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  const { aFrom, aTo, bFrom, bTo } = parsed.dates;
  const a = { from: aFrom, to: aTo };
  const b = { from: bFrom, to: bTo };
  try {
    const [summaryA, summaryB, daysA, daysB, ...groups] = await Promise.all([
      summarize(aFrom, aTo, null),
      summarize(bFrom, bTo, null),
      daily(aFrom, aTo, null),
      daily(bFrom, bTo, null),
      ...Object.values(GROUPS).map((column) => breakdown(column, a, b))
    ]);
    const [brand, family, section, size, color] = groups;
    res.json({
      a: { summary: summaryA, days: daysA },
      b: { summary: summaryB, days: daysB },
      breakdown: { brand, family, section, size, color }
    });
  } catch (err) {
    next(err);
  }
};

const SUMS = `ROUND(SUM(v.amount), 2) AS amount, ROUND(SUM(v.cost), 2) AS cost, ROUND(SUM(v.profit), 2) AS profit`;

const expenses = async (by, from, to) => {
  const filtered = from ? `WHERE ${WINDOW}` : '';
  const params = from ? [from, to] : [];
  const period = groupExpression(by);
  const [[rows], [[totals]]] = await Promise.all([
    pool.query(
      `SELECT ${period} AS period, ${SUMS}
       FROM v_sales v ${filtered}
       GROUP BY ${period} ORDER BY period`,
      params
    ),
    pool.query(`SELECT ${SUMS}, MIN(v.sale_date) AS first, MAX(v.sale_date) AS last FROM v_sales v ${filtered}`, params)
  ]);
  return buildExpenses({ by, rows, totals, range: from ? { from, to } : null });
};

const getExpenses = async (req, res, next) => {
  const grouping = readBy(req.query.by);
  if (grouping.error) return res.status(400).json({ error: grouping.error });
  let dates = {};
  if (grouping.by === 'month') {
    const parsed = readQuery(req.query, ['from', 'to']);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    dates = parsed.dates;
  }
  try {
    res.json(await expenses(grouping.by, dates.from, dates.to));
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary, getDaily, getBrands, getCompare, getExpenses };
