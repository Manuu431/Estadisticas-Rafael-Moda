const formatDateISO = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const crossesYear = (type) => type.end_month < type.start_month || (type.end_month === type.start_month && type.end_day < type.start_day);

const periodLabel = (name, startDate, endDate) => {
  const startYear = Number(String(startDate).slice(0, 4));
  const endYear = Number(String(endDate).slice(0, 4));
  return endYear > startYear ? `${name} ${startYear}-${String(endYear % 100).padStart(2, '0')}` : `${name} ${startYear}`;
};

const buildPeriodInserts = (type, existingKeys, today = new Date()) => {
  const inserts = [];
  const lastYear = type.repeats ? today.getFullYear() : type.first_year;
  const crosses = crossesYear(type);
  for (let year = type.first_year; year <= lastYear; year++) {
    if (existingKeys && existingKeys.has(`${type.id}-${year}`)) continue;
    const startDate = new Date(year, type.start_month - 1, type.start_day);
    const endDate = new Date(crosses ? year + 1 : year, type.end_month - 1, type.end_day);
    inserts.push([type.id, formatDateISO(startDate), formatDateISO(endDate), 0]);
  }
  return inserts;
};

module.exports = { formatDateISO, crossesYear, periodLabel, buildPeriodInserts };