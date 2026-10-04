const CITIES = "SELECT DISTINCT city AS name FROM clients WHERE city IS NOT NULL AND city <> ''";

const citiesQuery = (province) => {
  if (typeof province !== 'string' || province === '') return { sql: `${CITIES} ORDER BY city`, values: [] };
  return { sql: `${CITIES} AND province = ? ORDER BY city`, values: [province] };
};

module.exports = { citiesQuery };