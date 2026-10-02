const pool = require('../config/db');
const { sortSizes } = require('../utils/sizes');

const names = ([rows]) => rows.map((row) => row.name);

const getOptions = async (req, res, next) => {
  try {
    const [brands, families, colors, sizes] = await Promise.all([
      pool.query('SELECT name FROM brands ORDER BY name'),
      pool.query('SELECT name FROM families ORDER BY name'),
      pool.query("SELECT DISTINCT color AS name FROM products WHERE color IS NOT NULL AND color <> '' ORDER BY color"),
      pool.query('SELECT DISTINCT size AS name FROM sale_lines')
    ]);
    res.json({ brands: names(brands), families: names(families), colors: names(colors), sizes: sortSizes(names(sizes)) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOptions };