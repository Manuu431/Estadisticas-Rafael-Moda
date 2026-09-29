const formatDateISO = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const parseDate = (m, d, y) => formatDateISO(new Date(y, m - 1, d));

const buildTypeInserts = (type, startYear, endYear, existingKeys) => {
  const inserts = [];
  for (let year = startYear; year <= endYear; year++) {
    if (existingKeys && existingKeys.has(`${type.id}-${year}`)) continue;
    const isNextYear = type.end_month < type.start_month || (type.end_month === type.start_month && type.end_day < type.start_day);
    const name = isNextYear ? `${type.name} ${year}-${year + 1}` : `${type.name} ${year}`;
    const startDate = parseDate(type.start_month, type.start_day, year);
    const endDate = parseDate(type.end_month, type.end_day, isNextYear ? year + 1 : year);
    inserts.push([name, startDate, endDate, null, null, type.id]);
  }
  return inserts;
};

module.exports = { formatDateISO, parseDate, buildTypeInserts };