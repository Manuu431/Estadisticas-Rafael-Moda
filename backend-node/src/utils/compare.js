const mergeBreakdown = (rowsA, rowsB) => {
  const merged = new Map();
  for (const row of rowsA) merged.set(row.name, { name: row.name, a: row.total, b: 0 });
  for (const row of rowsB) {
    const found = merged.get(row.name);
    if (found) found.b = row.total;
    else merged.set(row.name, { name: row.name, a: 0, b: row.total });
  }
  return [...merged.values()]
    .sort((x, y) => y.a - x.a || y.b - x.b || String(x.name).localeCompare(String(y.name), 'es'));
};

module.exports = { mergeBreakdown };
