const pool = require('../config/db');
const { citiesQuery } = require('../utils/clientOptions');

const names = ([rows]) => rows.map((row) => row.name);

const getOptions = async (req, res, next) => {
  try {
    const cities = citiesQuery(req.query.province);
    const [provinces, citiesRows, count] = await Promise.all([
      pool.query("SELECT DISTINCT province AS name FROM clients WHERE province IS NOT NULL AND province <> '' ORDER BY province"),
      pool.query(cities.sql, cities.values),
      pool.query('SELECT COUNT(*) AS total FROM clients')
    ]);
    res.json({ provinces: names(provinces), cities: names(citiesRows), total: Number(count[0][0].total) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOptions };