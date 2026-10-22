const { allowedColumns, searchColumns, exactColumns, numericColumns } = require('./columns');
const { likeSearch } = require('./search');

const PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 500;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isText = (item) => typeof item === 'string';

const isRealDate = (value) => {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const buildConditions = (resource, filters) => {
  const columns = allowedColumns[resource] || [];
  const conditions = [];
  const values = [];

  for (const key in filters) {
    const value = filters[key];
    if (value === undefined || value === null || value === '') continue;
    if (!(Array.isArray(value) ? value.every(isText) : isText(value))) continue;

    const column = key.replace(/_(min|max)$/, '');
    if (!columns.includes(column)) continue;

    if (resource === 'sales' && column === 'sale_date' && /_(min|max)$/.test(key)) {
      if (!isRealDate(value)) continue;
      conditions.push(key.endsWith('_min') ? '`sold_at` >= ?' : '`sold_at` < DATE_ADD(?, INTERVAL 1 DAY)');
      values.push(value);
    } else if (key.endsWith('_min')) {
      conditions.push(`\`${column}\` >= ?`);
      values.push(value);
    } else if (key.endsWith('_max')) {
      conditions.push(`\`${column}\` <= ?`);
      values.push(value);
    } else if (Array.isArray(value)) {
      const placeholders = value.map(() => '?').join(', ');
      conditions.push(`\`${column}\` IN (${placeholders})`);
      values.push(...value);
    } else if (numericColumns.includes(column)) {
      conditions.push(`\`${column}\` = ?`);
      values.push(parseFloat(value));
    } else if (exactColumns.includes(column)) {
      conditions.push(`\`${column}\` = ?`);
      values.push(value);
    } else {
      conditions.push(`\`${column}\` LIKE ?`);
      values.push(`%${value}%`);
    }
  }

  const search = likeSearch(filters.search, searchColumns[resource] || []);
  if (search) {
    conditions.push(search.sql);
    values.push(...search.values);
  }

  return { conditions, values };
};

const positiveInt = (value) => {
  const number = isText(value) ? Number(value) : NaN;
  return Number.isInteger(number) && number > 0 ? number : null;
};

const pageParams = (query) => {
  const offset = isText(query.offset) ? Number(query.offset) : NaN;
  return {
    limit: Math.min(positiveInt(query.limit) ?? PAGE_SIZE, MAX_PAGE_SIZE),
    offset: Number.isInteger(offset) && offset > 0 ? offset : 0
  };
};

module.exports = { buildConditions, pageParams };