const GROUPS = {
  month: "DATE_FORMAT(v.sold_at, '%Y-%m')",
  year: "DATE_FORMAT(v.sold_at, '%Y')"
};

const readBy = (value) => {
  if (value === undefined) return { by: 'month' };
  if (typeof value !== 'string' || !Object.hasOwn(GROUPS, value)) return { error: 'Unknown grouping, expected month or year' };
  return { by: value };
};

const groupExpression = (by) => GROUPS[by];

const buildExpenses = ({ by, rows, totals, range }) => ({
  by,
  range: range ?? (totals.first ? { from: totals.first, to: totals.last } : null),
  totals: { amount: Number(totals.amount ?? 0), cost: Number(totals.cost ?? 0), profit: Number(totals.profit ?? 0) },
  rows: rows.map((row) => ({ key: row.period, amount: Number(row.amount), cost: Number(row.cost), profit: Number(row.profit) }))
});

module.exports = { readBy, groupExpression, buildExpenses };