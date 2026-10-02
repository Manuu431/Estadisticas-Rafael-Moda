const sources = {
  sales: 'v_sales',
  clients: 'clients',
  brands: 'brands',
  families: 'families',
  products: 'products'
};

const allowedColumns = {
  sales: ['id', 'ticket_id', 'sold_at', 'sale_date', 'product_id', 'product', 'color', 'section', 'brand', 'family', 'family_category', 'size', 'units', 'unit_price', 'unit_cost', 'amount', 'cost', 'profit'],
  clients: ['id', 'name', 'postal_code', 'province', 'city'],
  brands: ['id', 'name'],
  families: ['id', 'name', 'category'],
  products: ['id', 'name', 'brand_id', 'family_id', 'section', 'color'],
  periods: ['id', 'period_type_id', 'start_date', 'end_date', 'expenses'],
  period_types: ['id', 'kind', 'name', 'start_day', 'start_month', 'end_day', 'end_month', 'first_year', 'repeats']
};

const searchColumns = {
  sales: ['product', 'brand', 'color']
};

const exactColumns = ['size', 'section', 'brand', 'family', 'color'];

const numericColumns =['id', 'ticket_id', 'product_id', 'brand_id', 'family_id', 'units', 'unit_price', 'unit_cost', 'amount', 'cost', 'profit', 'expenses', 'period_type_id', 'start_day', 'start_month', 'end_day', 'end_month', 'first_year', 'repeats'];

const filterColumns = (data, resource) => {
  const columns = allowedColumns[resource] || [];
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
      newData[field] = 0;
    } else {
      newData[field] = parseFloat(newData[field]);
    }
  });
  return newData;
};

module.exports = { sources, allowedColumns, searchColumns, exactColumns, numericColumns,filterColumns, normalizeDecimalFields };