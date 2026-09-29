const allowedTables = ['campaigns', 'seasons', 'season_types', 'campaign_types'];

const allowedColumns = {
  sales: ['id', 'model', 'family', 'color', 'size', 'brand', 'pvd', 'pvp', 'units', 'discount', 'profit', 'sale_date'],
  clients: ['id', 'name', 'postal_code', 'province', 'city'],
  campaigns: ['id', 'name', 'start_date', 'end_date', 'expenses', 'profits', 'campaign_type_id'],
  seasons: ['id', 'name', 'start_date', 'end_date', 'expenses', 'profits', 'season_type_id'],
  season_types: ['id', 'name', 'start_day', 'start_month', 'end_day', 'end_month', 'start_year'],
  campaign_types: ['id', 'name', 'start_day', 'start_month', 'end_day', 'end_month', 'start_year']
};

const numericColumns = ['id', 'pvd', 'pvp', 'units', 'discount', 'profit', 'expenses', 'profits', 'campaign_type_id', 'season_type_id', 'start_day', 'start_month', 'end_day', 'end_month', 'start_year'];

const filterColumns = (data, endpoint) => {
  const columns = allowedColumns[endpoint] || [];
  const filtered = {};
  for (const key in data) {
    if (key !== 'id' && columns.includes(key)) filtered[key] = data[key];
  }
  return filtered;
};

const normalizeDecimalFields = (data, fields) => {
  const newData = { ...data };
  fields.forEach((field) => {
    if (newData[field] === '' || newData[field] === undefined || newData[field] === null) {
      newData[field] = null;
    } else {
      newData[field] = parseFloat(newData[field]);
    }
  });
  return newData;
};

module.exports = { allowedTables, allowedColumns, numericColumns, filterColumns, normalizeDecimalFields };