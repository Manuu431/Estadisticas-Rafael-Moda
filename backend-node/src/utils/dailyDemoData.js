const TIME_ZONE = 'Europe/Madrid';
const { editionDates } = require('./dates');
const HOUR_SLOTS = [[10, 60, 0.8], [11, 60, 1.2], [12, 60, 1.1], [13, 30, 0.5], [17, 60, 1], [18, 60, 1.5], [19, 60, 1.4], [20, 30, 0.6]];
const MONTH_WEIGHT = [1, 0.71, 0.79, 0.92, 1.01, 0.85, 0.5, 0.33, 0.69, 0.81, 0.87, 1.14];
const YEAR_FACTOR = { 2020: 0.552, 2021: 0.801, 2022: 1, 2023: 1.064, 2024: 1.117, 2025: 1.172, 2026: 1.33 };
const DOW_WEIGHT = [0, 0.82, 0.95, 1, 1.02, 1.12, 1.35];

const datePartsInMadrid = (date) => Object.fromEntries(
  new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(date).filter((part) => part.type !== 'literal').map(({ type, value }) => [type, Number(value)])
);

const formatDate = ({ year, month, day }) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const dailyProcessDate = (now = new Date()) => formatDate(datePartsInMadrid(now));

const seededRandom = (date) => {
  let state = [...date].reduce((value, char) => (Math.imul(value, 31) + char.charCodeAt(0)) | 0, 7);
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const weighted = (items, random) => {
  const total = items.reduce((sum, item) => sum + item[1], 0);
  let mark = random() * total;
  for (const [value, weight] of items) {
    mark -= weight;
    if (mark <= 0) return value;
  }
  return items.at(-1)[0];
};

const buildDailySales = ({ date, catalog, now = new Date() }) => {
  const todayInMadrid = formatDate(datePartsInMadrid(now));
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const parsed = match && new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  const validDate = parsed && formatDate({ year: parsed.getUTCFullYear(), month: parsed.getUTCMonth() + 1, day: parsed.getUTCDate() }) === date;
  if (!validDate) throw new Error('The sales date must be a valid date in Europe/Madrid');
  if (date > todayInMadrid) throw new Error('The sales date must not be in the future in Europe/Madrid');
  if (!catalog.length) throw new Error('No existing sale lines are available as demo templates');
  const [year, month, day] = date.split('-').map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  if (weekday === 0) return { tickets: [], lines: [] };
  const random = seededRandom(date);
  const between = (min, max) => min + random() * (max - min);
  const intBetween = (min, max) => Math.floor(between(min, max + 1));
  const monthlyWeight = MONTH_WEIGHT[month - 1];
  const yearlyWeight = YEAR_FACTOR[year] || 1.33;
  const target = 810 * yearlyWeight * monthlyWeight * DOW_WEIGHT[weekday] * between(0.72, 1.3);
  const ticketCount = Math.max(1, Math.round(target / 150));
  const tickets = [];
  const lines = [];
  for (let ticketIndex = 0; ticketIndex < ticketCount; ticketIndex++) {
    const slot = weighted(HOUR_SLOTS.map((entry) => [entry, entry[2]]), random);
    const minute = intBetween(0, slot[1] - 1);
    const second = intBetween(0, 59);
    const saleTicketIndex = tickets.length;
    tickets.push({ soldAt: `${date} ${String(slot[0]).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}` });
    const lineCount = weighted([[1, 60], [2, 28], [3, 9], [4, 3]], random);
    for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
      const template = catalog[Math.floor(random() * catalog.length)];
      const units = weighted([[1, 90], [2, 9], [3, 1]], random);
      lines.push({ ticketIndex: saleTicketIndex, productId: template.product_id, size: template.size, units, unitPrice: Number(template.unit_price), unitCost: Number(template.unit_cost) });
    }
  }
  return { tickets, lines };
};

const buildCurrentYearEditions = ({ types, existingPeriods, date }) => {
  const year = Number(date.slice(0, 4));
  const existingByTypeYear = new Set(existingPeriods.map((period) => `${period.period_type_id}-${String(period.start_date).slice(0, 4)}`));
  const manuallyMovedTypes = new Set();
  for (const period of existingPeriods) {
    const type = types.find((item) => Number(item.id) === Number(period.period_type_id));
    if (!type) continue;
    const periodYear = Number(String(period.start_date).slice(0, 4));
    const [expectedStart, expectedEnd] = editionDates(type, periodYear);
    if (String(period.start_date).slice(0, 10) !== expectedStart || String(period.end_date).slice(0, 10) !== expectedEnd) {
      manuallyMovedTypes.add(Number(type.id));
    }
  }
  const rows = [];
  for (const type of types) {
    if (!type.repeats || year < Number(type.first_year) || (type.last_year && year > Number(type.last_year))) continue;
    if (manuallyMovedTypes.has(Number(type.id))) continue;
    if (existingByTypeYear.has(`${type.id}-${year}`)) continue;
    const endYear = type.end_month < type.start_month || (type.end_month === type.start_month && type.end_day < type.start_day) ? year + 1 : year;
    const clampDate = (targetYear, month, day) => `${targetYear}-${String(month).padStart(2, '0')}-${String(Math.min(day, new Date(Date.UTC(targetYear, month, 0)).getUTCDate())).padStart(2, '0')}`;
    const startDate = clampDate(year, Number(type.start_month), Number(type.start_day));
    if (startDate <= date) continue;
    rows.push([type.id, startDate, clampDate(endYear, Number(type.end_month), Number(type.end_day)), 0]);
  }
  return rows;
};

module.exports = { TIME_ZONE, datePartsInMadrid, dailyProcessDate, buildDailySales, buildCurrentYearEditions };