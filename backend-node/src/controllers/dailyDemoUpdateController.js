const crypto = require('node:crypto');
const { dailyProcessDate, buildDailySales, buildCurrentYearEditions } = require('../utils/dailyDemoData');

const isAuthorized = (authorization, secret) => {
  if (!secret || typeof authorization !== 'string') return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(authorization);
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
};

const runDailyDemoUpdate = async ({ db = require('../config/db'), now = new Date() } = {}) => {
  const date = dailyProcessDate(now);
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    try {
      await connection.query('INSERT INTO demo_update_days (process_date) VALUES (?)', [date]);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        await connection.rollback();
        return { date, alreadyProcessed: true, tickets: 0, lines: 0, editions: 0 };
      }
      throw err;
    }
    const [catalog] = await connection.query(
      `SELECT sl.product_id, sl.size, sl.unit_price, sl.unit_cost
       FROM sale_lines sl
       JOIN (SELECT product_id, MIN(id) AS line_id FROM sale_lines GROUP BY product_id) first_line ON first_line.line_id = sl.id
       ORDER BY sl.product_id`
    );
    const sales = buildDailySales({ date, catalog, now });
    for (const ticket of sales.tickets) {
      const [result] = await connection.query('INSERT INTO tickets (sold_at) VALUES (?)', [ticket.soldAt]);
      ticket.id = result.insertId;
    }
    if (sales.lines.length) {
      const rows = sales.lines.map((line) => [sales.tickets[line.ticketIndex].id, line.productId, line.size, line.units, line.unitPrice, line.unitCost]);
      await connection.query('INSERT INTO sale_lines (ticket_id, product_id, size, units, unit_price, unit_cost) VALUES ?', [rows]);
    }
    const [types] = await connection.query('SELECT * FROM period_types');
    const [periods] = await connection.query('SELECT period_type_id, start_date, end_date FROM periods');
    const editions = buildCurrentYearEditions({ types, existingPeriods: periods, date });
    if (editions.length) {
      await connection.query('INSERT INTO periods (period_type_id, start_date, end_date, expenses) VALUES ?', [editions]);
    }
    await connection.commit();
    return { date, alreadyProcessed: false, tickets: sales.tickets.length, lines: sales.lines.length, editions: editions.length };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const dailyDemoUpdate = async (req, res) => {
  if (!isAuthorized(req.get('authorization'), process.env.CRON_SECRET)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const result = await runDailyDemoUpdate();
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error('Daily demo data update failed:', err);
    return res.status(500).json({ error: 'Daily demo data update failed' });
  }
};

module.exports = { isAuthorized, runDailyDemoUpdate, dailyDemoUpdate };