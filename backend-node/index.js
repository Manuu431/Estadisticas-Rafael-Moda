const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
    console.error('Missing JWT_SECRET in .env');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const connection = await pool.getConnection();
        connection.release();
        console.log('Connected to the MySQL database');
    } catch (err) {
        console.error(`Error connecting to MySQL: ${err}`);
    }
})();

const allowedTables = ['campaigns', 'seasons', 'season_types', 'campaign_types'];

const allowedColumns = {
    sales: ['id', 'model', 'family', 'color', 'size', 'brand', 'pvd', 'pvp', 'units', 'discount', 'profit', 'sale_date'],
    clients: ['id', 'name', 'postal_code', 'province', 'city'],
    campaigns: ['id', 'name', 'start_date', 'end_date', 'expenses', 'profits', 'campaign_type_id'],
    seasons: ['id', 'name', 'start_date', 'end_date', 'expenses', 'profits', 'season_type_id'],
    season_types: ['id', 'name', 'start_day', 'start_month', 'end_day', 'end_month', 'start_year'],
    campaign_types: ['id', 'name', 'start_day', 'start_month', 'end_day', 'end_month', 'start_year']
};

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

const makeGet = (endpoint) => {
    app.get(`/api/${endpoint}`, async (req, res, next) => {
        const filters = req.query;

        let query = `SELECT * FROM ${endpoint}`;
        const conditions = [];
        const values = [];
        const columns = allowedColumns[endpoint] || [];

        for (const key in filters) {
            const value = filters[key];
            if (value === undefined || value === null || value === '') continue;

            const column = key.replace(/_(min|max)$/, '');
            if (!columns.includes(column)) continue;

            if (key.endsWith('_min') || key.startsWith('start')) {
                conditions.push(`${column} >= ?`);
                values.push(value);
            } else if (key.endsWith('_max') || key.startsWith('end')) {
                conditions.push(`${column} <= ?`);
                values.push(value);
            } else if (Array.isArray(value)) {
                const placeholders = value.map(() => '?').join(', ');
                conditions.push(`${column} IN (${placeholders})`);
                values.push(...value);
            } else {
                if (!isNaN(value)) {
                    conditions.push(`${column} = ?`);
                    values.push(parseFloat(value));
                } else {
                    if (key === 'size') {
                        conditions.push(`${column} LIKE ?`);
                        values.push(`${value}`);
                    } else {
                        conditions.push(`${column} LIKE ?`);
                        values.push(`%${value}%`);
                    }
                }
            }
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        try {
            const [results] = await pool.query(query, values);
            res.json(results);
        } catch (err) {
            next(err);
        }
    });
};

const makePost = (endpoint) => {
  if (!allowedTables.includes(endpoint)) return;

  app.post(`/api/${endpoint}`, async (req, res, next) => {
    let data = filterColumns(req.body, endpoint);

    if (endpoint === 'seasons' || endpoint === 'campaigns') {
      data = normalizeDecimalFields(data, ['expenses', 'profits']);
    }

    try {
      if (endpoint === 'season_types') {
        const [result] = await pool.query(`INSERT INTO season_types SET ?`, data);
        const newId = result.insertId;
        const [[newType]] = await pool.query(`SELECT * FROM season_types WHERE id = ?`, [newId]);

        const currentYear = new Date().getFullYear();
        const inserts = buildTypeInserts(newType, newType.start_year || currentYear, currentYear);

        if (inserts.length > 0) {
          await pool.query('INSERT INTO seasons (name, start_date, end_date, expenses, profits, season_type_id) VALUES ?', [inserts]);
        }

        return res.json({ message: 'Season type and seasons created', season_type_id: newId });

      } else if (endpoint === 'campaign_types') {
        const [result] = await pool.query(`INSERT INTO campaign_types SET ?`, data);
        const newId = result.insertId;
        const [[newType]] = await pool.query(`SELECT * FROM campaign_types WHERE id = ?`, [newId]);

        const currentYear = new Date().getFullYear();
        const inserts = buildTypeInserts(newType, newType.start_year || currentYear, currentYear);

        if (inserts.length > 0) {
          await pool.query('INSERT INTO campaigns (name, start_date, end_date, expenses, profits, campaign_type_id) VALUES ?', [inserts]);
        }

        return res.json({ message: 'Campaign type and campaigns created', campaign_type_id: newId });

      } else {
        const [results] = await pool.query(`INSERT INTO ${endpoint} SET ?`, data);
        return res.json(results);
      }

    } catch (err) {
      next(err);
    }
  });
};

const makeUpdate = (endpoint) => {
    if (!allowedTables.includes(endpoint)) return;
    app.put(`/api/${endpoint}/:id`, async (req, res, next) => {
        let data = filterColumns(req.body, endpoint);
        const id = req.params.id;

        if (endpoint === 'seasons' || endpoint === 'campaigns') {
            data = normalizeDecimalFields(data, ['expenses', 'profits']);
        }

        try {
            const [results] = await pool.query(`UPDATE ${endpoint} SET ? WHERE id = ?`, [data, id]);
            res.json(results);
        } catch (err) {
            next(err);
        }
    });
};

const makeDelete = (endpoint) => {
    if (!allowedTables.includes(endpoint)) return;
    app.delete(`/api/${endpoint}/:id`, async (req, res, next) => {
        const id = req.params.id;
        try {
            const [results] = await pool.query(`DELETE FROM ${endpoint} WHERE id = ?`, [id]);
            res.json(results);
        } catch (err) {
            next(err);
        }
    });
};

const makeSyncPost = ({ endpoint, typeTable, targetTable, foreignKey }) => {
  app.post(`/api/${endpoint}/sync`, async (req, res, next) => {
    try {
      const [types] = await pool.query(`SELECT * FROM ${typeTable}`);
      const [existingEntries] = await pool.query(`SELECT ${foreignKey}, start_date FROM ${targetTable}`);

      const currentYear = new Date().getFullYear();
      const existingKeys = new Set(
        existingEntries.map(e => `${e[foreignKey]}-${new Date(e.start_date).getFullYear()}`)
      );

      const inserts = [];

      for (const type of types) {
        inserts.push(...buildTypeInserts(type, type.start_year || 2000, currentYear, existingKeys));
      }

      if (inserts.length > 0) {
        await pool.query(
          `INSERT INTO ${targetTable} (name, start_date, end_date, expenses, profits, ${foreignKey}) VALUES ?`,
          [inserts]
        );
      }

      res.json({ message: `${targetTable} up to date.` });
    } catch (err) {
      next(err);
    }
  });
};

app.post('/api/users', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

  try {
    const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, username: user.email } });
  } catch (err) {
    next(err);
  }
});

const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });
    try {
        req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

app.use(authMiddleware);

makeGet('sales');
makeGet('clients');
makeGet('campaigns');
makeGet('seasons');
makeGet('season_types');
makeGet('campaign_types');

makePost('campaigns');
makePost('seasons');
makePost('season_types');
makePost('campaign_types');

makeUpdate('campaigns');
makeUpdate('seasons');
makeUpdate('season_types');
makeUpdate('campaign_types');

makeDelete('campaigns');
makeDelete('seasons');
makeDelete('season_types');
makeDelete('campaign_types');

makeSyncPost({
  endpoint: 'campaign_types',
  typeTable: 'campaign_types',
  targetTable: 'campaigns',
  foreignKey: 'campaign_type_id',
});

makeSyncPost({
  endpoint: 'season_types',
  typeTable: 'season_types',
  targetTable: 'seasons',
  foreignKey: 'season_type_id',
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});