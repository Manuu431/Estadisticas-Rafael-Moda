const formatDateISO = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const crossesYear = (type) => type.end_month < type.start_month || (type.end_month === type.start_month && type.end_day < type.start_day);

const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

const buildDate = (year, month, day) => new Date(year, month - 1, Math.min(day, daysInMonth(year, month)));

const periodLabel = (name, startDate, endDate) => {
  const startYear = Number(String(startDate).slice(0, 4));
  const endYear = Number(String(endDate).slice(0, 4));
  return endYear > startYear ? `${name} ${startYear}-${String(endYear % 100).padStart(2, '0')}` : `${name} ${startYear}`;
};

const editionDates = (type, year) => {
  const endYear = crossesYear(type) ? year + 1 : year;
  return [formatDateISO(buildDate(year, type.start_month, type.start_day)), formatDateISO(buildDate(endYear, type.end_month, type.end_day))];
};

const buildPeriodInserts = (type, existingKeys, today = new Date()) => {
  const inserts = [];
  const limit = type.last_year ? Math.min(type.last_year, today.getFullYear()) : today.getFullYear();
  const lastYear = type.repeats ? limit : type.first_year;
  for (let year = type.first_year; year <= lastYear; year++) {
    if (existingKeys && existingKeys.has(`${type.id}-${year}`)) continue;
    inserts.push([type.id, ...editionDates(type, year), 0]);
  }
  return inserts;
};

const validateType = (type) => {
  if (!type.name || !String(type.name).trim()) return 'The name is required';
  for (const part of ['start', 'end']) {
    const month = Number(type[`${part}_month`]);
    const day = Number(type[`${part}_day`]);
    if (!Number.isInteger(month) || month < 1 || month > 12) return `The ${part} month is not valid`;
    if (!Number.isInteger(day) || day < 1 || day > daysInMonth(2000, month)) return `The ${part} day does not exist in that month`;
  }
  if (!Number.isInteger(Number(type.first_year))) return 'The first year is not valid';
  if (type.last_year !== undefined && type.last_year !== null && !Number.isInteger(Number(type.last_year))) return 'The last year is not valid';
  if (type.last_year !== undefined && type.last_year !== null && Number(type.last_year) < Number(type.first_year)) return 'The last year cannot be before the first year';
  return null;
};

const isFrozen = (startDate, today = new Date()) => String(startDate).slice(0, 10) <= formatDateISO(today);

const NUMBER_FIELDS = ['start_day', 'start_month', 'end_day', 'end_month', 'first_year', 'last_year'];
const DATE_FIELDS = ['start_day', 'start_month', 'end_day', 'end_month'];

const parseType = (data) => {
  const parsed = { ...data };
  for (const field of NUMBER_FIELDS) {
    if (field in parsed) parsed[field] = parsed[field] === '' || parsed[field] === null ? null : Number(parsed[field]);
  }
  if ('repeats' in parsed) parsed.repeats = [true, 1, '1', 'true'].includes(parsed.repeats) ? 1 : 0;
  return parsed;
};

const outOfRange = (type, year) => year < type.first_year || (!type.repeats && year !== type.first_year) || (type.last_year && year > type.last_year);

const planTypeUpdate = (current, data, editions, today = new Date()) => {
  const merged = { ...current, ...data };
  const datesChanged = DATE_FIELDS.some((field) => field in data && Number(data[field]) !== Number(current[field]));
  const plan = { redate: [], remove: [] };
  for (const edition of editions.filter((row) => !isFrozen(row.start_date, today))) {
    if (outOfRange(merged, edition.year)) {
      plan.remove.push(edition.id);
      continue;
    }
    const [oldStart, oldEnd] = editionDates(current, edition.year);
    const untouched = String(edition.start_date).slice(0, 10) === oldStart && String(edition.end_date).slice(0, 10) === oldEnd;
    if (datesChanged && untouched) {
      const [start, end] = editionDates(merged, edition.year);
      plan.redate.push({ id: edition.id, start, end });
    }
  }
  return plan;
};

module.exports = { formatDateISO, crossesYear, periodLabel, editionDates, buildPeriodInserts, validateType, isFrozen, parseType, planTypeUpdate };
