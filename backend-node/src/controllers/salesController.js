const pool = require('../config/db');
const { sortSizes } = require('../utils/sizes');
const { buildConditions, pageParams } = require('../utils/filters');

const names = ([rows]) => rows.map((row) => row.name);

const getOptions = async (req, res, next) => {
  try {
    const [brands, families, colors, sizes] = await Promise.all([
      pool.query('SELECT name FROM brands ORDER BY name'),
      pool.query('SELECT name FROM families ORDER BY name'),
      pool.query("SELECT DISTINCT color AS name FROM products WHERE color IS NOT NULL AND color <> '' ORDER BY color"),
      pool.query('SELECT DISTINCT size AS name FROM sale_lines')
    ]);
    res.json({ brands: names(brands), families: names(families), colors: names(colors), sizes: sortSizes(names(sizes)) });
  } catch (err) {
    next(err);
  }
};

const listSales = async (req, res, next) => {
  const { conditions, values } = buildConditions('sales', req.query);
  const where = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
  const { limit, offset } = pageParams(req.query);
  try {
    const [[rows], [[summary]]] = await Promise.all([
      pool.query(`SELECT * FROM v_sales${where} ORDER BY sold_at DESC, id DESC LIMIT ? OFFSET ?`, [...values, limit, offset]),
      pool.query(
        `SELECT COUNT(*) AS line_count, COALESCE(SUM(units), 0) AS units, COALESCE(SUM(amount), 0) AS amount, COALESCE(SUM(profit), 0) AS profit FROM v_sales${where}`,
        values
      )
    ]);
    const days = {};
    if (rows.length > 0) {
      const [dayRows] = await pool.query(
        `SELECT sale_date, ROUND(SUM(amount), 2) AS amount FROM v_sales${where ? `${where} AND` : ' WHERE'} sold_at >= ? AND sold_at < DATE_ADD(?, INTERVAL 1 DAY) GROUP BY sale_date`,
        [...values, rows[rows.length - 1].sale_date, rows[0].sale_date]
      );
      for (const day of dayRows) days[day.sale_date] = Number(day.amount);
    }
    res.json({
      rows,
      summary: { lines: Number(summary.line_count), units: Number(summary.units), amount: Number(summary.amount), profit: Number(summary.profit) },
      days
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOptions, listSales };